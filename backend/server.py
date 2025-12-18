from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import httpx
import base64
from collections import defaultdict
import time

# Try to import resend, but don't fail if not available
try:
    import resend
    RESEND_AVAILABLE = True
except ImportError:
    RESEND_AVAILABLE = False

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
SECRET_KEY = os.environ.get('JWT_SECRET', 'oria-fresh-secret-key-2026')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # Shortened for security
REFRESH_TOKEN_EXPIRE_DAYS = 7

# PayPal Settings
PAYPAL_CLIENT_ID = os.environ.get('PAYPAL_CLIENT_ID', '')
PAYPAL_CLIENT_SECRET = os.environ.get('PAYPAL_CLIENT_SECRET', '')
PAYPAL_ENV = os.environ.get('PAYPAL_ENV', 'sandbox')
PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com" if PAYPAL_ENV == 'sandbox' else "https://api-m.paypal.com"

# Email Settings (Resend)
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RESTAURANT_EMAIL = os.environ.get('RESTAURANT_EMAIL', 'info@oriafresh.de')

# Initialize Resend if available
if RESEND_AVAILABLE and RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Rate Limiting for Login
LOGIN_ATTEMPTS: Dict[str, list] = defaultdict(list)
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION = 900  # 15 minutes in seconds

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

app = FastAPI(title="ORIA FRESH API")
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

class ProductVariant(BaseModel):
    name: str  # "Single" or "Menü"
    price: float
    includes: Optional[str] = None  # e.g., "inkl. Pommes + Drink"

class ProductExtra(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float

class ProductCreate(BaseModel):
    name: str
    description: str
    category: str
    image: str
    allergens: Optional[str] = ""
    variants: List[ProductVariant]
    extras: List[ProductExtra] = []
    is_halal: bool = False
    is_bestseller: bool = False
    is_featured: bool = False  # Monthly Drop / Featured Item
    is_active: bool = True

class Product(ProductCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CategoryCreate(BaseModel):
    name: str
    slug: str
    icon: Optional[str] = ""
    order: int = 0

class Category(CategoryCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class CartItem(BaseModel):
    product_id: str
    product_name: str
    variant: str
    variant_price: float
    quantity: int
    extras: List[dict] = []
    total: float

class BonusItem(BaseModel):
    name: str
    value: float
    type: str  # "extra_sauce", "free_drink", "discount"

class OrderCreate(BaseModel):
    items: List[CartItem]
    customer_name: str
    customer_phone: str
    customer_email: EmailStr
    pickup_time: str  # "sofort", "15 min", etc.
    notes: Optional[str] = ""
    payment_method: str  # "paypal" or "pickup"
    subtotal: float
    total: float
    source: Optional[str] = "web"  # "web" or "qr"
    qr_bonus_applied: Optional[BonusItem] = None  # Track applied QR bonus

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    items: List[CartItem]
    customer_name: str
    customer_phone: str
    customer_email: str
    pickup_time: str
    notes: str = ""
    payment_method: str
    source: str = "web"  # "web" or "qr"
    subtotal: float
    total: float
    status: str = "pending"  # pending, paid, in_preparation, ready, picked_up, cancelled
    paypal_order_id: Optional[str] = None
    qr_bonus_applied: Optional[dict] = None  # Track QR bonus: {name, value, type}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class OpeningHours(BaseModel):
    day: str
    open: str
    close: str
    is_closed: bool = False

class QRBonus(BaseModel):
    enabled: bool = True
    bonus_type: str = "extra_sauce"  # "extra_sauce", "menu_discount", "free_drink"
    bonus_name: str = "Gratis Extra Sauce"
    bonus_value: float = 0.80  # Value in EUR (for discount types)

class Settings(BaseModel):
    opening_hours: List[OpeningHours] = []
    pickup_slots: List[str] = ["sofort", "15 min", "30 min", "45 min", "60 min"]
    restaurant_name: str = "ORIA FRESH"
    address: str = "Kirchenplatz 9, 18119 Rostock-Warnemünde"
    phone: str = "+49 381 7704 – 0"
    email: str = "info@oriafresh.de"
    qr_bonus: QRBonus = QRBonus()

# ============== AUTH HELPERS ==============

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "access":
            raise HTTPException(status_code=401, detail="Invalid token")
        admin = await db.admins.find_one({"email": email}, {"_id": 0})
        if admin is None:
            raise HTTPException(status_code=401, detail="Admin not found")
        return admin
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============== RATE LIMITING ==============

def check_rate_limit(email: str) -> bool:
    """Check if the email is rate limited. Returns True if allowed, False if blocked."""
    now = time.time()
    attempts = LOGIN_ATTEMPTS[email]
    # Clean up old attempts
    LOGIN_ATTEMPTS[email] = [t for t in attempts if now - t < LOCKOUT_DURATION]
    
    if len(LOGIN_ATTEMPTS[email]) >= MAX_LOGIN_ATTEMPTS:
        return False
    return True

def record_failed_attempt(email: str):
    """Record a failed login attempt."""
    LOGIN_ATTEMPTS[email].append(time.time())

def clear_attempts(email: str):
    """Clear login attempts after successful login."""
    LOGIN_ATTEMPTS[email] = []

# ============== EMAIL SERVICE (RESEND) ==============

def generate_order_email_html(order: dict, for_restaurant: bool = False) -> str:
    """Generate HTML email for order confirmation."""
    items_html = ""
    for item in order.get('items', []):
        extras_text = ""
        if item.get('extras'):
            extras_text = f"<br><small style='color:#666'>+ {', '.join(e.get('name', '') for e in item['extras'])}</small>"
        items_html += f"""
        <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">{item.get('quantity', 1)}x {item.get('product_name', '')}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;">{item.get('variant', '')}{extras_text}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">€{item.get('total', 0):.2f}</td>
        </tr>
        """
    
    if for_restaurant:
        return f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <div style="background:#22c55e;color:white;padding:20px;text-align:center;">
                <h1 style="margin:0;">🍔 Neue Bestellung!</h1>
            </div>
            <div style="padding:20px;background:#f8f8f8;">
                <h2 style="color:#333;">Bestellung #{order['id'][:8].upper()}</h2>
                <p><strong>Kunde:</strong> {order['customer_name']}</p>
                <p><strong>Telefon:</strong> <a href="tel:{order['customer_phone']}">{order['customer_phone']}</a></p>
                <p><strong>E-Mail:</strong> {order['customer_email']}</p>
                <p><strong>Abholzeit:</strong> <span style="color:#22c55e;font-weight:bold;">{order['pickup_time']}</span></p>
                <p><strong>Zahlung:</strong> {order['payment_method'].upper()}</p>
                {f"<p style='background:#fff3cd;padding:10px;border-radius:5px;'><strong>Anmerkungen:</strong> {order['notes']}</p>" if order.get('notes') else ""}
                
                <table style="width:100%;border-collapse:collapse;margin-top:15px;">
                    <thead>
                        <tr style="background:#22c55e;color:white;">
                            <th style="padding:10px;text-align:left;">Artikel</th>
                            <th style="padding:10px;text-align:left;">Variante</th>
                            <th style="padding:10px;text-align:right;">Preis</th>
                        </tr>
                    </thead>
                    <tbody>{items_html}</tbody>
                    <tfoot>
                        <tr style="background:#333;color:white;">
                            <td colspan="2" style="padding:10px;"><strong>GESAMT</strong></td>
                            <td style="padding:10px;text-align:right;"><strong>€{order['total']:.2f}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </body>
        </html>
        """
    else:
        return f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <div style="background:#0f172a;padding:20px;text-align:center;">
                <h1 style="margin:0;color:white;">ORIA <span style="color:#22c55e;">FRESH</span></h1>
            </div>
            <div style="padding:30px;background:#fff;">
                <h2 style="color:#22c55e;">✓ Bestellung bestätigt!</h2>
                <p>Hallo {order['customer_name']},</p>
                <p>vielen Dank für deine Bestellung! Wir bereiten alles frisch für dich zu.</p>
                
                <div style="background:#f1f5f9;padding:15px;border-radius:10px;margin:20px 0;">
                    <p style="margin:5px 0;"><strong>Bestellnummer:</strong> #{order['id'][:8].upper()}</p>
                    <p style="margin:5px 0;"><strong>Abholzeit:</strong> {order['pickup_time']}</p>
                    <p style="margin:5px 0;"><strong>Adresse:</strong> Kirchenplatz 9, 18119 Rostock-Warnemünde</p>
                </div>
                
                <table style="width:100%;border-collapse:collapse;">
                    <thead>
                        <tr style="border-bottom:2px solid #22c55e;">
                            <th style="padding:10px;text-align:left;">Artikel</th>
                            <th style="padding:10px;text-align:left;">Variante</th>
                            <th style="padding:10px;text-align:right;">Preis</th>
                        </tr>
                    </thead>
                    <tbody>{items_html}</tbody>
                </table>
                
                <div style="margin-top:20px;text-align:right;">
                    <p style="font-size:24px;font-weight:bold;color:#22c55e;">Gesamt: €{order['total']:.2f}</p>
                </div>
                
                <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">
                <p style="color:#666;font-size:14px;">
                    Fragen? Ruf uns an: +49 30 12345678<br>
                    Bis gleich! 🍔
                </p>
            </div>
            <div style="background:#f1f5f9;padding:15px;text-align:center;color:#666;font-size:12px;">
                © {datetime.now().year} ORIA FRESH | <a href="https://oriafresh.de" style="color:#22c55e;">oriafresh.de</a>
            </div>
        </body>
        </html>
        """

async def send_order_confirmation(order: dict):
    """Send order confirmation email to customer and notification to restaurant."""
    email_sent = False
    
    # Try to send via Resend if configured
    if RESEND_AVAILABLE and RESEND_API_KEY:
        try:
            # Send to customer
            customer_html = generate_order_email_html(order, for_restaurant=False)
            customer_params = {
                "from": SENDER_EMAIL,
                "to": [order['customer_email']],
                "subject": f"Deine Bestellung bei ORIA FRESH #{order['id'][:8].upper()}",
                "html": customer_html
            }
            customer_result = await asyncio.to_thread(resend.Emails.send, customer_params)
            logger.info(f"📧 Customer email sent: {customer_result.get('id')}")
            
            # Send to restaurant
            restaurant_html = generate_order_email_html(order, for_restaurant=True)
            restaurant_params = {
                "from": SENDER_EMAIL,
                "to": [RESTAURANT_EMAIL],
                "subject": f"🍔 Neue Bestellung #{order['id'][:8].upper()} - {order['customer_name']}",
                "html": restaurant_html
            }
            restaurant_result = await asyncio.to_thread(resend.Emails.send, restaurant_params)
            logger.info(f"📧 Restaurant email sent: {restaurant_result.get('id')}")
            
            email_sent = True
            
            # Log successful email
            await db.email_logs.insert_one({
                "id": str(uuid.uuid4()),
                "to": order['customer_email'],
                "order_id": order['id'],
                "type": "order_confirmation",
                "sent_at": datetime.now(timezone.utc).isoformat(),
                "status": "sent",
                "customer_email_id": customer_result.get('id'),
                "restaurant_email_id": restaurant_result.get('id')
            })
        except Exception as e:
            logger.error(f"❌ Resend error: {str(e)}")
    
    # Fallback to mock if Resend not available or failed
    if not email_sent:
        logger.info(f"📧 EMAIL SERVICE (MOCK) - Order Confirmation")
        logger.info(f"To: {order['customer_email']}")
        logger.info(f"Subject: Deine Bestellung bei ORIA FRESH #{order['id'][:8]}")
        logger.info(f"Body: Hallo {order['customer_name']}, deine Bestellung ist eingegangen!")
        logger.info(f"Abholzeit: {order['pickup_time']}")
        logger.info(f"Gesamtbetrag: €{order['total']:.2f}")
        
        await db.email_logs.insert_one({
            "id": str(uuid.uuid4()),
            "to": order['customer_email'],
            "order_id": order['id'],
            "type": "order_confirmation",
            "sent_at": datetime.now(timezone.utc).isoformat(),
            "status": "mocked"
        })

# ============== PAYPAL HELPERS ==============

async def get_paypal_access_token():
    if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="PayPal not configured")
    
    auth = base64.b64encode(f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}".encode()).decode()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PAYPAL_BASE_URL}/v1/oauth2/token",
            headers={
                "Authorization": f"Basic {auth}",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data="grant_type=client_credentials"
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="PayPal auth failed")
        return response.json()["access_token"]

async def create_paypal_order(amount: float, order_id: str):
    access_token = await get_paypal_access_token()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PAYPAL_BASE_URL}/v2/checkout/orders",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            },
            json={
                "intent": "CAPTURE",
                "purchase_units": [{
                    "reference_id": order_id,
                    "amount": {
                        "currency_code": "EUR",
                        "value": f"{amount:.2f}"
                    }
                }]
            }
        )
        if response.status_code not in [200, 201]:
            raise HTTPException(status_code=500, detail="PayPal order creation failed")
        return response.json()

async def capture_paypal_order(paypal_order_id: str):
    access_token = await get_paypal_access_token()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PAYPAL_BASE_URL}/v2/checkout/orders/{paypal_order_id}/capture",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
        )
        return response.json()

# ============== PUBLIC ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "ORIA FRESH API", "version": "1.0.0"}

@api_router.get("/products", response_model=List[dict])
async def get_products(category: Optional[str] = None, bestseller: Optional[bool] = None):
    query = {"is_active": True}
    if category:
        query["category"] = category
    if bestseller:
        query["is_bestseller"] = True
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id, "is_active": True}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.get("/categories", response_model=List[dict])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).sort("order", 1).to_list(20)
    return categories

@api_router.get("/bestsellers", response_model=List[dict])
async def get_bestsellers():
    products = await db.products.find({"is_bestseller": True, "is_active": True}, {"_id": 0}).to_list(10)
    return products

@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({}, {"_id": 0})
    if not settings:
        return Settings().model_dump()
    # Ensure qr_bonus is always present
    if 'qr_bonus' not in settings:
        settings['qr_bonus'] = QRBonus().model_dump()
    return settings

# ============== ORDER ROUTES ==============

@api_router.post("/orders")
async def create_order(order_data: OrderCreate):
    # Check for QR bonus application
    qr_bonus_data = None
    if order_data.source == 'qr':
        # Get current settings to check if QR bonus is enabled
        settings = await db.settings.find_one({}, {"_id": 0})
        qr_bonus_settings = settings.get('qr_bonus', {}) if settings else {}
        
        if qr_bonus_settings.get('enabled', False):
            qr_bonus_data = {
                'name': qr_bonus_settings.get('bonus_name', 'Gratis Extra Sauce'),
                'value': qr_bonus_settings.get('bonus_value', 0.80),
                'type': qr_bonus_settings.get('bonus_type', 'extra_sauce')
            }
            logger.info(f"🎁 QR Bonus applied: {qr_bonus_data['name']}")
    
    order = Order(
        items=order_data.items,
        customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone,
        customer_email=order_data.customer_email,
        pickup_time=order_data.pickup_time,
        notes=order_data.notes or "",
        payment_method=order_data.payment_method,
        subtotal=order_data.subtotal,
        total=order_data.total,
        source=order_data.source or "web",
        qr_bonus_applied=qr_bonus_data
    )
    
    order_dict = order.model_dump()
    order_dict['created_at'] = order_dict['created_at'].isoformat()
    
    if order_data.payment_method == "paypal":
        # Create PayPal order
        try:
            paypal_order = await create_paypal_order(order_data.total, order.id)
            order_dict['paypal_order_id'] = paypal_order['id']
            order_dict['status'] = 'pending'
        except Exception as e:
            logger.error(f"PayPal error: {e}")
            raise HTTPException(status_code=500, detail="PayPal order creation failed")
    else:
        order_dict['status'] = 'pending'
    
    await db.orders.insert_one(order_dict)
    
    # Send confirmation email for pickup orders immediately
    if order_data.payment_method == "pickup":
        await send_order_confirmation(order_dict)
    
    return {"order_id": order.id, "paypal_order_id": order_dict.get('paypal_order_id')}

@api_router.post("/orders/{order_id}/capture")
async def capture_order_payment(order_id: str, paypal_order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Capture PayPal payment
    try:
        capture_result = await capture_paypal_order(paypal_order_id)
        if capture_result.get('status') == 'COMPLETED':
            await db.orders.update_one(
                {"id": order_id},
                {"$set": {"status": "paid"}}
            )
            order['status'] = 'paid'
            await send_order_confirmation(order)
            return {"status": "success", "order_status": "paid"}
        else:
            return {"status": "failed", "details": capture_result}
    except Exception as e:
        logger.error(f"PayPal capture error: {e}")
        raise HTTPException(status_code=500, detail="Payment capture failed")

@api_router.get("/orders/{order_id}/status")
async def get_order_status(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0, "id": 1, "status": 1})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# ============== ADMIN AUTH ROUTES ==============

@api_router.post("/admin/login", response_model=Token)
async def admin_login(login_data: AdminLogin, request: Request):
    # Rate limiting check
    if not check_rate_limit(login_data.email):
        remaining_time = LOCKOUT_DURATION - (time.time() - LOGIN_ATTEMPTS[login_data.email][0])
        raise HTTPException(
            status_code=429, 
            detail=f"Zu viele Anmeldeversuche. Bitte warte {int(remaining_time/60)} Minuten."
        )
    
    admin = await db.admins.find_one({"email": login_data.email}, {"_id": 0})
    if not admin or not verify_password(login_data.password, admin['password']):
        record_failed_attempt(login_data.email)
        attempts_left = MAX_LOGIN_ATTEMPTS - len(LOGIN_ATTEMPTS[login_data.email])
        raise HTTPException(
            status_code=401, 
            detail=f"Ungültige Anmeldedaten. Noch {attempts_left} Versuche übrig."
        )
    
    # Clear attempts on successful login
    clear_attempts(login_data.email)
    
    # Log successful login
    await db.login_logs.insert_one({
        "id": str(uuid.uuid4()),
        "email": login_data.email,
        "ip": request.client.host if request.client else "unknown",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "success": True
    })
    
    access_token = create_access_token(data={"sub": admin['email']})
    refresh_token = create_refresh_token(data={"sub": admin['email']})
    
    return Token(access_token=access_token, refresh_token=refresh_token)

@api_router.post("/admin/refresh", response_model=Token)
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        access_token = create_access_token(data={"sub": email})
        new_refresh_token = create_refresh_token(data={"sub": email})
        return Token(access_token=access_token, refresh_token=new_refresh_token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@api_router.get("/admin/me")
async def get_admin_me(admin: dict = Depends(get_current_admin)):
    return {"email": admin['email'], "name": admin['name']}

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@api_router.post("/admin/change-password")
async def change_admin_password(data: PasswordChange, admin: dict = Depends(get_current_admin)):
    # Verify current password
    stored_admin = await db.admins.find_one({"email": admin['email']}, {"_id": 0})
    if not verify_password(data.current_password, stored_admin['password']):
        raise HTTPException(status_code=401, detail="Aktuelles Passwort ist falsch")
    
    # Validate new password strength
    if len(data.new_password) < 12:
        raise HTTPException(status_code=400, detail="Passwort muss mindestens 12 Zeichen haben")
    if not any(c.isupper() for c in data.new_password):
        raise HTTPException(status_code=400, detail="Passwort muss mindestens einen Großbuchstaben enthalten")
    if not any(c.isdigit() for c in data.new_password):
        raise HTTPException(status_code=400, detail="Passwort muss mindestens eine Zahl enthalten")
    
    # Update password
    new_hash = get_password_hash(data.new_password)
    await db.admins.update_one(
        {"email": admin['email']},
        {"$set": {"password": new_hash}}
    )
    
    return {"status": "success", "message": "Passwort erfolgreich geändert"}

# ============== ADMIN PRODUCT ROUTES ==============

@api_router.get("/admin/products", response_model=List[dict])
async def admin_get_products(admin: dict = Depends(get_current_admin)):
    products = await db.products.find({}, {"_id": 0}).to_list(200)
    return products

@api_router.post("/admin/products")
async def admin_create_product(product_data: ProductCreate, admin: dict = Depends(get_current_admin)):
    product = Product(**product_data.model_dump())
    product_dict = product.model_dump()
    product_dict['created_at'] = product_dict['created_at'].isoformat()
    await db.products.insert_one(product_dict)
    return {"id": product.id}

@api_router.put("/admin/products/{product_id}")
async def admin_update_product(product_id: str, product_data: ProductCreate, admin: dict = Depends(get_current_admin)):
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": product_data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "updated"}

@api_router.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": {"is_active": False}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "deactivated"}

# ============== ADMIN CATEGORY ROUTES ==============

@api_router.post("/admin/categories")
async def admin_create_category(category_data: CategoryCreate, admin: dict = Depends(get_current_admin)):
    category = Category(**category_data.model_dump())
    await db.categories.insert_one(category.model_dump())
    return {"id": category.id}

@api_router.put("/admin/categories/{category_id}")
async def admin_update_category(category_id: str, category_data: CategoryCreate, admin: dict = Depends(get_current_admin)):
    result = await db.categories.update_one(
        {"id": category_id},
        {"$set": category_data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"status": "updated"}

# ============== ADMIN ORDER ROUTES ==============

@api_router.get("/admin/orders", response_model=List[dict])
async def admin_get_orders(admin: dict = Depends(get_current_admin), status: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(200)
    return orders

@api_router.put("/admin/orders/{order_id}/status")
async def admin_update_order_status(order_id: str, new_status: str, admin: dict = Depends(get_current_admin)):
    valid_statuses = ["pending", "paid", "in_preparation", "ready", "picked_up", "cancelled"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": new_status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"status": "updated"}

@api_router.get("/admin/dashboard")
async def admin_dashboard(admin: dict = Depends(get_current_admin)):
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_str = today.isoformat()
    
    # Get today's orders
    orders_today = await db.orders.find(
        {"created_at": {"$gte": today_str}},
        {"_id": 0}
    ).to_list(1000)
    
    total_orders = len(orders_today)
    total_revenue = sum(o.get('total', 0) for o in orders_today if o.get('status') not in ['cancelled', 'pending'])
    
    # Get orders by status
    status_counts = {}
    for order in orders_today:
        status = order.get('status', 'unknown')
        status_counts[status] = status_counts.get(status, 0) + 1
    
    # QR Tracking
    qr_orders = [o for o in orders_today if o.get('source') == 'qr']
    qr_count = len(qr_orders)
    qr_revenue = sum(o.get('total', 0) for o in qr_orders if o.get('status') not in ['cancelled', 'pending'])
    qr_percentage = round((qr_count / total_orders * 100), 1) if total_orders > 0 else 0
    
    # QR Bonus Tracking
    qr_bonus_orders = [o for o in qr_orders if o.get('qr_bonus_applied')]
    qr_bonus_count = len(qr_bonus_orders)
    
    return {
        "orders_today": total_orders,
        "revenue_today": total_revenue,
        "status_breakdown": status_counts,
        "qr_orders_today": qr_count,
        "qr_revenue_today": qr_revenue,
        "qr_percentage": qr_percentage,
        "qr_bonus_orders_today": qr_bonus_count
    }

# ============== ADMIN SETTINGS ROUTES ==============

@api_router.put("/admin/settings")
async def admin_update_settings(settings: Settings, admin: dict = Depends(get_current_admin)):
    settings_dict = settings.model_dump()
    await db.settings.update_one({}, {"$set": settings_dict}, upsert=True)
    return {"status": "updated"}

# ============== SEED DATA ==============

@api_router.post("/seed")
async def seed_database():
    # Check if already seeded
    existing = await db.products.count_documents({})
    if existing > 0:
        return {"message": "Database already seeded"}
    
    # Create admin user
    admin_password = get_password_hash("admin123")
    await db.admins.insert_one({
        "id": str(uuid.uuid4()),
        "email": "admin@oriafresh.de",
        "password": admin_password,
        "name": "ORIA Admin"
    })
    
    # Create categories
    categories = [
        {"id": str(uuid.uuid4()), "name": "Smash Burger", "slug": "smash-burger", "icon": "🍔", "order": 1},
        {"id": str(uuid.uuid4()), "name": "Chicken & Veggie", "slug": "chicken-veggie", "icon": "🍗", "order": 2},
        {"id": str(uuid.uuid4()), "name": "Bowls & Salads", "slug": "bowls-salads", "icon": "🥗", "order": 3},
        {"id": str(uuid.uuid4()), "name": "Sides", "slug": "sides", "icon": "🍟", "order": 4},
        {"id": str(uuid.uuid4()), "name": "Kids", "slug": "kids", "icon": "👶", "order": 5},
        {"id": str(uuid.uuid4()), "name": "Drinks", "slug": "drinks", "icon": "🥤", "order": 6},
        {"id": str(uuid.uuid4()), "name": "Specials", "slug": "specials", "icon": "⭐", "order": 7},
    ]
    await db.categories.insert_many(categories)
    
    # Common extras
    extras = [
        {"id": str(uuid.uuid4()), "name": "Extra Käse", "price": 1.50},
        {"id": str(uuid.uuid4()), "name": "Extra Sauce", "price": 0.80},
        {"id": str(uuid.uuid4()), "name": "Jalapeños", "price": 1.00},
        {"id": str(uuid.uuid4()), "name": "Bacon", "price": 2.00},
    ]
    
    # Products
    products = [
        # Smash Burgers
        {
            "id": str(uuid.uuid4()),
            "name": "Smash Classic",
            "description": "Der Klassiker: Doppelt gesmashtes Beef, American Cheese, Pickles, Zwiebeln, Smash Sauce",
            "category": "Smash Burger",
            "image": "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
            "allergens": "Gluten, Milch, Senf",
            "variants": [{"name": "Single", "price": 8.90}, {"name": "Menü", "price": 12.90, "includes": "inkl. Pommes + Drink"}],
            "extras": extras[:3],
            "is_halal": True,
            "is_bestseller": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Truffle Smash",
            "description": "Premium Smash mit Trüffel-Mayo, karamellisierten Zwiebeln, Rucola und Parmesan",
            "category": "Smash Burger",
            "image": "https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg",
            "allergens": "Gluten, Milch, Ei",
            "variants": [{"name": "Single", "price": 11.90}, {"name": "Menü", "price": 15.90, "includes": "inkl. Pommes + Drink"}],
            "extras": extras,
            "is_halal": True,
            "is_bestseller": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Chili Crunch Smash",
            "description": "Für Heat-Lover: Jalapeño-Cheese, Chipotle-Sauce, Crispy Onions, frische Chilischoten",
            "category": "Smash Burger",
            "image": "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
            "allergens": "Gluten, Milch, Senf",
            "variants": [{"name": "Single", "price": 10.50}, {"name": "Menü", "price": 14.50, "includes": "inkl. Pommes + Drink"}],
            "extras": extras,
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "BBQ Bacon Smash",
            "description": "Smoky BBQ-Sauce, knuspriger Beef-Bacon, Cheddar, Coleslaw",
            "category": "Smash Burger",
            "image": "https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg",
            "allergens": "Gluten, Milch, Senf, Sellerie",
            "variants": [{"name": "Single", "price": 11.50}, {"name": "Menü", "price": 15.50, "includes": "inkl. Pommes + Drink"}],
            "extras": extras,
            "is_halal": False,
            "is_bestseller": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # Chicken & Veggie
        {
            "id": str(uuid.uuid4()),
            "name": "Crispy Chicken Deluxe",
            "description": "Knuspriges Hähnchenfilet, Sriracha-Mayo, Slaw, eingelegte Gurken",
            "category": "Chicken & Veggie",
            "image": "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg",
            "allergens": "Gluten, Ei, Senf",
            "variants": [{"name": "Single", "price": 9.90}, {"name": "Menü", "price": 13.90, "includes": "inkl. Pommes + Drink"}],
            "extras": extras[:3],
            "is_halal": True,
            "is_bestseller": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Green Power Veggie",
            "description": "Hausgemachter Veggie-Patty, Avocado, Sprossen, Hummus, Tomaten",
            "category": "Chicken & Veggie",
            "image": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
            "allergens": "Gluten, Sesam",
            "variants": [{"name": "Single", "price": 9.50}, {"name": "Menü", "price": 13.50, "includes": "inkl. Pommes + Drink"}],
            "extras": extras[:2],
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # Bowls & Salads
        {
            "id": str(uuid.uuid4()),
            "name": "Green Bowl",
            "description": "Quinoa, Edamame, Avocado, Gurke, Karotten, Sesam-Ingwer-Dressing",
            "category": "Bowls & Salads",
            "image": "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg",
            "allergens": "Soja, Sesam, Gluten",
            "variants": [{"name": "Regular", "price": 11.90}, {"name": "Large", "price": 14.90}],
            "extras": [{"id": str(uuid.uuid4()), "name": "Extra Protein", "price": 3.00}],
            "is_halal": True,
            "is_bestseller": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Protein Power Bowl",
            "description": "Reis, gegrilltes Hähnchen, schwarze Bohnen, Mais, Pico de Gallo, Chipotle-Dressing",
            "category": "Bowls & Salads",
            "image": "https://images.pexels.com/photos/1546039/pexels-photo-1546039.jpeg",
            "allergens": "Gluten",
            "variants": [{"name": "Regular", "price": 12.90}, {"name": "Large", "price": 15.90}],
            "extras": [{"id": str(uuid.uuid4()), "name": "Extra Hähnchen", "price": 3.50}],
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Caesar Salad Classic",
            "description": "Romana, Parmesan, Croutons, Caesar-Dressing, optional mit Hähnchen",
            "category": "Bowls & Salads",
            "image": "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg",
            "allergens": "Gluten, Milch, Ei, Fisch",
            "variants": [{"name": "Regular", "price": 9.90}, {"name": "mit Hähnchen", "price": 12.90}],
            "extras": [],
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # Sides
        {
            "id": str(uuid.uuid4()),
            "name": "Crispy Fries",
            "description": "Knusprige Pommes mit Meersalz",
            "category": "Sides",
            "image": "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg",
            "allergens": "",
            "variants": [{"name": "Regular", "price": 3.90}, {"name": "Large", "price": 5.50}],
            "extras": [{"id": str(uuid.uuid4()), "name": "Cheese Topping", "price": 1.50}],
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Sweet Potato Fries",
            "description": "Süßkartoffel-Pommes mit Aioli",
            "category": "Sides",
            "image": "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg",
            "allergens": "Ei",
            "variants": [{"name": "Regular", "price": 4.90}, {"name": "Large", "price": 6.50}],
            "extras": [],
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Onion Rings",
            "description": "Knusprig panierte Zwiebelringe mit Dip",
            "category": "Sides",
            "image": "https://images.pexels.com/photos/1893555/pexels-photo-1893555.jpeg",
            "allergens": "Gluten, Ei",
            "variants": [{"name": "6 Stück", "price": 4.50}, {"name": "12 Stück", "price": 7.90}],
            "extras": [],
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # Kids
        {
            "id": str(uuid.uuid4()),
            "name": "Mini Smash",
            "description": "Kleiner Smash Burger mit Käse, perfekt für kleine Hände",
            "category": "Kids",
            "image": "https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg",
            "allergens": "Gluten, Milch",
            "variants": [{"name": "Single", "price": 5.90}, {"name": "Menü", "price": 8.90, "includes": "inkl. Pommes + Capri-Sun"}],
            "extras": [],
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Chicken Nuggets",
            "description": "6 knusprige Hähnchen-Nuggets mit Dip nach Wahl",
            "category": "Kids",
            "image": "https://images.pexels.com/photos/6941010/pexels-photo-6941010.jpeg",
            "allergens": "Gluten, Ei",
            "variants": [{"name": "6er Box", "price": 5.50}, {"name": "Menü", "price": 8.50, "includes": "inkl. Pommes + Capri-Sun"}],
            "extras": [],
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # Drinks
        {
            "id": str(uuid.uuid4()),
            "name": "Hausgemachte Limo",
            "description": "Erfrischende Limonade: Classic, Ingwer-Minze oder Beeren",
            "category": "Drinks",
            "image": "https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg",
            "allergens": "",
            "variants": [{"name": "0.3L", "price": 3.50}, {"name": "0.5L", "price": 4.90}],
            "extras": [],
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Softdrinks",
            "description": "Coca Cola, Fanta, Sprite, Mezzo Mix (0.33L)",
            "category": "Drinks",
            "image": "https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg",
            "allergens": "",
            "variants": [{"name": "0.33L", "price": 2.90}],
            "extras": [],
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # Specials
        {
            "id": str(uuid.uuid4()),
            "name": "Double Trouble",
            "description": "SPECIAL: 2x Smash Classic + große Pommes zum teilen",
            "category": "Specials",
            "image": "https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg",
            "allergens": "Gluten, Milch, Senf",
            "variants": [{"name": "Für 2", "price": 22.90}],
            "extras": extras,
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Family Box",
            "description": "4 Mini Smash + 2 Crispy Chicken + große Pommes + 4 Drinks",
            "category": "Specials",
            "image": "https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg",
            "allergens": "Gluten, Milch, Ei",
            "variants": [{"name": "Für 4", "price": 44.90}],
            "extras": [],
            "is_halal": True,
            "is_bestseller": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    
    await db.products.insert_many(products)
    
    # Create default settings
    settings = {
        "opening_hours": [
            {"day": "Montag", "open": "11:00", "close": "22:00", "is_closed": False},
            {"day": "Dienstag", "open": "11:00", "close": "22:00", "is_closed": False},
            {"day": "Mittwoch", "open": "11:00", "close": "22:00", "is_closed": False},
            {"day": "Donnerstag", "open": "11:00", "close": "22:00", "is_closed": False},
            {"day": "Freitag", "open": "11:00", "close": "23:00", "is_closed": False},
            {"day": "Samstag", "open": "12:00", "close": "23:00", "is_closed": False},
            {"day": "Sonntag", "open": "12:00", "close": "21:00", "is_closed": False},
        ],
        "pickup_slots": ["sofort", "15 min", "30 min", "45 min", "60 min"],
        "restaurant_name": "ORIA FRESH",
        "address": "Musterstraße 123, 12345 Berlin",
        "phone": "+49 30 12345678",
        "email": "info@oriafresh.de"
    }
    await db.settings.insert_one(settings)
    
    return {"message": "Database seeded successfully", "products": len(products), "categories": len(categories)}

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
