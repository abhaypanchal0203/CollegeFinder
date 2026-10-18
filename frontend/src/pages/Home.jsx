import React, { useState, useRef } from 'react';

const Home = () => {
  const [formData, setFormData] = useState({ score: '', branch: '', location: '', category: 'Open', budget: 200000 });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(false);
  const [recommendedColleges, setRecommendedColleges] = useState([]); 
  
  // NAYA STATE: Selected college ki details store karne ke liye
  const [selectedCollege, setSelectedCollege] = useState(null); 
  const resultsRef = useRef(null);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branch || !formData.location) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }
    setShowResults(false);
    setLoading(true);
    setTimeout(() => { resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);

    try {
      const studentToken = localStorage.getItem('studentToken');
      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          score: parseFloat(formData.score),
          branch: formData.branch,
          location: formData.location,
          category: formData.category,
          budget: parseFloat(formData.budget)
        })
      });

      const data = await response.json();
      if (response.ok) {
        setRecommendedColleges(data.matches || data); 
        setLoading(false);
        setShowResults(true);
      } else {
        alert("Backend error: " + (data.error || data.detail || "Unknown error"));
        setLoading(false);
      }
    } catch (err) {
      console.error("Connection failed:", err);
      alert("Server connection failed.");
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow bg-slate-50 relative">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
            <div className="absolute top-1/2 right-12 w-72 h-72 rounded-full bg-indigo-500 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-sm font-medium text-blue-100">Live API Gateway Connected</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
                Unlock Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Future Path.</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Our cloud-native engine processes your academic profile through AWS DynamoDB to recommend the exact institutions where you belong.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 border border-slate-100">
                <h2 className="text-2xl font-bold mb-8 text-slate-800 flex items-center gap-3">
                  <i className="fa-solid fa-sliders text-blue-600"></i> Preference Parameters
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Score / Percentile</label>
                      <input type="number" name="score" value={formData.score} onChange={handleInputChange} required placeholder="e.g. 95.5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Engineering Branch</label>
                      <select name="branch" value={formData.branch} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                        <option value="" disabled>Select Branch</option>
                        <option value="CSE">Computer Science (CSE)</option>
                        <option value="IT">Information Tech (IT)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Preferred Location</label>
                      <select name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                        <option value="" disabled>Select City</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Pune">Pune</option>
                        <option value="Any">Anywhere in India</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Caste Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                        <option value="Open">Open (General)</option>
                        <option value="OBC">OBC</option>
                        <option value="SC/ST">SC/ST</option>
                        <option value="NT">NT/VJNT</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700">Maximum Yearly Budget (₹)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-slate-400 font-bold">₹</span>
                        <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} required placeholder="150000" className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200">
                    {error ? <span className="text-red-200">Please fill all fields</span> : <span>Execute Engine Match <i className="fa-solid fa-arrow-right ml-2"></i></span>}
                  </button>
                </form>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Results Section */}
      <div ref={resultsRef} className="bg-slate-50">
        {loading && (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500 font-semibold tracking-wide animate-pulse">Querying AWS DynamoDB...</p>
          </div>
        )}

        {showResults && (
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Matches</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-1.5 rounded-full">{recommendedColleges.length} Institutions Found</span>
            </div>
            
            {recommendedColleges && recommendedColleges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendedColleges.map((college, index) => (
                  // NAYA: onClick event lagaya hai jisse college ki info Modal me set hogi
                  <div 
                    key={index} 
                    onClick={() => setSelectedCollege(college)}
                    className="bg-white rounded-3xl p-2 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 group cursor-pointer"
                  >
                    <div className="overflow-hidden rounded-2xl relative">
                      <img src={college.image || "https://via.placeholder.com/400x200?text=College"} alt={college.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        ⭐ {college.rating || '4.5'}
                      </div>
                      {/* NAYA: Hover Hover text */}
                      <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <span className="bg-white text-blue-900 font-bold px-4 py-2 rounded-full shadow-lg">View Details</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{college.name}</h3>
                          <p className="text-slate-500 text-sm font-medium"><i className="fa-solid fa-location-dot text-blue-500 mr-1.5"></i>{college.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">{college.branch}</span>
                        {college.tags && college.tags.map((tag, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-md">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-magnifying-glass text-2xl text-slate-400"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Parameters Matched</h3>
                <p className="text-slate-500 max-w-md mx-auto">Our engine couldn't find institutions matching your specific constraints. Try relaxing your budget or location parameters.</p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* ==============================================
          NAYA CODE: DETAILED MODAL POPUP
          Jab koi card click karega toh ye render hoga
          ============================================== */}
      {selectedCollege && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Background Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCollege(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedCollege(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            {/* Modal Image */}
            <div className="h-64 w-full relative">
              <img src={selectedCollege.image} alt={selectedCollege.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-lg">AWS Verified Profile</span>
                <h2 className="text-3xl font-extrabold">{selectedCollege.name}</h2>
                <p className="text-blue-200 mt-1"><i className="fa-solid fa-location-dot mr-2"></i>{selectedCollege.location}</p>
              </div>
            </div>

            {/* Detailed Info Grid */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Academic & Financial Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Branch</p>
                  <p className="font-bold text-slate-800">{selectedCollege.branch}</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Cutoff Required</p>
                  <p className="font-bold text-green-600 text-lg">{selectedCollege.cutoff} %ile</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Yearly Fees</p>
                  <p className="font-bold text-slate-800 text-lg">₹{selectedCollege.fees}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Rating</p>
                  <p className="font-bold text-blue-600 text-lg">⭐ {selectedCollege.rating}</p>
                </div>
              </div>

              {/* Dynamic Extracted Details (No Hardcoding) 
                  Agar AWS DB me naye fields hain (like Placements, Facilities), 
                  toh hum map karke dikha sakte hain. Abhi existing tags dikha rahe hain */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">DynamoDB Meta Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCollege.tags && selectedCollege.tags.map((tag, i) => (
                    <span key={i} className="bg-white border border-blue-200 text-blue-700 text-sm font-semibold px-4 py-2 rounded-lg shadow-sm">
                      <i className="fa-solid fa-check text-blue-500 mr-2"></i> {tag}
                    </span>
                  ))}
                  <span className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg shadow-sm">
                    Database ID: {selectedCollege.college_id}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => alert(`Redirecting to official application portal for ${selectedCollege.name}...`)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-colors"
                >
                  Apply Now <i className="fa-solid fa-external-link-alt ml-2"></i>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default Home;