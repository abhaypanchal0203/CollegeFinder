require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const jwt = require('jsonwebtoken'); 

const app = express();
const PORT = 5000;

// Security ke liye secret key
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_college_key"; 

app.use(cors());
app.use(express.json());

const client = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});
const docClient = DynamoDBDocumentClient.from(client);

// ==========================================
// Login Route (Authentication)
// ==========================================
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (email === "abhay@student.com" && password === "password123") {
        const token = jwt.sign({ email: email, role: "student" }, JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ 
            success: true, 
            message: "Login successful!",
            token: token 
        });
    } else {
        res.status(401).json({ success: false, message: "Email ya Password galat hai" });
    }
});

// ==========================================
// NAYA: JWT Middleware (Chowkidar)
// ==========================================
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ error: "Access Denied! Bhai pehle login kar." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Token valid hai, user data request me daal diya
        next(); // Aage route par jaane do
    } catch (error) {
        return res.status(401).json({ error: "Invalid ya expired token! Wapas login kar." });
    }
};

// ==========================================
// Top Colleges Route
// ==========================================
app.get('/api/top-colleges', async (req, res) => {
    try {
        const command = new ScanCommand({ TableName: "CollegeRecommendationDB" });
        const response = await docClient.send(command);
        res.json({ success: true, data: response.Items });
    } catch (error) {
        console.error("AWS Error:", error);
        res.status(500).json({ success: false, error: "Database se data laane mein error aayi" });
    }
});


// ==========================================
// NAYA: Exams Route (Dynamic Data)
// ==========================================
app.get('/api/exams', (req, res) => {
    // Ye data tu baad me DynamoDB ya MongoDB me bhi shift kar sakta hai, 
    // par abhi API ke through bhej rahe hain taaki frontend dynamic rahe.
    const examsData = [
        {
            id: "EXAM_01",
            name: "MHT-CET 2027",
            fullName: "Maharashtra Health and Technical Common Entrance Test",
            level: "State Level",
            mode: "Online (CBT)",
            tentativeDate: "May 2027",
            eligibility: "12th Pass with PCM",
            website: "https://cetcell.mahacet.org/"
        },
        {
            id: "EXAM_02",
            name: "JEE Main 2027",
            fullName: "Joint Entrance Examination (Main)",
            level: "National Level",
            mode: "Online (CBT)",
            tentativeDate: "Jan & April 2027",
            eligibility: "75% in 12th Boards",
            website: "https://jeemain.nta.nic.in/"
        },
        {
            id: "EXAM_03",
            name: "BITSAT 2027",
            fullName: "BITS Admission Test",
            level: "University Level",
            mode: "Online (CBT)",
            tentativeDate: "May & June 2027",
            eligibility: "75% aggregate in PCM",
            website: "https://www.bitsadmission.com/"
        },
        {
            id: "EXAM_04",
            name: "GATE 2027",
            fullName: "Graduate Aptitude Test in Engineering",
            level: "National Level (PG)",
            mode: "Online (CBT)",
            tentativeDate: "February 2027",
            eligibility: "B.E./B.Tech Final Year or Passed",
            website: "https://gate.iitk.ac.in/"
        }
    ];

    res.json({ success: true, data: examsData });
});

// ==========================================
// Python Compute Engine Route (Proxy) - SECURED
// NAYA: Route ke andar 'verifyToken' add kiya
// ==========================================
app.post('/api/recommend', verifyToken, async (req, res) => {
    try {
        console.log("Valid Token found! Routing request to Python FastAPI Compute Engine...");
        
        const pythonResponse = await fetch('http://127.0.0.1:8000/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        
        const data = await pythonResponse.json();
        res.json(data); 
    } catch (error) {
        console.error("FastAPI Engine Error:", error);
        res.status(500).json({ error: "Compute Engine is down or processing too long." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
});