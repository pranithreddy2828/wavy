import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

def resolve_database_uri():
    """Dynamically resolves database URI: checks MySQL connectivity, falls back to SQLite."""
    custom_uri = os.getenv("DATABASE_URL")
    if custom_uri:
        return custom_uri

    force_sqlite = os.getenv("USE_SQLITE", "false").lower() == "true"
    if force_sqlite:
        db_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "wavy.db"))
        return f"sqlite:///{db_file}"

    db_user = os.getenv("DB_USER", "root")
    db_pass = os.getenv("DB_PASSWORD", "")
    db_host = os.getenv("DB_HOST", "127.0.0.1")
    db_port = int(os.getenv("DB_PORT", "3306"))
    db_name = os.getenv("DB_NAME", "wavy_db")

    try:
        import pymysql
        conn = pymysql.connect(host=db_host, user=db_user, password=db_pass, port=db_port, connect_timeout=1)
        conn.close()
        return f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}?charset=utf8mb4"
    except Exception:
        # Fallback to local SQLite file for zero-setup local dev
        db_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "wavy.db"))
        return f"sqlite:///{db_file}"

class Config:
    """Base application configuration."""
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key-change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-jwt-secret-key")
    JWT_ACCESS_EXPIRES = timedelta(minutes=int(os.getenv("JWT_ACCESS_EXPIRES_MINUTES", "15")))
    JWT_REFRESH_EXPIRES = timedelta(days=int(os.getenv("JWT_REFRESH_EXPIRES_DAYS", "30")))

    SQLALCHEMY_DATABASE_URI = resolve_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Engine options adjusted if using SQLite vs MySQL
    if SQLALCHEMY_DATABASE_URI.startswith("sqlite"):
        SQLALCHEMY_ENGINE_OPTIONS = {}
    else:
        SQLALCHEMY_ENGINE_OPTIONS = {
            "pool_recycle": 280,
            "pool_pre_ping": True,
            "pool_size": 10,
            "max_overflow": 20,
        }

    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "5000"))
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_ENGINE_OPTIONS = {}

config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}
