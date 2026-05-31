
from sqlalchemy.orm import Session, joinedload
from models.cars import Car
from schema.recommendation import RecommendationRequest

def calculate_car_score(car, preferences):

    score = 0

    # Budget proximity
    if car.price_lakh <= preferences.budget:
        score += 20

        diff = preferences.budget - car.price_lakh

        if diff <= 1:
            score += 10

        elif diff <= 3:
            score += 5

    # Fuel type
    if preferences.fuel_type:
        if car.fuel_type == preferences.fuel_type:
            score += 15

    # Transmission
    if preferences.transmission:
        if car.transmission == preferences.transmission:
            score += 10

    # Seating
    if preferences.seating_capacity:
        if car.seating_capacity >= preferences.seating_capacity:
            score += 10

    # Body type
    if preferences.body_type:
        if car.body_type == preferences.body_type:
            score += 10

    # Usage scoring
    if preferences.usage:

        if preferences.usage == "City":

            if car.mileage_kmpl >= 18:
                score += 10

            if car.transmission == "Automatic":
                score += 5

            if car.engine_cc <= 1500:
                score += 5

        elif preferences.usage == "Highway":

            if car.power_bhp >= 140:
                score += 10

            if car.safety_rating >= 4:
                score += 8

            if car.engine_cc >= 1200:
                score += 5

        elif preferences.usage == "Family":

            if car.boot_space_liters >= 400:
                score += 10

            if car.safety_rating >= 4:
                score += 10

            if car.seating_capacity >= 5:
                score += 5

        elif preferences.usage == "Mixed":

            score += car.safety_rating * 2
            score += car.mileage_kmpl / 2

    # Priorities
    if preferences.priorities:

        for priority in preferences.priorities:

            if priority == "Safety":

                if car.safety_rating >= 4:
                    score += 10

            elif priority == "Mileage":

                if car.mileage_kmpl >= 20:
                    score += 10

            elif priority == "Performance":

                if car.power_bhp >= 140:
                    score += 10

            elif priority == "Family":

                if car.boot_space_liters >= 400:
                    score += 5

                if car.seating_capacity >= 5:
                    score += 5

                if car.safety_rating >= 4:
                    score += 5

    return score




def get_recommendations(payload: RecommendationRequest, db: Session):
    query = db.query(Car).options(joinedload(Car.reviews))
    
    if payload.budget:
        query = query.filter(Car.price_lakh <= payload.budget)

    if payload.body_type:
        query = query.filter(Car.body_type == payload.body_type)

    if payload.fuel_type:
        query = query.filter(Car.fuel_type == payload.fuel_type)

    if payload.transmission:
        query = query.filter(Car.transmission == payload.transmission)

    if payload.seating_capacity:
        query = query.filter(Car.seating_capacity >= payload.seating_capacity)

    filtered_cars = query.all()
    
    scored_cars = []

    for car in filtered_cars:

        score = calculate_car_score(
            car,
            payload
        )

        scored_cars.append(
            {
                "car": car,
                "score": score
            }
        )

    scored_cars.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return scored_cars