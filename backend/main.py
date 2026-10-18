
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import recommend

app = FastAPI(title="CollegeFinder API")

# CORS setup bahut zaroori hai taaki React (port 5173) FastAPI (port 8000) se baat kar sake
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # React ka URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router ko main app mein jodh diya
app.include_router(recommend.router)

@app.get("/")
def read_root():
    return {"status": "Success", "message": "Bhai tera backend aur router mast chal raha hai!"}