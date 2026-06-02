# FastAPI Predictive Service serving the LSTM model
# Conforms to SOP 03 rules.

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import uvicorn
from model import get_dropout_risk, get_career_recommendation, get_comprehensive_analysis

app = FastAPI(
    title="EduTrace Predictive AI Service",
    description="Provides real-time student dropout risk calculations and career recommendations.",
    version="1.0.0"
)

# Input Pydantic Model
class PredictionInput(BaseModel):
    student_address: str = Field(..., description="Ethereum Hex Address of the student.")
    scores: List[float] = Field(..., description="Time-series list of recent student scores.")
    attendance_rate: float = Field(..., ge=0.0, le=1.0, description="Attendance rate (from 0.0 to 1.0).")
    current_grades: Optional[Dict[str, float]] = Field(None, description="Optional detailed grades per subject.")

# Output Pydantic Models for 5 AI Metrics
class SkillProfile(BaseModel):
    primary_domain: str
    skills_breakdown: Dict[str, float]

class JobMatch(BaseModel):
    position: str
    recommended_companies: List[str]

class SalaryProjection(BaseModel):
    currency: str
    min_salary: float
    max_salary: float

class StartupProbability(BaseModel):
    industry_domain: str
    success_probability: float

class PredictionOutput(BaseModel):
    student_address: str
    dropout_risk: float
    career_recommendation: str
    skill_profile: SkillProfile
    job_matching: JobMatch
    salary_projection: SalaryProjection
    startup_probability: StartupProbability
    learning_roadmap: List[str]

@app.get("/health")
def health():
    """
    Health check route for services indexing monitoring.
    """
    return {"status": "healthy", "service": "edutrace-python-ai"}

@app.post("/predict", response_model=PredictionOutput)
def predict(payload: PredictionInput):
    """
    Runs time-series LSTM sequence prediction on scores and attendance,
    and returns comprehensive AI analytics for the student.
    """
    if len(payload.scores) == 0:
        raise HTTPException(status_code=400, detail="Scores list cannot be empty.")
        
    try:
        # Run comprehensive AI analysis engine
        analysis = get_comprehensive_analysis(payload.student_address, payload.scores, payload.attendance_rate, payload.current_grades)
        return PredictionOutput(**analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction calculation failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

