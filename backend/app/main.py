"""FastAPI application initialization"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sentry_sdk

from app.config import settings
from app.error_handlers import setup_error_handlers
from app.middleware import RequestLoggingMiddleware, RateLimitHeaderMiddleware
from app.logging_config import logger


# Initialize Sentry if DSN is provided
if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown events"""
    # Startup
    logger.info(f"🚀 Starting {settings.app_name}")
    yield
    # Shutdown
    logger.info(f"👋 Shutting down {settings.app_name}")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="A calm, expressive, AI-assisted social platform built for depth, not dopamine.",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add custom middleware
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitHeaderMiddleware)

# Setup error handlers
setup_error_handlers(app)


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="A calm, expressive, AI-assisted social platform built for depth, not dopamine.",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Chapters API",
        "tagline": "Everyone's a book. Each post is a chapter.",
        "philosophy": "Calm, intentional, depth over dopamine"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# Include routers
from app.auth.router import router as auth_router
from app.users.router import router as users_router
from app.chapters.router import router as chapters_router
from app.study.router import router as study_router
from app.engagement.router import router as engagement_router
from app.margins.router import router as margins_router
from app.library.router import router as library_router
from app.muse.router import router as muse_router
from app.btl.router import router as btl_router
from app.moderation.router import router as moderation_router
from app.privacy.router import router as privacy_router
from app.media.router import router as media_router

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(chapters_router)
app.include_router(study_router)
app.include_router(engagement_router)
app.include_router(margins_router)
app.include_router(library_router)
app.include_router(muse_router)
app.include_router(btl_router)
app.include_router(moderation_router)
app.include_router(privacy_router)
app.include_router(media_router)
