import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
load_dotenv()

from schema.recommendation import RecommendationRequest

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)

SYSTEM_PROMPT = """
You are an AI automotive recommendation assistant.

Your job is to explain why a recommended car fits the user's preferences based on:

- budget
- driving usage
- priorities
- recommended car details
- alternative cars

Guidelines:

- Keep the response concise and practical
- Use a professional and helpful tone
- Focus on realistic automotive reasoning
- Mention key strengths relevant to the user's preferences
- Briefly mention tradeoffs if relevant
- Avoid overly marketing-style language
- Avoid exaggerated claims
- Do not invent specifications not provided in the input
- Keep the response under 120 words
"""

recommendation_session = client.chats.create(
    model="gemini-2.5-flash",
    config=types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT
    )
)

def generate_ai_summary(
    payload:RecommendationRequest,
    recommended_car,
    alternative_cars
) -> str:
    alternative_text = ", ".join([
    f"{car.make} {car.model}"
    for car in alternative_cars
    ])

    review_snippets = [
        review.review_text
        for review in recommended_car.reviews[:3]
    ]

    review_text = "\n".join([
        f"- {review}" for review in review_snippets
    ])

    prompt = f"""
    User Preferences:
    - Budget: {payload.budget} lakh
    - Usage: {payload.usage}
    - Priorities: {", ".join(payload.priorities)}

    Recommended Car:
    - {recommended_car.make} {recommended_car.model} {recommended_car.variant}
    - Price: {recommended_car.price_lakh} lakh
    - Mileage: {recommended_car.mileage_kmpl} kmpl
    - Safety Rating: {recommended_car.safety_rating}
    - Transmission: {recommended_car.transmission}

    Owner feedbacks:
    {review_text}

    Alternative Cars:
    {alternative_text}

    Generate a concise recommendation summary.
    """
    try:
        response = recommendation_session.send_message(message=prompt)

        print(response.text)
        return response.text
    except Exception as e:
        print("exception occurred: ", e)
        return (
            f"The {recommended_car.make} {recommended_car.model} is a strong fit based on your budget, usage, and driving priorities." 
        )
    