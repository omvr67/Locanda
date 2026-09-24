import os
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.engine import make_url
from dotenv import load_dotenv

# 1. Load environment variables from the .env file
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# 2. Get the database URL from the environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set in the .env file!")

def normalize_database_url(database_url: str) -> str:
    """Convert a PostgreSQL URL to an asyncpg URL.

    asyncpg receives TLS through the ``ssl`` connect argument, while
    ``sslmode`` is a libpq option and must not be passed through.
    """
    url = make_url(database_url)
    if url.drivername in {"postgres", "postgresql"}:
        url = url.set(drivername="postgresql+asyncpg")
    unsupported_asyncpg_options = {"sslmode", "channel_binding"}
    if unsupported_asyncpg_options.intersection(url.query):
        query = {
            key: value
            for key, value in url.query.items()
            if key not in unsupported_asyncpg_options
        }
        url = url.set(query=query)
    return str(url)


DATABASE_URL = normalize_database_url(DATABASE_URL)

# 4. Create the Async Engine
engine = create_async_engine(
    DATABASE_URL, 
    echo=True, 
    connect_args={"ssl": True}
)

# 5. Create the Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# 6. Create the Declarative Base
Base = declarative_base()