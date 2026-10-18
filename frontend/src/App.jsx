import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import TopColleges from './pages/TopColleges';
import Exams from './pages/Exams';
import Login from './pages/Login';

// ==========================================
// 1. Security Guard
// ==========================================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('studentToken');
  
  // Agar token nahi mila, toh user ko zabardasti /login par bhej do
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// ==========================================
// 2. Main Layout (Sirf andar wale pages ke liye)
// Isme Navbar hai. Ye login page pe render HIKI NAHI hoga.
// ==========================================
const AppLayout = ({ children }) => {
  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    window.location.href = '/login'; 
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans antialiased min-h-screen flex flex-col">
      {/* Main Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <span className="font-extrabold text-2xl text-slate-800 tracking-tight">College<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Finder</span></span>
            </Link>
            
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors">Home</Link>
              <Link to="/top-colleges" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors">Top Colleges</Link>
              <Link to="/exams" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors">Exams</Link>
            </div>
            
            <div>
              <button onClick={handleLogout} className="bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 px-6 py-2.5 rounded-full font-bold transition-all duration-300 border border-slate-200 hover:border-red-200">
                Logout
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Niche ka page content yahan aayega */}
      {children}
    </div>
  );
};

// ==========================================
// 3. Main App Routing
// ==========================================
function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN PAGE: Ispe koi Navbar nahi hai, seedha page dikhega */}
        <Route path="/login" element={<Login />} />
        
        {/* BAAKI PAGES: Agar URL mein kuch aur hai, toh pehle Guard check karega, fir Navbar dikhayega */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/top-colleges" element={<TopColleges />} />
                  <Route path="/exams" element={<Exams />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;