from fastapi import APIRouter, HTTPException
from app.schemas import StudentRequest, RecommendationResponse
from app.services.engine import generate_recommendations, log_failure_to_s3

router = APIRouter(
    prefix="/api",
    tags=["Recommendations"]
)

@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(student_data: StudentRequest):
    try:
        print(f"Engine Triggered: Calculating for {student_data.score} percentile, Branch: {student_data.branch}")
        
        # Calling our recommendation engine
        matches = await generate_recommendations(student_data)
        
        return {
            "status": "Success",
            "message": f"Successfully calculated recommendations.",
            "matches": matches
        }
    except Exception as e:
        # NAYA CODE: Agar API fail hui, toh direct S3 par crash log bhej do
        log_failure_to_s3(e)
        raise HTTPException(status_code=500, detail="Backend engine failed. Diagnostics sent to S3.")