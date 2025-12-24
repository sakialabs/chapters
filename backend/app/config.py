"""Configuration management using Pydantic Settings"""
import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""
    
    # App
    app_name: str = "Chapters API"
    debug: bool = False
    
    # Database
    database_url: str
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    
    # OpenAI
    openai_api_key: str
    
    # S3 Storage
    s3_bucket: str
    s3_access_key: str
    s3_secret_key: str
    s3_endpoint_url: str | None = None  # For Cloudflare R2
    s3_region: str = "auto"
    
    # Sentry
    sentry_dsn: str | None = None
    
    # Rate Limits
    margin_rate_limit: int = 20  # per hour
    btl_invite_rate_limit: int = 3  # per day
    muse_prompt_rate_limit: int = 10  # per hour
    muse_rewrite_rate_limit: int = 15  # per hour
    muse_cover_rate_limit: int = 5  # per day
    
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).parent.parent / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


# Global settings instance
settings = Settings()
