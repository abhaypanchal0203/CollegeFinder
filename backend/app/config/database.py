import boto3
import os
from dotenv import load_dotenv

# .env file se AWS Learner Lab credentials load kar rahe hain
load_dotenv()

dynamodb = boto3.resource(
    'dynamodb',
    region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=os.getenv('AWS_SESSION_TOKEN')
)

TABLE_NAME = 'CollegeRecommendationDB'
table = dynamodb.Table(TABLE_NAME)

def get_table():
    return table