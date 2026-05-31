from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from seed.seed_db import seed_database
from routes import cars
import models
from database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed database
    seed_database()

    print("Application started.")

    yield

    print("Application shutting down.")


app = FastAPI(
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cars.router)