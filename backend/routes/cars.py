from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from services.ai_summary_service import generate_ai_summary
from models.recommendation_history import RecommendationHistory
from services.recommendation_service import get_recommendations
from schema.recommendation import RecommendationHistoryResponse, RecommendationRequest, RecommendationResultResponse, CarResponseWithScore
from database import get_db

router = APIRouter(prefix="/cars")

@router.get("")
def read_cars(db: Session = Depends(get_db)):
    # This is where you would query the database for cars
    # For example:
    # cars = db.query(Car).all()
    # return cars
    return {"message": "This will return a list of cars"}

@router.post("/recommend", response_model=RecommendationResultResponse)
def recommend_cars(payload:RecommendationRequest, db: Session = Depends(get_db)):
    print(payload)
    result = get_recommendations(payload, db)
    print("result: ", result)

    if not result or len(result)==0:
        recommended_car = None
        alternatives = []
        ai_response = "No cars found matching your preferences."
    else:
        top_pick = result[0]
        alternative_cars = result[1:6]  # Get up to 5 alternative cars
        
        recommended_car = CarResponseWithScore.model_validate(
            {
                **top_pick['car'].__dict__,
                "score": top_pick["score"]
            }
        )

        alternatives = [
            CarResponseWithScore.model_validate( 
                {
                    **item["car"].__dict__,
                    "score": item["score"]
                }
            )
            for item in alternative_cars
        ]

        r_car = top_pick['car']
        alt_cars = [item["car"] for item in alternative_cars]

        ai_response = generate_ai_summary(
            payload=payload,
            recommended_car=r_car,
            alternative_cars=alt_cars
        )

        # ai_summary = ai_response

        # Save the recommendation to the history
        db.add(RecommendationHistory(
            session_id=payload.session_id,
            preferences_json=payload.model_dump(),
            recommended_car_id=top_pick["car"].id,
            ai_summary=ai_response
        ))
        db.commit()

    response = {
        "recommended_car": recommended_car,
        "alternatives": alternatives,
        "ai_summary": ai_response
    }

    return response

@router.get("/history/{session_id}", response_model=RecommendationHistoryResponse)
def get_recommendation_history(session_id: str, db: Session = Depends(get_db)):
    history = db.query(RecommendationHistory).options(joinedload(RecommendationHistory.recommended_car)).filter(RecommendationHistory.session_id == session_id).order_by(
            RecommendationHistory.created_at.desc()
        ).all()

    return {
        "history": history
    }