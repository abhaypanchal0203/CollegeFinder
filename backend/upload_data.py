import boto3
import os
from dotenv import load_dotenv
from decimal import Decimal

# .env se AWS credentials load kar rahe hain
load_dotenv()

# AWS DynamoDB se connect kar rahe hain
dynamodb = boto3.resource(
    'dynamodb',
    region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=os.getenv('AWS_SESSION_TOKEN')
)

table = dynamodb.Table('CollegeRecommendationDB')

# Master Data: Har college ki multiple branches aur unke real-like cutoffs
colleges_master_data = [
    {
        "name": "PICT (Pune Institute of Computer Technology)",
        "location": "Pune",
        "fees": "120000",
        "rating": "4.8",
        "tags": ["Strict Academics", "Top Placements"],
        "branches": {"CSE": 99.4, "IT": 98.8, "ENTC": 97.5, "AI-DS": 98.2}
    },
    {
        "name": "SPIT (Sardar Patel Institute of Technology)",
        "location": "Mumbai",
        "fees": "170000",
        "rating": "4.7",
        "tags": ["Excellent Coding Culture", "Mumbai Hub"],
        "branches": {"CSE": 99.6, "IT": 99.1, "ENTC": 98.0}
    },
    {
        "name": "VJTI (Veermata Jijabai Technological Institute)",
        "location": "Mumbai",
        "fees": "85000",
        "rating": "4.9",
        "tags": ["Government Aided", "Historic Campus", "High ROI"],
        "branches": {"CSE": 99.9, "IT": 99.6, "ENTC": 98.8}
    },
    {
        "name": "COEP Technological University",
        "location": "Pune",
        "fees": "90000",
        "rating": "4.9",
        "tags": ["Oldest College", "Govt Autonomous", "Huge Alumni Base"],
        "branches": {"CSE": 99.8, "IT": 99.5, "ENTC": 98.5, "Robotics": 97.2}
    },
    {
        "name": "Walchand College of Engineering",
        "location": "Sangli",
        "fees": "85000",
        "rating": "4.6",
        "tags": ["Government Aided", "Core Branches Strong"],
        "branches": {"CSE": 98.5, "IT": 97.8, "ENTC": 96.5}
    }
]

def seed_database():
    print("🚀 Starting Data Upload to AWS DynamoDB...")
    counter = 1
    
    for college in colleges_master_data:
        for branch_name, cutoff_score in college["branches"].items():
            
            pk_val = f"COLLEGE#{counter}"
            
            item = {
                "PK": pk_val,
                "SK": f"BRANCH#{branch_name}", # NAYA CODE: AWS Schema pass karne ke liye SK add ki
                "Name": college["name"],
                "Location": college["location"],
                "Fees": college["fees"],
                "Rating": college["rating"],
                "Tags": college["tags"],
                "Branch": branch_name,
                "Cutoff": Decimal(str(cutoff_score))
            }
            
            try:
                table.put_item(Item=item)
                print(f"✅ Uploaded: {college['name']} - {branch_name} (Cutoff: {cutoff_score})")
                counter += 1
            except Exception as e:
                print(f"❌ Failed to upload {college['name']} - {branch_name}: {e}")

    print(f"\n🎉 Total {counter - 1} records successfully injected into DynamoDB!")

if __name__ == "__main__":
    seed_database()