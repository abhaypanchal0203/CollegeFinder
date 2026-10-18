import React, { useState, useEffect } from 'react';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        // Hardcoded UI hata kar ab API se data aa raha hai
        const response = await fetch('http://localhost:5000/api/exams');
        const data = await response.json();
        
        if (data.success) {
          setExams(data.data);
        } else {
          setError("Exams data load nahi ho paya.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("API Gateway se connection fail ho gaya.");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <main className="flex-grow bg-slate-50 min-h-screen py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Entrance Exams</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay updated with dynamically fetched schedules and official links for top engineering exams.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500 font-semibold tracking-wide animate-pulse">Fetching Exam Data via API Gateway...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold border border-red-100 shadow-sm max-w-2xl mx-auto">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
          </div>
        )}

        {!loading && !error && exams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {exams.map((exam, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-extrabold text-slate-900">{exam.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            exam.level.includes("National") ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}>
                            {exam.level}
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">{exam.fullName}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                    <i className="fa-solid fa-pen-to-square text-blue-500 text-xl"></i>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 flex-grow">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1"><i className="fa-regular fa-calendar text-blue-400 mr-1.5"></i>Tentative Date</p>
                    <p className="font-bold text-slate-800">{exam.tentativeDate}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1"><i className="fa-solid fa-laptop text-blue-400 mr-1.5"></i>Mode</p>
                    <p className="font-bold text-slate-800">{exam.mode}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1"><i className="fa-solid fa-user-graduate text-blue-400 mr-1.5"></i>Eligibility</p>
                    <p className="font-bold text-slate-800">{exam.eligibility}</p>
                  </div>
                </div>

                <a 
                  href={exam.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full block text-center bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 border border-blue-100"
                >
                  Visit Official Portal <i className="fa-solid fa-arrow-up-right-from-square ml-2"></i>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Exams;