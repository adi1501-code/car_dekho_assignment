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

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    car_id = Column(
        Integer,
        ForeignKey("cars.id", ondelete="CASCADE"),
        nullable=False
    )

    review_text = Column(Text, nullable=False)

    # Example: 1-5 rating
    rating = Column(Float, nullable=False)

    # Many reviews -> one car
    car = relationship(
        "Car",
        back_populates="reviews"
    )
