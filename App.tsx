import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, TemplateType, AIAnalysisResult } from './types';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { analyzeResume } from './services/geminiService';
import { Download, LayoutTemplate, Printer, AlertCircle, X, Check, Star } from 'lucide-react';

// Initial state for new users
const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  targetJobDescription: ''
};

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const printRef = useRef<HTMLDivElement>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('hireMeResumeData');
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('hireMeResumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  const handlePrint = () => {
    window.print();
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeResume(resumeData);
    setAnalysisResult(result);
    setIsAnalyzing(false);
    setShowAnalysis(true);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 no-print z-20">
        <div className="flex items-center space-x-2">
           <div className="bg-indigo-600 p-1.5 rounded-lg">
             <Star className="text-white w-5 h-5 fill-current" />
           </div>
           <div>
             <h1 className="text-xl font-bold text-gray-800 tracking-tight">Hire me</h1>
             <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">by TechDivas</p>
           </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Template Selector */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['modern', 'classic', 'minimal'] as TemplateType[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTemplate(t)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                  selectedTemplate === t
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Editor Panel */}
        <div className="w-1/2 max-w-2xl p-6 overflow-hidden flex flex-col no-print bg-slate-50 border-r border-gray-200">
           <div className="mb-4">
             <h2 className="text-2xl font-bold text-gray-800">Resume Builder</h2>
             <p className="text-gray-500 text-sm">Fill in your details. AI will help polish your content.</p>
           </div>
           <Editor 
              data={resumeData} 
              onChange={setResumeData} 
              onAnalyze={runAnalysis}
              isAnalyzing={isAnalyzing}
           />
        </div>

        {/* Preview Panel */}
        <div className="flex-1 bg-gray-100 overflow-y-auto p-8 flex justify-center items-start print:p-0 print:overflow-visible print:bg-white print:w-full print:block print:absolute print:top-0 print:left-0 print:z-50">
          <div className="shadow-2xl print:shadow-none scale-90 origin-top transform-gpu transition-transform">
             <Preview 
                data={resumeData} 
                template={selectedTemplate} 
                forwardedRef={printRef}
             />
          </div>
        </div>
      </main>

      {/* Analysis Modal */}
      {showAnalysis && analysisResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn no-print">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <LayoutTemplate className="w-5 h-5 mr-2 text-indigo-600" />
                ATS Analysis Report
              </h2>
              <button 
                onClick={() => setShowAnalysis(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
               <div className="flex items-center space-x-6 mb-8">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={analysisResult.score > 70 ? "#10B981" : analysisResult.score > 40 ? "#F59E0B" : "#EF4444"}
                        strokeWidth="3"
                        strokeDasharray={`${analysisResult.score}, 100`}
                        className="animate-[spin_1s_ease-out_reverse]"
                      />
                    </svg>
                    <span className="absolute text-2xl font-bold text-gray-700">{analysisResult.score}%</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Compatibility: <span className={analysisResult.score > 70 ? "text-green-600" : "text-yellow-600"}>{analysisResult.atsCompatibility}</span></h3>
                    <p className="text-sm text-gray-500">Based on standard ATS parsing rules and keyword matching.</p>
                  </div>
               </div>

               <div className="space-y-6">
                 <div>
                   <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><Check className="w-4 h-4 mr-2 text-green-500"/> Matched Keywords</h4>
                   <div className="flex flex-wrap gap-2">
                     {analysisResult.keywordMatches.length > 0 ? analysisResult.keywordMatches.map(k => (
                       <span key={k} className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-sm">{k}</span>
                     )) : <span className="text-gray-400 text-sm">No specific keywords matched.</span>}
                   </div>
                 </div>

                 <div>
                   <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><AlertCircle className="w-4 h-4 mr-2 text-red-500"/> Missing Keywords</h4>
                   <div className="flex flex-wrap gap-2">
                     {analysisResult.missingKeywords.length > 0 ? analysisResult.missingKeywords.map(k => (
                       <span key={k} className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-sm">{k}</span>
                     )) : <span className="text-green-600 text-sm">Great job! You covered key terms.</span>}
                   </div>
                 </div>

                 <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h4 className="font-semibold text-indigo-900 mb-2">AI Suggestions</h4>
                    <p className="text-sm text-indigo-800 leading-relaxed">
                      {analysisResult.suggestions}
                    </p>
                 </div>
               </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowAnalysis(false)}
                className="btn-primary"
              >
                Back to Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles for specific scrollbar */}
      <style>{`
        .input-field {
          @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm;
        }
        .btn-primary {
          @apply bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm;
        }
        .btn-secondary {
          @apply bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;