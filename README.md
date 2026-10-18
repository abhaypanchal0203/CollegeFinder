# Cloud-Native College Recommendation Engine 🚀

A 3-tier microservices architecture for academic placement analytics using AWS DynamoDB, Python FastAPI, and React.js.

## 🏗️ Architecture
- **Frontend:** React.js (Vite) + Tailwind CSS (Port 3000)
- **API Gateway:** Node.js + Express + JWT Auth (Port 5000)
- **Compute Engine:** Python FastAPI (Port 8000)
- **Database & Storage:** AWS DynamoDB & AWS S3 (Crash Logging)

## ⚙️ Local Setup Instructions


1. **Start Python Engine**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Or .\venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000

2. Start API Gateway
   cd api-gateway
   npm install
   node server.js

3. Start Frontend
   cd frontend
   npm install
   npm run dev