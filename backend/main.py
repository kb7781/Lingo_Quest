from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, SessionLocal, Base
from seed import seed_database
from routers import home, lesson, profile, leaderboard


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None]:
    # Create all tables and seed on startup
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(title="LingoQuest API", lifespan=lifespan)

# CORS — allow all origins for production frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "LingoQuest API is running!", "status": "online"}


# Mount routers
app.include_router(home.router, prefix="/api")
app.include_router(lesson.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")
