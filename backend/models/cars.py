from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
)
from sqlalchemy.orm import relationship

from database import Base


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)

    make = Column(String, nullable=False, index=True)
    model = Column(String, nullable=False, index=True)
    variant = Column(String, nullable=True)

    body_type = Column(String, nullable=False)
    fuel_type = Column(String, nullable=False)
    transmission = Column(String, nullable=False)

    seating_capacity = Column(Integer, nullable=False)

    price_lakh = Column(Float, nullable=False)
    mileage_kmpl = Column(Float, nullable=True)

    engine_cc = Column(Integer, nullable=True)
    power_bhp = Column(Float, nullable=True)

    safety_rating = Column(Float, nullable=True)

    boot_space_liters = Column(Integer, nullable=True)

    # One car -> many reviews
    reviews = relationship(
        "Review",
        back_populates="car",
        cascade="all, delete-orphan"
    )

    # One car -> many recommendation history records
    recommendation_history = relationship(
        "RecommendationHistory",
        back_populates="recommended_car"
    )

