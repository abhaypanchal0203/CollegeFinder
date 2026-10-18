import asyncio
import boto3
import json
from datetime import datetime
from app.config.database import get_table
from app.schemas import StudentRequest, CollegeMatch

# ==========================================
# 1. AWS S3 Client Setup (PPT Requirement)
# ==========================================
s3_client = boto3.client('s3')
BUCKET_NAME = "abhay-college-logs-2026" # Dhyan rakhna ye tere bucket ka exact naam ho

def log_failure_to_s3(error_details):
    """Logs system failures to AWS S3 bucket for diagnostics."""
    try:
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        file_name = f"crash-logs/error-{timestamp}.json"
        
        log_data = {
            "timestamp": timestamp,
            "error_message": str(error_details),
            "module": "RecommendationEngine",
            "action": "DynamoDB_Scan",
            "status": "FAILED"
        }
        
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=file_name,
            Body=json.dumps(log_data, indent=4),
            ContentType='application/json'
        )
        print(f"✅ S3 Log Uploaded Successfully: {file_name}")
    except Exception as e:
        print(f"❌ S3 Upload failed: {e}")

# ==========================================
# 2. Main Compute Engine
# ==========================================
async def generate_recommendations(student_data: StudentRequest) -> list[CollegeMatch]:

    table = get_table()
    
    # Simulating Cloud Compute Delay
    await asyncio.sleep(1) 
    
    # AWS DynamoDB se saara real data fetch karna
    try:
        response = table.scan()
        items = response.get('Items', [])
    except Exception as e:
        print(f"AWS DynamoDB Error: {e}")
        # NAYA CODE: Agar DB fail hua toh S3 par log bhej do
        log_failure_to_s3(e)
        return []

    # Recommendation Logic (Filter & Match)
    matches = []
    for item in items:
        # Pydantic schema aur DB keys ko match kar rahe hain
        db_branch = item.get('Branch', '')
        db_location = item.get('Location', '')
        db_cutoff = float(item.get('Cutoff', 100))
        
        # Condition 1: Branch match honi chahiye
        if db_branch.lower() != student_data.branch.lower():
            continue
            
        # Condition 2: Location match honi chahiye (agar "Any" nahi hai)
        if student_data.location.lower() != "any" and student_data.location.lower() not in db_location.lower():
            continue
            
        # Condition 3: Category ke hisaab se Cutoff Relaxation
        cutoff_relaxation = 0.0
        user_category = student_data.category.upper()
        
        if user_category == "OBC":
            cutoff_relaxation = 3.0   # OBC ke liye 3 percentile ki chhoot
        elif user_category == "SC/ST":
            cutoff_relaxation = 5.0   # SC/ST ke liye 5 percentile ki chhoot
        elif user_category == "NT" or user_category == "VJNT":
            cutoff_relaxation = 4.0   # NT ke liye 4 percentile ki chhoot
            
        adjusted_cutoff = db_cutoff - cutoff_relaxation
        
        # Ab user ka score is naye (adjusted) cutoff se compare hoga
        if student_data.score < adjusted_cutoff:
            continue
            
        # Condition 4: Budget Check (Naya Filter)
        try:
            db_fees = float(item.get('Fees', '999999'))
        except ValueError:
            db_fees = 999999.0
            
        if db_fees > student_data.budget:
            continue
            
        # Agar saari conditions pass hui, toh list mein add karo
        pk_val = item.get('PK', 'COLLEGE#Unknown')
        matches.append(
            CollegeMatch(
                college_id=pk_val.split('#')[1] if '#' in pk_val else pk_val, 
                name=item.get('Name', 'Unknown'),
                location=item.get('Location', 'Unknown'),
                branch=item.get('Branch', 'Unknown'),
                cutoff=db_cutoff,
                fees=str(item.get('Fees', 'N/A')),
                rating=str(item.get('Rating', 'N/A')),
                image=f"https://placehold.co/600x300/1e3a8a/ffffff?text={item.get('Name', 'College').replace(' ', '+')}",
                tags=["AWS Matched", "Within Budget"]
            )
        )
        
    # Colleges ko cutoff ke hisaab se sort karo (highest first)
    matches.sort(key=lambda x: x.cutoff, reverse=True)
    
    return matches