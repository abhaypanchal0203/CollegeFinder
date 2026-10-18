import React, { useState, useEffect } from 'react';

const TopColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/top-colleges');
        const data = await response.json();
        
        if (data.success) {
          // ==========================================
          // NAYA LOGIC: Data ko College Name se Group karna
          // ==========================================
          const groupedData = data.data.reduce((acc, curr) => {
            if (!acc[curr.Name]) {
              // Agar college pehli baar aaya hai, toh usko object me daalo
              acc[curr.Name] = {
                ...curr,
                allBranches: [{ name: curr.Branch, cutoff: curr.Cutoff }]
              };
            } else {
              // Agar college pehle se hai, toh uski array me bas branch add kar do
              acc[curr.Name].allBranches.push({ name: curr.Branch, cutoff: curr.Cutoff });
            }
            return acc;
          }, {});

          // Object ko wapas Array me convert karke state me save kiya
          setColleges(Object.values(groupedData));
        } else {
          setError(data.error || "Failed to load data.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Backend server se connect nahi ho paya.");
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  return (
    <main className="flex-grow bg-slate-50 min-h-screen py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Premier <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Institutions</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our complete AWS DynamoDB verified database of top engineering colleges across Maharashtra.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500 font-semibold tracking-wide animate-pulse">Syncing with AWS Cloud...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold border border-red-100 shadow-sm max-w-2xl mx-auto">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
          </div>
        )}

        {!loading && !error && colleges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colleges.map((college, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedCollege(college)}
                className="bg-white rounded-3xl p-2 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 group cursor-pointer flex flex-col"
              >
                <div className="overflow-hidden rounded-2xl relative">
                  <img 
                    src={`https://placehold.co/600x300/1e3a8a/ffffff?text=${college.Name?.replace(/ /g, '+')}`} 
                    alt={college.Name} 
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    ⭐ {college.Rating || 'N/A'}
                  </div>
                  <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="bg-white text-blue-900 font-bold px-4 py-2 rounded-full shadow-lg">View Details</span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight line-clamp-2">{college.Name}</h3>
                    <p className="text-slate-500 text-sm font-medium"><i className="fa-solid fa-location-dot text-blue-500 mr-1.5"></i>{college.Location}</p>
                  </div>
                  
                  {/* Saari Branches List yahan dikhegi */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {college.allBranches.map((b, i) => (
                      <span key={i} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-200">
                        {b.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Yearly Fees</p>
                      <p className="font-extrabold text-slate-900">₹{college.Fees}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Branches</p>
                      <span className="text-blue-600 font-extrabold">{college.allBranches.length} Available</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup Component */}
      {selectedCollege && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCollege(null)}></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all">
            <button onClick={() => setSelectedCollege(null)} className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors z-10">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="h-64 w-full relative">
              <img src={`https://placehold.co/600x300/1e3a8a/ffffff?text=${selectedCollege.Name?.replace(/ /g, '+')}`} alt={selectedCollege.Name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white pr-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-lg">Verified Institution</span>
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">{selectedCollege.Name}</h2>
                <p className="text-blue-200 mt-2"><i className="fa-solid fa-location-dot mr-2"></i>{selectedCollege.Location}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                 <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Yearly Fees</p>
                    <p className="font-bold text-slate-800 text-xl">₹{selectedCollege.Fees}</p>
                 </div>
                 <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">College Rating</p>
                    <p className="font-bold text-amber-500 text-xl">⭐ {selectedCollege.Rating || 'N/A'}</p>
                 </div>
                 <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                     <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">DynamoDB DB ID</p>
                     <p className="font-mono text-blue-700 text-sm">{selectedCollege.PK}</p>
                 </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-4">Available Branches & Cutoffs</h3>
              
              {/* Har branch ki cutoff detail ek grid me dikhayenge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {selectedCollege.allBranches.map((branch, i) => (
                   <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors">
                     <span className="font-bold text-slate-700">{branch.name}</span>
                     <span className="bg-green-100 text-green-700 font-extrabold px-3 py-1 rounded-lg border border-green-200">
                        {branch.cutoff} %ile
                     </span>
                   </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => alert(`Redirecting to official application portal for ${selectedCollege.Name}...`)}
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

export default TopColleges;