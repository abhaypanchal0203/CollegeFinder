from pydantic import BaseModel, Field
from typing import List, Optional

# 1. Frontend se jo request aayegi uska structure
class StudentRequest(BaseModel):
    score: float = Field(..., ge=0, le=100, description="Student's percentile or score (0-100)")
    branch: str = Field(..., description="Preferred engineering branch (e.g., CSE, IT)")
    location: str = Field(..., description="Preferred city (e.g., Mumbai, Pune, Any)")
    category: Optional[str] = Field(default="Open", description="Caste category for cutoff matching")
    # NAYA FIELD: Budget add kiya taaki frontend fail na ho
    budget: float = Field(default=200000.0, description="Maximum yearly budget in INR")

# 2. Backend se jo single college ka data wapas jayega
class CollegeMatch(BaseModel):
    college_id: str
    name: str
    location: str
    branch: str
    cutoff: float
    fees: str
    rating: str
    image: str
    tags: List[str]

# 3. Final API Response jisme list of colleges hogi
class RecommendationResponse(BaseModel):
    status: str
    message: str
    matches: List[CollegeMatch]