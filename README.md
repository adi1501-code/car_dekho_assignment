# Local Setup
## 1. Clone the repository
```bash
    git clone https://github.com/adi1501-code/car_dekho_assignment
    cd car_dekho_assignment
```

## 2. Backend setup
```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --reload
```
### Configure env variables
Create a .env file inside the backend directory with the following content:
- GEMINI_API_KEY = your_api_key_here
- PROJECT_NAME = your_project_name_here
- PROJECT_NUMBER = your_project_number_here

Backend will run on: http://localhost:8000

## 3. Frontend setup
```bash
    cd frontend
    npm install
    npm run dev
```
### Configure env variables
Create a .env file inside the frontend directory with the following content:
VITE_API_BASE_URL = http://localhost:8000

Frontend will run on: http://localhost:5173

# Production deployment
- Frontend is deployed on Vercel: https://car-recommendation-two.vercel.app
- Backend is deployed on Render: https://car-recommendation-api-mk56.onrender.com
