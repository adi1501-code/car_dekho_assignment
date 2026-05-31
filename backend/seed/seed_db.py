import json

from sqlalchemy.orm import Session

from database import SessionLocal
from models import Car, Review

JSON_FILE = "seed/data.json"


def seed_database():
    db: Session = SessionLocal()

    try:
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            cars_data = json.load(f)

        # If even one car exists, skip seeding
        existing = db.query(Car).first()

        if existing:
            print("Database already seeded.")
            return

        for car_data in cars_data:
            user_reviews = car_data.pop("user_reviews", [])
            
            car = Car(**car_data)

            db.add(car)
            db.flush()

            for review_data in user_reviews:

                review = Review(
                    car_id=car.id,
                    review_text=review_data["review_text"],
                    rating=review_data["rating"]
                )

                db.add(review)

        db.commit()

        print("Database seeded successfully.")

    except Exception as e:
        db.rollback()
        print("Seeding failed:", str(e))

    finally:
        db.close()