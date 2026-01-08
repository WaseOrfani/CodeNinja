from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import hashlib
import jwt
import pytz
from passlib.hash import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'oria_fresh_db')]

# JWT & Security
SECRET_KEY = os.environ.get('SECRET_KEY', 'oria-fresh-secret-key-2024')
SERVER_SALT = os.environ.get('SERVER_SALT', 'oria-fresh-server-salt-secure')
JWT_ALGORITHM = "HS256"
BERLIN_TZ = pytz.timezone('Europe/Berlin')

# Create the main app
app = FastAPI(title="Oria Fresh Gutscheine API")

# Create routers
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== PYDANTIC MODELS ====================

class CategoryBase(BaseModel):
    name: str
    order: int = 0
    is_active: bool = True

class Category(CategoryBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class StoreBase(BaseModel):
    name: str
    address: str
    city: str
    is_active: bool = True

class Store(StoreBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CouponBase(BaseModel):
    code: str
    title: str
    subtitle: str
    description: str = ""
    price: float
    original_price: Optional[float] = None
    image_url: str
    category_id: str
    valid_store_ids: List[str] = []  # Empty = all stores
    badges: List[str] = []  # APP ONLY, ABHOLUNG, LIMITED
    valid_from: datetime
    valid_until: datetime
    is_active: bool = True
    conditions: str = ""

class Coupon(CouponBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CouponResponse(Coupon):
    category_name: Optional[str] = None

class StaffBase(BaseModel):
    username: str
    store_id: str
    is_active: bool = True

class StaffCreate(StaffBase):
    password: str

class Staff(StaffBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AdminBase(BaseModel):
    username: str
    is_active: bool = True

class AdminCreate(AdminBase):
    password: str

class Admin(AdminBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Redemption(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    coupon_id: str
    device_hash: str
    store_id: str
    staff_id: str
    redeemed_at: datetime = Field(default_factory=datetime.utcnow)
    redeem_date: str  # YYYY-MM-DD in Berlin timezone

class QRTokenRequest(BaseModel):
    device_id: str

class QRTokenResponse(BaseModel):
    token: str
    expires_in: int = 60

class ValidateRequest(BaseModel):
    token: str
    store_id: str

class ValidateResponse(BaseModel):
    valid: bool
    coupon_id: Optional[str] = None
    coupon_title: Optional[str] = None
    coupon_price: Optional[float] = None
    error_code: Optional[str] = None
    message: str

class RedeemConfirmRequest(BaseModel):
    token: str
    store_id: str

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user_type: str
    user_id: str
    store_id: Optional[str] = None

# ==================== UTILITY FUNCTIONS ====================

def hash_device_id(device_id: str) -> str:
    """Create device hash using server salt"""
    return hashlib.sha256(f"{device_id}{SERVER_SALT}".encode()).hexdigest()

def get_berlin_date() -> str:
    """Get current date in Berlin timezone as YYYY-MM-DD"""
    return datetime.now(BERLIN_TZ).strftime('%Y-%m-%d')

def create_qr_token(coupon_id: str, device_hash: str) -> str:
    """Create a JWT token for QR code with 60 second expiry"""
    payload = {
        "coupon_id": coupon_id,
        "device_hash": device_hash,
        "jti": str(uuid.uuid4()),
        "exp": datetime.utcnow() + timedelta(seconds=60),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)

def verify_qr_token(token: str) -> dict:
    """Verify and decode QR token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return {"valid": True, "payload": payload}
    except jwt.ExpiredSignatureError:
        return {"valid": False, "error": "TOKEN_EXPIRED"}
    except jwt.InvalidTokenError:
        return {"valid": False, "error": "INVALID_TOKEN"}

def create_auth_token(user_id: str, user_type: str, store_id: str = None) -> str:
    """Create authentication token for staff/admin"""
    payload = {
        "user_id": user_id,
        "user_type": user_type,
        "store_id": store_id,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)

async def verify_auth_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify authentication token"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def verify_staff_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify staff authentication token"""
    payload = await verify_auth_token(credentials)
    if payload.get("user_type") != "staff":
        raise HTTPException(status_code=403, detail="Staff access required")
    return payload

async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify admin authentication token"""
    payload = await verify_auth_token(credentials)
    if payload.get("user_type") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload

# ==================== PUBLIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Oria Fresh Gutscheine API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all active categories"""
    categories = await db.categories.find({"is_active": True}).sort("order", 1).to_list(100)
    return [Category(**cat) for cat in categories]

@api_router.get("/coupons", response_model=List[CouponResponse])
async def get_coupons(category_id: Optional[str] = None):
    """Get all active coupons, optionally filtered by category"""
    now = datetime.utcnow()
    query = {
        "is_active": True,
        "valid_from": {"$lte": now},
        "valid_until": {"$gte": now}
    }
    if category_id:
        query["category_id"] = category_id
    
    coupons = await db.coupons.find(query).to_list(100)
    
    # Get category names
    category_ids = list(set(c.get("category_id") for c in coupons))
    categories = await db.categories.find({"id": {"$in": category_ids}}).to_list(100)
    category_map = {cat["id"]: cat["name"] for cat in categories}
    
    result = []
    for coupon in coupons:
        coupon_resp = CouponResponse(**coupon)
        coupon_resp.category_name = category_map.get(coupon.get("category_id"))
        result.append(coupon_resp)
    
    return result

@api_router.get("/coupons/{coupon_id}", response_model=CouponResponse)
async def get_coupon(coupon_id: str):
    """Get single coupon by ID"""
    coupon = await db.coupons.find_one({"id": coupon_id})
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    
    category = await db.categories.find_one({"id": coupon.get("category_id")})
    coupon_resp = CouponResponse(**coupon)
    coupon_resp.category_name = category["name"] if category else None
    return coupon_resp

@api_router.get("/stores", response_model=List[Store])
async def get_stores():
    """Get all active stores"""
    stores = await db.stores.find({"is_active": True}).to_list(10)
    return [Store(**store) for store in stores]

@api_router.post("/coupons/{coupon_id}/token", response_model=QRTokenResponse)
async def create_coupon_token(coupon_id: str, request: QRTokenRequest):
    """Create a QR token for a coupon (60 second validity)"""
    # Verify coupon exists and is active
    coupon = await db.coupons.find_one({"id": coupon_id, "is_active": True})
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found or inactive")
    
    # Check validity period
    now = datetime.utcnow()
    if coupon["valid_from"] > now or coupon["valid_until"] < now:
        raise HTTPException(status_code=400, detail="Coupon not in validity period")
    
    # Create device hash
    device_hash = hash_device_id(request.device_id)
    
    # Check if already redeemed today
    today = get_berlin_date()
    existing = await db.redemptions.find_one({
        "coupon_id": coupon_id,
        "device_hash": device_hash,
        "redeem_date": today
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="ALREADY_REDEEMED_TODAY")
    
    # Create token
    token = create_qr_token(coupon_id, device_hash)
    return QRTokenResponse(token=token, expires_in=60)

# ==================== STAFF ROUTES ====================

@api_router.post("/auth/staff/login", response_model=LoginResponse)
async def staff_login(request: LoginRequest):
    """Staff login"""
    staff = await db.staff.find_one({"username": request.username, "is_active": True})
    if not staff:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.verify(request.password, staff["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_auth_token(staff["id"], "staff", staff["store_id"])
    return LoginResponse(
        token=token,
        user_type="staff",
        user_id=staff["id"],
        store_id=staff["store_id"]
    )

@api_router.post("/redeem/validate", response_model=ValidateResponse)
async def validate_redemption(request: ValidateRequest, auth=Depends(verify_staff_token)):
    """Validate a QR token for redemption"""
    # Verify token
    result = verify_qr_token(request.token)
    if not result["valid"]:
        return ValidateResponse(
            valid=False,
            error_code=result["error"],
            message="QR-Code ist abgelaufen" if result["error"] == "TOKEN_EXPIRED" else "Ungültiger QR-Code"
        )
    
    payload = result["payload"]
    coupon_id = payload["coupon_id"]
    device_hash = payload["device_hash"]
    
    # Get coupon
    coupon = await db.coupons.find_one({"id": coupon_id})
    if not coupon:
        return ValidateResponse(valid=False, error_code="COUPON_NOT_FOUND", message="Gutschein nicht gefunden")
    
    if not coupon["is_active"]:
        return ValidateResponse(valid=False, error_code="INACTIVE", message="Gutschein ist nicht mehr aktiv")
    
    # Check validity period
    now = datetime.utcnow()
    if coupon["valid_from"] > now or coupon["valid_until"] < now:
        return ValidateResponse(valid=False, error_code="OUT_OF_DATE", message="Gutschein ist nicht gültig")
    
    # Check store
    if coupon["valid_store_ids"] and request.store_id not in coupon["valid_store_ids"]:
        return ValidateResponse(valid=False, error_code="WRONG_STORE", message="Gutschein nicht in dieser Filiale gültig")
    
    # Check if already redeemed today
    today = get_berlin_date()
    existing = await db.redemptions.find_one({
        "coupon_id": coupon_id,
        "device_hash": device_hash,
        "redeem_date": today
    })
    
    if existing:
        return ValidateResponse(valid=False, error_code="ALREADY_REDEEMED_TODAY", message="Gutschein heute bereits eingelöst")
    
    return ValidateResponse(
        valid=True,
        coupon_id=coupon_id,
        coupon_title=coupon["title"],
        coupon_price=coupon["price"],
        message="Gutschein gültig"
    )

@api_router.post("/redeem/confirm", response_model=ValidateResponse)
async def confirm_redemption(request: RedeemConfirmRequest, auth=Depends(verify_staff_token)):
    """Confirm and record a redemption"""
    # Validate first
    result = verify_qr_token(request.token)
    if not result["valid"]:
        return ValidateResponse(
            valid=False,
            error_code=result["error"],
            message="QR-Code ist abgelaufen" if result["error"] == "TOKEN_EXPIRED" else "Ungültiger QR-Code"
        )
    
    payload = result["payload"]
    coupon_id = payload["coupon_id"]
    device_hash = payload["device_hash"]
    today = get_berlin_date()
    
    # Check if already redeemed today (double check)
    existing = await db.redemptions.find_one({
        "coupon_id": coupon_id,
        "device_hash": device_hash,
        "redeem_date": today
    })
    
    if existing:
        return ValidateResponse(valid=False, error_code="ALREADY_REDEEMED_TODAY", message="Gutschein heute bereits eingelöst")
    
    # Get coupon for response
    coupon = await db.coupons.find_one({"id": coupon_id})
    
    # Record redemption
    redemption = Redemption(
        coupon_id=coupon_id,
        device_hash=device_hash,
        store_id=request.store_id,
        staff_id=auth["user_id"],
        redeem_date=today
    )
    
    await db.redemptions.insert_one(redemption.dict())
    
    return ValidateResponse(
        valid=True,
        coupon_id=coupon_id,
        coupon_title=coupon["title"] if coupon else None,
        coupon_price=coupon["price"] if coupon else None,
        message="Gutschein erfolgreich eingelöst"
    )

# ==================== ADMIN ROUTES ====================

@api_router.post("/auth/admin/login", response_model=LoginResponse)
async def admin_login(request: LoginRequest):
    """Admin login"""
    admin = await db.admins.find_one({"username": request.username, "is_active": True})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.verify(request.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_auth_token(admin["id"], "admin")
    return LoginResponse(token=token, user_type="admin", user_id=admin["id"])

# Admin Categories
@api_router.get("/admin/categories", response_model=List[Category])
async def admin_get_categories(auth=Depends(verify_admin_token)):
    categories = await db.categories.find().sort("order", 1).to_list(100)
    return [Category(**cat) for cat in categories]

@api_router.post("/admin/categories", response_model=Category)
async def admin_create_category(category: CategoryBase, auth=Depends(verify_admin_token)):
    cat_obj = Category(**category.dict())
    await db.categories.insert_one(cat_obj.dict())
    return cat_obj

@api_router.put("/admin/categories/{category_id}", response_model=Category)
async def admin_update_category(category_id: str, category: CategoryBase, auth=Depends(verify_admin_token)):
    result = await db.categories.update_one({"id": category_id}, {"$set": category.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    updated = await db.categories.find_one({"id": category_id})
    return Category(**updated)

@api_router.delete("/admin/categories/{category_id}")
async def admin_delete_category(category_id: str, auth=Depends(verify_admin_token)):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}

# Admin Coupons
@api_router.get("/admin/coupons", response_model=List[Coupon])
async def admin_get_coupons(auth=Depends(verify_admin_token)):
    coupons = await db.coupons.find().to_list(200)
    return [Coupon(**c) for c in coupons]

@api_router.post("/admin/coupons", response_model=Coupon)
async def admin_create_coupon(coupon: CouponBase, auth=Depends(verify_admin_token)):
    coupon_obj = Coupon(**coupon.dict())
    await db.coupons.insert_one(coupon_obj.dict())
    return coupon_obj

@api_router.put("/admin/coupons/{coupon_id}", response_model=Coupon)
async def admin_update_coupon(coupon_id: str, coupon: CouponBase, auth=Depends(verify_admin_token)):
    result = await db.coupons.update_one({"id": coupon_id}, {"$set": coupon.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    updated = await db.coupons.find_one({"id": coupon_id})
    return Coupon(**updated)

@api_router.delete("/admin/coupons/{coupon_id}")
async def admin_delete_coupon(coupon_id: str, auth=Depends(verify_admin_token)):
    result = await db.coupons.delete_one({"id": coupon_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return {"message": "Coupon deleted"}

# Admin Stores
@api_router.get("/admin/stores", response_model=List[Store])
async def admin_get_stores(auth=Depends(verify_admin_token)):
    stores = await db.stores.find().to_list(10)
    return [Store(**s) for s in stores]

@api_router.post("/admin/stores", response_model=Store)
async def admin_create_store(store: StoreBase, auth=Depends(verify_admin_token)):
    # Check max 2 active stores
    active_count = await db.stores.count_documents({"is_active": True})
    if store.is_active and active_count >= 2:
        raise HTTPException(status_code=400, detail="Maximum 2 active stores allowed")
    
    store_obj = Store(**store.dict())
    await db.stores.insert_one(store_obj.dict())
    return store_obj

@api_router.put("/admin/stores/{store_id}", response_model=Store)
async def admin_update_store(store_id: str, store: StoreBase, auth=Depends(verify_admin_token)):
    # Check max 2 active stores if activating
    if store.is_active:
        current = await db.stores.find_one({"id": store_id})
        if current and not current.get("is_active"):
            active_count = await db.stores.count_documents({"is_active": True})
            if active_count >= 2:
                raise HTTPException(status_code=400, detail="Maximum 2 active stores allowed")
    
    result = await db.stores.update_one({"id": store_id}, {"$set": store.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Store not found")
    updated = await db.stores.find_one({"id": store_id})
    return Store(**updated)

@api_router.delete("/admin/stores/{store_id}")
async def admin_delete_store(store_id: str, auth=Depends(verify_admin_token)):
    result = await db.stores.delete_one({"id": store_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Store not found")
    return {"message": "Store deleted"}

# Admin Staff
@api_router.get("/admin/staff", response_model=List[StaffBase])
async def admin_get_staff(auth=Depends(verify_admin_token)):
    staff_list = await db.staff.find().to_list(100)
    return [StaffBase(**s) for s in staff_list]

@api_router.post("/admin/staff", response_model=StaffBase)
async def admin_create_staff(staff: StaffCreate, auth=Depends(verify_admin_token)):
    # Check if username exists
    existing = await db.staff.find_one({"username": staff.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    staff_obj = Staff(
        username=staff.username,
        store_id=staff.store_id,
        is_active=staff.is_active,
        password_hash=bcrypt.hash(staff.password)
    )
    await db.staff.insert_one(staff_obj.dict())
    return StaffBase(**staff_obj.dict())

@api_router.put("/admin/staff/{staff_id}", response_model=StaffBase)
async def admin_update_staff(staff_id: str, staff: StaffBase, auth=Depends(verify_admin_token)):
    result = await db.staff.update_one({"id": staff_id}, {"$set": staff.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Staff not found")
    updated = await db.staff.find_one({"id": staff_id})
    return StaffBase(**updated)

@api_router.delete("/admin/staff/{staff_id}")
async def admin_delete_staff(staff_id: str, auth=Depends(verify_admin_token)):
    result = await db.staff.delete_one({"id": staff_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Staff not found")
    return {"message": "Staff deleted"}

# Admin Redemptions
@api_router.get("/admin/redemptions")
async def admin_get_redemptions(
    auth=Depends(verify_admin_token),
    store_id: Optional[str] = None,
    date: Optional[str] = None,
    limit: int = 100
):
    query = {}
    if store_id:
        query["store_id"] = store_id
    if date:
        query["redeem_date"] = date
    
    redemptions = await db.redemptions.find(query).sort("redeemed_at", -1).to_list(limit)
    
    # Enrich with coupon and store names
    result = []
    for r in redemptions:
        coupon = await db.coupons.find_one({"id": r["coupon_id"]})
        store = await db.stores.find_one({"id": r["store_id"]})
        staff = await db.staff.find_one({"id": r["staff_id"]})
        
        result.append({
            **r,
            "coupon_title": coupon["title"] if coupon else "Unknown",
            "coupon_code": coupon["code"] if coupon else "Unknown",
            "store_name": store["name"] if store else "Unknown",
            "staff_name": staff["username"] if staff else "Unknown"
        })
    
    return result

# ==================== SEED DATA ====================

async def seed_data():
    """Initialize database with seed data"""
    logger.info("Checking and seeding data...")
    
    # Check if already seeded
    existing_categories = await db.categories.count_documents({})
    if existing_categories > 0:
        logger.info("Data already seeded, skipping...")
        return
    
    logger.info("Seeding initial data...")
    
    # Seed Categories
    categories = [
        {"id": "cat-highlights", "name": "Highlights", "order": 1, "is_active": True},
        {"id": "cat-burger", "name": "Burger", "order": 2, "is_active": True},
        {"id": "cat-menus", "name": "Menüs", "order": 3, "is_active": True},
        {"id": "cat-fingerfood", "name": "Fingerfood", "order": 4, "is_active": True},
        {"id": "cat-saucen", "name": "Saucen & Dips", "order": 5, "is_active": True},
        {"id": "cat-kids", "name": "Kids", "order": 6, "is_active": True},
        {"id": "cat-veggie", "name": "Veggie", "order": 7, "is_active": True},
    ]
    
    for cat in categories:
        cat["created_at"] = datetime.utcnow()
    await db.categories.insert_many(categories)
    
    # Seed Stores
    stores = [
        {
            "id": "store-1",
            "name": "Oria Fresh Hauptbahnhof",
            "address": "Bahnhofsplatz 1",
            "city": "Berlin",
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": "store-2",
            "name": "Oria Fresh Alexanderplatz",
            "address": "Alexanderstraße 5",
            "city": "Berlin",
            "is_active": True,
            "created_at": datetime.utcnow()
        }
    ]
    await db.stores.insert_many(stores)
    
    # Validity period (1 year)
    valid_from = datetime.utcnow()
    valid_until = datetime.utcnow() + timedelta(days=365)
    
    # Seed Coupons (12 coupons as specified)
    coupons = [
        # Highlights
        {
            "id": "coupon-1",
            "code": "OF-067",
            "title": "Menu 67 – Schüler Deal",
            "subtitle": "Smash Burger (1 Patty) + Pommes + Capri-Sun",
            "description": "Der perfekte Deal für Schüler! Ein leckerer Smash Burger mit knusprigen Pommes und erfrischender Capri-Sun.",
            "price": 6.70,
            "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
            "category_id": "cat-highlights",
            "valid_store_ids": [],
            "badges": [],
            "conditions": "Pro Person und Tag nur einmal einlösbar.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": "coupon-2",
            "code": "OF-2FOR1",
            "title": "Smash Classic 2für1",
            "subtitle": "Zwei Smash Burger zum Preis von einem",
            "description": "Doppelter Genuss! Hol dir zwei unserer beliebten Smash Classic Burger zum Preis von einem.",
            "price": 9.90,
            "image_url": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800",
            "category_id": "cat-highlights",
            "valid_store_ids": [],
            "badges": ["APP ONLY"],
            "conditions": "Nur in der App einlösbar. Pro Person und Tag nur einmal.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        # Burger
        {
            "id": "coupon-3",
            "code": "OF-SCC",
            "title": "Oria Single Chili Cheese",
            "subtitle": "Smash Burger mit würziger Chili Cheese Sauce",
            "description": "Unser Single Patty Burger mit der legendären Chili Cheese Sauce.",
            "price": 8.90,
            "image_url": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
            "category_id": "cat-burger",
            "valid_store_ids": [],
            "badges": [],
            "conditions": "Pro Person und Tag nur einmal einlösbar.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": "coupon-4",
            "code": "OF-DCC",
            "title": "Oria Double Chili Cheese",
            "subtitle": "Double Patty mit Chili Cheese Sauce",
            "description": "Doppelt lecker! Zwei Patties mit unserer heißgeliebten Chili Cheese Sauce.",
            "price": 11.20,
            "image_url": "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?w=800",
            "category_id": "cat-burger",
            "valid_store_ids": [],
            "badges": [],
            "conditions": "Pro Person und Tag nur einmal einlösbar.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": "coupon-5",
            "code": "OF-SC",
            "title": "Single Cheese",
            "subtitle": "Klassischer Cheeseburger mit einem Patty",
            "description": "Der Klassiker! Single Patty mit geschmolzenem Käse.",
            "price": 8.50,
            "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
            "category_id": "cat-burger",
            "valid_store_ids": [],
            "badges": [],
            "conditions": "Pro Person und Tag nur einmal einlösbar.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": "coupon-6",
            "code": "OF-DC",
            "title": "Double Cheese",
            "subtitle": "Doppelter Cheeseburger für extra Genuss",
            "description": "Für den großen Hunger: Double Patty mit doppelt Käse!",
            "price": 10.80,
            "image_url": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800",
            "category_id": "cat-burger",
            "valid_store_ids": [],
            "badges": [],
            "conditions": "Pro Person und Tag nur einmal einlösbar.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        # Menüs
        {
            "id": "coupon-7",
            "code": "OF-CM",
            "title": "Classic Menü",
            "subtitle": "Burger + Pommes als komplettes Menü",
            "description": "Das perfekte Menü: Dein Lieblingsburger mit knusprigen Pommes.",
            "price": 11.90,
            "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
            "category_id": "cat-menus",
            "valid_store_ids": [],
            "badges": [],
            "conditions": "Pro Person und Tag nur einmal einlösbar.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": "coupon-8",
            "code": "OF-CHM",
            "title": "Chicken Menü",
            "subtitle": "Chicken Burger + Pommes + Getränk",
            "description": "Für Chicken-Lover: Knuspriger Chicken Burger mit Pommes und Getränk.",
            "price": 12.50,
            "image_url": "https://images.unsplash.com/photo-1627662168223-7df99068099a?w=800",
            "category_id": "cat-menus",
            "valid_store_ids": [],
            "badges": [],
            "conditions": "Pro Person und Tag nur einmal einlösbar.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        # Fingerfood
        {
            "id": "coupon-9",
            "code": "OF-OR",
            "title": "Onion Rings (8 Stk.) + Dip",
            "subtitle": "Knusprige Zwiebelringe mit Sauce",
            "description": "8 goldbraun frittierte Onion Rings mit Dip deiner Wahl.",
            "price": 4.90,
            "image_url": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800",
            "category_id": "cat-fingerfood",
            "valid_store_ids": [],
            "badges": [],
            "conditions": "Pro Person und Tag nur einmal einlösbar.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": "coupon-10",
            "code": "OF-NUG",
            "title": "Nuggets (6 Stk.) + Dip",
            "subtitle": "Chicken Nuggets mit Dip",
            "description": "6 knusprige Chicken Nuggets mit deiner Lieblings-Sauce.",
            "price": 4.90,
            "image_url": "https://images.unsplash.com/photo-1627662168223-7df99068099a?w=800",
            "category_id": "cat-fingerfood",
            "valid_store_ids": [],
            "badges": [],
            "conditions": "Pro Person und Tag nur einmal einlösbar.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        # Saucen & Dips
        {
            "id": "coupon-11",
            "code": "OF-SS",
            "title": "Smash Sauce",
            "subtitle": "Unsere Signature Sauce",
            "description": "Die legendäre Oria Fresh Smash Sauce für extra Geschmack!",
            "price": 2.00,
            "image_url": "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800",
            "category_id": "cat-saucen",
            "valid_store_ids": [],
            "badges": [],
            "conditions": "Pro Person und Tag nur einmal einlösbar.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": "coupon-12",
            "code": "OF-CCS",
            "title": "Chili Cheese Sauce",
            "subtitle": "Würzige Käsesauce",
            "description": "Die würzige Chili Cheese Sauce – perfekt zu allem!",
            "price": 2.00,
            "image_url": "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800",
            "category_id": "cat-saucen",
            "valid_store_ids": [],
            "badges": [],
            "conditions": "Pro Person und Tag nur einmal einlösbar.",
            "valid_from": valid_from,
            "valid_until": valid_until,
            "is_active": True,
            "created_at": datetime.utcnow()
        }
    ]
    await db.coupons.insert_many(coupons)
    
    # Seed Admin
    admin = {
        "id": "admin-1",
        "username": "admin",
        "password_hash": bcrypt.hash("admin123"),
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    await db.admins.insert_one(admin)
    
    # Seed Staff
    staff = [
        {
            "id": "staff-1",
            "username": "staff1",
            "password_hash": bcrypt.hash("staff123"),
            "store_id": "store-1",
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": "staff-2",
            "username": "staff2",
            "password_hash": bcrypt.hash("staff123"),
            "store_id": "store-2",
            "is_active": True,
            "created_at": datetime.utcnow()
        }
    ]
    await db.staff.insert_many(staff)
    
    # Create indexes
    await db.redemptions.create_index(
        [("coupon_id", 1), ("device_hash", 1), ("redeem_date", 1)],
        unique=True,
        name="unique_daily_redemption"
    )
    
    logger.info("Seed data complete!")

# ==================== APP SETUP ====================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await seed_data()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
