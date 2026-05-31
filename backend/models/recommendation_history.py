from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    Text,
    DateTime,
    JSON
)
from sqlalchemy.orm import relationship
from datetime import datetime


from database import Base

class RecommendationHistory(Base):
    __tablename__ = "recommendation_history"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(String, nullable=False, index=True)

    # Stores user preferences JSON
    # Example:
    # {
    #   "budget": 15,
    #   "fuel_type": "Petrol",
    #   "body_type": "SUV"
    # }
    preferences_json = Column(JSON, nullable=False)

    recommended_car_id = Column(
        Integer,
        ForeignKey("cars.id"),
        nullable=False
    )

    ai_summary = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # Many recommendation rows -> one car
    recommended_car = relationship(
        "Car",
        back_populates="recommendation_history"
    )