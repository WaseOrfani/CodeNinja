from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import jwt
import bcrypt
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
SECRET_KEY = os.environ.get('JWT_SECRET', 'afghanfood-secret-key-2024')
ALGORITHM = "HS256"

app = FastAPI(title="AfghanFood.de API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# ============== MODELS ==============

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    role: str = "admin"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Ingredient(BaseModel):
    name: str
    amount: str

class RecipeCreate(BaseModel):
    title: str
    slug: str
    description: str
    image_url: str
    category: str
    difficulty: str  # Einfach, Mittel, Schwer
    prep_time: str
    cook_time: str
    servings: int
    ingredients: List[Ingredient]
    instructions: List[str]
    tips: Optional[str] = None
    tags: List[str] = []

class Recipe(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    description: str
    image_url: str
    category: str
    difficulty: str
    prep_time: str
    cook_time: str
    servings: int
    ingredients: List[Ingredient]
    instructions: List[str]
    tips: Optional[str] = None
    tags: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    image_url: str
    category: str
    tags: List[str] = []

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    image_url: str
    category: str
    tags: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PageContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    content: str
    meta_title: str
    meta_description: str
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ============== AUTH HELPERS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc).timestamp() + 86400 * 7  # 7 days
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="Benutzer nicht gefunden")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token abgelaufen")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ungültiger Token")

# ============== AUTH ROUTES ==============

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="E-Mail bereits registriert")
    
    user = User(
        email=user_data.email,
        name=user_data.name
    )
    user_dict = user.model_dump()
    user_dict["password_hash"] = hash_password(user_data.password)
    
    await db.users.insert_one(user_dict)
    token = create_token(user.id, user.email)
    
    return {"token": token, "user": user.model_dump()}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Ungültige Anmeldedaten")
    
    token = create_token(user["id"], user["email"])
    user_response = {k: v for k, v in user.items() if k != "password_hash"}
    
    return {"token": token, "user": user_response}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {k: v for k, v in current_user.items() if k != "password_hash"}

# ============== RECIPE ROUTES ==============

@api_router.get("/recipes", response_model=List[Recipe])
async def get_recipes(category: Optional[str] = None, limit: int = 50):
    query = {}
    if category:
        query["category"] = category
    recipes = await db.recipes.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return recipes

@api_router.get("/recipes/{slug}")
async def get_recipe(slug: str):
    recipe = await db.recipes.find_one({"slug": slug}, {"_id": 0})
    if not recipe:
        raise HTTPException(status_code=404, detail="Rezept nicht gefunden")
    return recipe

@api_router.post("/recipes", response_model=Recipe)
async def create_recipe(recipe_data: RecipeCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.recipes.find_one({"slug": recipe_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug bereits vergeben")
    
    recipe = Recipe(**recipe_data.model_dump())
    await db.recipes.insert_one(recipe.model_dump())
    return recipe

@api_router.put("/recipes/{recipe_id}", response_model=Recipe)
async def update_recipe(recipe_id: str, recipe_data: RecipeCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.recipes.find_one({"id": recipe_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Rezept nicht gefunden")
    
    update_data = recipe_data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.recipes.update_one({"id": recipe_id}, {"$set": update_data})
    updated = await db.recipes.find_one({"id": recipe_id}, {"_id": 0})
    return updated

@api_router.delete("/recipes/{recipe_id}")
async def delete_recipe(recipe_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.recipes.delete_one({"id": recipe_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Rezept nicht gefunden")
    return {"message": "Rezept gelöscht"}

# ============== BLOG ROUTES ==============

@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts(limit: int = 20):
    posts = await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return posts

@api_router.get("/blog/{slug}")
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Artikel nicht gefunden")
    return post

@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(post_data: BlogPostCreate, current_user: dict = Depends(get_current_user)):
    post = BlogPost(**post_data.model_dump())
    await db.blog_posts.insert_one(post.model_dump())
    return post

@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, post_data: BlogPostCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.blog_posts.find_one({"id": post_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Artikel nicht gefunden")
    
    update_data = post_data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    updated = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    return updated

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Artikel nicht gefunden")
    return {"message": "Artikel gelöscht"}

# ============== PAGES ROUTES ==============

@api_router.get("/pages/{slug}")
async def get_page(slug: str):
    page = await db.pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    return page

@api_router.get("/pages")
async def get_all_pages():
    pages = await db.pages.find({}, {"_id": 0}).to_list(100)
    return pages

@api_router.put("/pages/{slug}")
async def update_page(slug: str, content: dict, current_user: dict = Depends(get_current_user)):
    content["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.pages.update_one({"slug": slug}, {"$set": content}, upsert=True)
    return await db.pages.find_one({"slug": slug}, {"_id": 0})

# ============== CATEGORIES ==============

@api_router.get("/categories")
async def get_categories():
    categories = [
        {"id": "hauptgerichte", "name": "Hauptgerichte", "description": "Traditionelle afghanische Hauptspeisen"},
        {"id": "vorspeisen", "name": "Vorspeisen", "description": "Appetitanreger und kleine Gerichte"},
        {"id": "beilagen", "name": "Beilagen", "description": "Brot, Reis und Beilagen"},
        {"id": "suppen", "name": "Suppen", "description": "Wärmende afghanische Suppen"},
        {"id": "desserts", "name": "Desserts", "description": "Süße Köstlichkeiten"},
        {"id": "getraenke", "name": "Getränke", "description": "Traditionelle Getränke und Tees"}
    ]
    return categories

# ============== SITEMAP ==============

@api_router.get("/sitemap")
async def get_sitemap():
    recipes = await db.recipes.find({}, {"slug": 1, "updated_at": 1, "_id": 0}).to_list(1000)
    posts = await db.blog_posts.find({}, {"slug": 1, "updated_at": 1, "_id": 0}).to_list(1000)
    
    sitemap = {
        "static_pages": [
            "/", "/rezepte", "/afghanische-esskultur", "/zutaten-gewuerze",
            "/kuechenhelfer", "/blog", "/ueber-uns", "/impressum", "/datenschutz"
        ],
        "recipes": [{"url": f"/rezepte/{r['slug']}", "updated": r.get("updated_at")} for r in recipes],
        "blog_posts": [{"url": f"/blog/{p['slug']}", "updated": p.get("updated_at")} for p in posts]
    }
    return sitemap

# ============== HEALTH CHECK ==============

@api_router.get("/")
async def root():
    return {"message": "AfghanFood.de API", "version": "1.0.0", "status": "running"}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "database": "connected"}

# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
