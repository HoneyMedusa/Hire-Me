import React, { useState } from 'react';
import { ResumeData, Experience, Education, Skill } from '../types';
import { Plus, Trash2, Wand2, Briefcase, GraduationCap, User, Layout, FileText, CheckCircle2 } from 'lucide-react';
import { generateSummary, improveDescription } from '../services/geminiService';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const Editor: React.FC<EditorProps> = ({ data, onChange, onAnalyze, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'jd'>('personal');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const handleGenerateSummary = async () => {
    setLoadingAI('summary');
    const summary = await generateSummary(data);
    updatePersonalInfo('summary', summary);
    setLoadingAI(null);
  };

  const handleImproveExperience = async (id: string, text: string, role: string) => {
    setLoadingAI(`exp-${id}`);
    const improved = await improveDescription(text, role);
    const newExp = data.experience.map(e => e.id === id ? { ...e, description: improved } : e);
    onChange({ ...data, experience: newExp });
    setLoadingAI(null);
  };

  // Helper components for list management
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      role: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      year: ''
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(e => e.id !== id) });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
        ...data,
        education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const addSkill = () => {
      const newSkill: Skill = { id: Date.now().toString(), name: '', level: 'Intermediate' };
      onChange({ ...data, skills: [...data.skills, newSkill] });
  };

  const removeSkill = (id: string) => {
      onChange({ ...data, skills: data.skills.filter(s => s.id !== id) });
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
      onChange({
          ...data,
          skills: data.skills.map(s => s.id === id ? { ...s, [field]: value } : s)
      });
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Layout },
    { id: 'jd', label: 'Job Matching', icon: FileText },
  ];

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-full border border-gray-100">
      {/* Tabs */}
      <div className="flex border-b overflow-x-auto bg-gray-50/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        {activeTab === 'personal' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="input-field"
                value={data.personalInfo.fullName}
                onChange={e => updatePersonalInfo('fullName', e.target.value)}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="input-field"
                value={data.personalInfo.email}
                onChange={e => updatePersonalInfo('email', e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="input-field"
                value={data.personalInfo.phone}
                onChange={e => updatePersonalInfo('phone', e.target.value)}
              />
              <input
                type="text"
                placeholder="Location (City, Country)"
                className="input-field"
                value={data.personalInfo.location}
                onChange={e => updatePersonalInfo('location', e.target.value)}
              />
              <input
                type="text"
                placeholder="LinkedIn URL"
                className="input-field"
                value={data.personalInfo.linkedin}
                onChange={e => updatePersonalInfo('linkedin', e.target.value)}
              />
              <input
                type="text"
                placeholder="Portfolio URL"
                className="input-field"
                value={data.personalInfo.portfolio}
                onChange={e => updatePersonalInfo('portfolio', e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              <textarea
                className="input-field min-h-[120px]"
                placeholder="Brief summary of your career highlights..."
                value={data.personalInfo.summary}
                onChange={e => updatePersonalInfo('summary', e.target.value)}
              />
              <button
                onClick={handleGenerateSummary}
                disabled={loadingAI === 'summary'}
                className="absolute top-8 right-2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Auto-generate with AI"
              >
                {loadingAI === 'summary' ? (
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6 animate-fadeIn">
             <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
              <button onClick={addExperience} className="btn-secondary text-sm py-1.5 px-3">
                <Plus className="w-4 h-4 mr-1" /> Add Job
              </button>
            </div>
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 border rounded-lg bg-gray-50/50 group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    placeholder="Job Title"
                    className="input-field"
                    value={exp.role}
                    onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                  />
                  <input
                    placeholder="Company"
                    className="input-field"
                    value={exp.company}
                    onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                  />
                  <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Start Date"
                        className="input-field"
                        value={exp.startDate}
                        onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        className="input-field"
                        disabled={exp.current}
                        value={exp.current ? 'Present' : exp.endDate}
                        onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                      />
                  </div>
                   <div className="flex items-center">
                     <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                       <input
                         type="checkbox"
                         className="mr-2 rounded text-indigo-600 focus:ring-indigo-500"
                         checked={exp.current}
                         onChange={e => updateExperience(exp.id, 'current', e.target.checked)}
                       />
                       I currently work here
                     </label>
                   </div>
                </div>
                <div className="relative">
                    <textarea
                        placeholder="Job description and achievements..."
                        className="input-field min-h-[100px] w-full"
                        value={exp.description}
                        onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                    />
                    <div className="flex justify-between mt-2">
                        <button
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center"
                        >
                            <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </button>
                         <button
                            onClick={() => handleImproveExperience(exp.id, exp.description, exp.role)}
                            disabled={loadingAI === `exp-${exp.id}` || !exp.description}
                            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center font-medium"
                        >
                             {loadingAI === `exp-${exp.id}` ? (
                                <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                              ) : (
                                <Wand2 className="w-3 h-3 mr-1" />
                              )}
                            Enhance with AI
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'education' && (
            <div className="space-y-6 animate-fadeIn">
                 <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                  <button onClick={addEducation} className="btn-secondary text-sm py-1.5 px-3">
                    <Plus className="w-4 h-4 mr-1" /> Add Education
                  </button>
                </div>
                {data.education.map((edu) => (
                     <div key={edu.id} className="p-4 border rounded-lg bg-gray-50/50 mb-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                placeholder="Degree"
                                className="input-field"
                                value={edu.degree}
                                onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                            />
                            <input
                                placeholder="School / University"
                                className="input-field"
                                value={edu.school}
                                onChange={e => updateEducation(edu.id, 'school', e.target.value)}
                            />
                            <input
                                placeholder="Year of Graduation"
                                className="input-field"
                                value={edu.year}
                                onChange={e => updateEducation(edu.id, 'year', e.target.value)}
                            />
                            <div className="flex justify-end items-center">
                                 <button
                                    onClick={() => removeEducation(edu.id)}
                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                     </div>
                ))}
            </div>
        )}

        {activeTab === 'skills' && (
             <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                    <button onClick={addSkill} className="btn-secondary text-sm py-1.5 px-3">
                        <Plus className="w-4 h-4 mr-1" /> Add Skill
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center space-x-2 p-2 border rounded-md bg-white">
                             <input
                                placeholder="Skill (e.g. React)"
                                className="flex-1 outline-none text-sm text-gray-700"
                                value={skill.name}
                                onChange={e => updateSkill(skill.id, 'name', e.target.value)}
                            />
                             <select
                                className="text-xs bg-gray-100 border-none rounded p-1 text-gray-600 outline-none cursor-pointer"
                                value={skill.level}
                                onChange={e => updateSkill(skill.id, 'level', e.target.value as any)}
                             >
                                 <option value="Beginner">Beginner</option>
                                 <option value="Intermediate">Intermediate</option>
                                 <option value="Expert">Expert</option>
                             </select>
                             <button
                                onClick={() => removeSkill(skill.id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {activeTab === 'jd' && (
             <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-semibold text-gray-800">Job Description Matching</h3>
                <p className="text-sm text-gray-600">
                    Paste the job description below to analyze how well your resume matches the role.
                </p>
                <textarea
                    className="input-field min-h-[200px]"
                    placeholder="Paste job description text here..."
                    value={data.targetJobDescription}
                    onChange={e => onChange({...data, targetJobDescription: e.target.value})}
                />
                 <button
                    onClick={onAnalyze}
                    disabled={isAnalyzing || !data.targetJobDescription}
                    className="w-full btn-primary flex justify-center items-center py-3"
                >
                    {isAnalyzing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Analyzing ATS Match...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Run ATS Analysis
                        </>
                    )}
                </button>
             </div>
        )}
      </div>
    </div>
  );
};

export default Editor;