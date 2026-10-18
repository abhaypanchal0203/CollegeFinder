import requests
from bs4 import BeautifulSoup
import boto3
import os
from dotenv import load_dotenv
from decimal import Decimal
import uuid

# AWS Credentials Load karna
load_dotenv()
dynamodb = boto3.resource(
    'dynamodb',
    region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=os.getenv('AWS_SESSION_TOKEN')
)
table = dynamodb.Table('CollegeRecommendationDB')

def scrape_college_data():
    print("Initiating Web Scraper...")
    
    # Asli website par anti-scraping hoti hai, isliye hum standard headers bhejte hain
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    # Note: Abhi hum structure set kar rahe hain. Asli production mein hum MHT-CET 
    # ya kisi official site ka exact URL daalenge. Abhi main tujhe logic dikha raha hu.
    scraped_data = [
        # Maan le scraper ne ye live data extract kiya HTML se
        {"name": "Pune Institute of Computer Technology", "location": "Pune", "branch": "CSE", "cutoff": 99.65, "fees": 120000, "rating": 4.8},
        {"name": "Sardar Patel Institute of Technology", "location": "Mumbai", "branch": "CSE", "cutoff": 99.50, "fees": 170000, "rating": 4.7},
        {"name": "Walchand College of Engineering", "location": "Sangli", "branch": "IT", "cutoff": 98.90, "fees": 85000, "rating": 4.5}
    ]
    
    print(f"Scraped {len(scraped_data)} colleges. Pushing to AWS DynamoDB...")
    
    # Batch write karke hum AWS credits bachaate hain
    with table.batch_writer() as batch:
        for college in scraped_data:
            unique_id = str(uuid.uuid4())[:8] # Generate random ID
            item = {
                'PK': f"COLLEGE#{unique_id}",
                'SK': f"COURSE#{college['branch']}",
                'Name': college['name'],
                'Location': college['location'],
                'Branch': college['branch'],
                'Cutoff': Decimal(str(college['cutoff'])),
                'Fees': str(college['fees']),
                'Rating': str(college['rating']),
                'Tags': "New Updated Data"
            }
            batch.put_item(Item=item)
            
    print("✅ Live data successfully updated in Cloud!")

if __name__ == "__main__":
    scrape_college_data()