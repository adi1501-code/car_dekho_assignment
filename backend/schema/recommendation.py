from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    session_id: str = Field(
        min_length=3,
        max_length=100
    )

    # Budget in lakhs
    budget: float = Field(
        gt=0,
        le=100
    )

    body_type: (
        
        str| None
    ) = None

    fuel_type: (
        str
        | None
    ) = None

    transmission: (
        str
        | None
    ) = None

    seating_capacity: int | None = Field(
        default=None,
        ge=2,
        le=9
    )

    usage: (
        str
        | None
    ) = None

    priorities: (
        list[str]
        | None
    ) = None

class ReviewResponse(BaseModel):
    review_text: str
    rating: float

    class Config:
        from_attributes = True


class CarResponse(BaseModel):
    id: int

    make: str
    model: str
    variant: str

    body_type: str
    fuel_type: str
    transmission: str

    seating_capacity: int

    price_lakh: float
    mileage_kmpl: float | None

    engine_cc: int | None
    power_bhp: float | None

    safety_rating: float | None
    boot_space_liters: int | None

    reviews: list[ReviewResponse]

    class Config:
        from_attributes = True

class CarResponseWithScore(CarResponse):
    score: int

class RecommendationResultResponse(BaseModel):

    recommended_car: CarResponseWithScore | None

    alternatives: list[CarResponseWithScore] | None

    ai_summary: str | None

class RecommendationHistoryItem(BaseModel):
    session_id: str
    preferences_json: dict
    recommended_car: CarResponse
    ai_summary: str | None
    created_at: datetime

    class Config:
        from_attributes = True

class RecommendationHistoryResponse(BaseModel):
    history: list[RecommendationHistoryItem]
