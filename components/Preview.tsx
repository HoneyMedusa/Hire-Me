import React from 'react';
import { ResumeData, TemplateType } from '../types';
import { MapPin, Mail, Phone, Globe, Linkedin } from 'lucide-react';

interface PreviewProps {
  data: ResumeData;
  template: TemplateType;
  forwardedRef: React.RefObject<HTMLDivElement>;
}

const Preview: React.FC<PreviewProps> = ({ data, template, forwardedRef }) => {
  const { personalInfo, experience, education, skills } = data;

  // Template 1: Classic
  if (template === 'classic') {
    return (
      <div ref={forwardedRef} className="bg-white text-gray-800 h-full w-full mx-auto p-8 shadow-sm print:shadow-none print:p-0 print:w-full max-w-[210mm] min-h-[297mm]">
        <header className="border-b-2 border-gray-800 pb-6 mb-6 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-3">{personalInfo.fullName}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {personalInfo.email && <span className="flex items-center"><Mail className="w-3 h-3 mr-1"/> {personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center"><Phone className="w-3 h-3 mr-1"/> {personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {personalInfo.location}</span>}
            {personalInfo.linkedin && <span className="flex items-center"><Linkedin className="w-3 h-3 mr-1"/> {personalInfo.linkedin}</span>}
            {personalInfo.portfolio && <span className="flex items-center"><Globe className="w-3 h-3 mr-1"/> {personalInfo.portfolio}</span>}
          </div>
        </header>

        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Professional Summary</h2>
            <p className="text-sm leading-relaxed text-justify">{personalInfo.summary}</p>
          </section>
        )}

        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Experience</h2>
          <div className="space-y-5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <span className="text-sm font-semibold">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-sm italic text-gray-700 mb-2">{exp.company}</div>
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Education</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between font-bold">
                <span>{edu.school}</span>
                <span>{edu.year}</span>
              </div>
              <div className="text-sm">{edu.degree}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <span key={skill.id} className="text-sm border border-gray-300 rounded px-2 py-0.5 bg-gray-50">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Template 2: Modern
  if (template === 'modern') {
    return (
      <div ref={forwardedRef} className="bg-white h-full w-full mx-auto grid grid-cols-[30%_70%] shadow-sm print:shadow-none print:w-full max-w-[210mm] min-h-[297mm]">
        {/* Sidebar */}
        <div className="bg-slate-800 text-white p-6 print:bg-slate-800 print:text-white print-color-adjust-exact">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2 leading-tight">{personalInfo.fullName}</h1>
            <div className="text-slate-300 text-sm space-y-2 mt-4">
              {personalInfo.email && <div className="flex items-center break-all"><Mail className="w-3 h-3 mr-2 shrink-0"/> {personalInfo.email}</div>}
              {personalInfo.phone && <div className="flex items-center"><Phone className="w-3 h-3 mr-2 shrink-0"/> {personalInfo.phone}</div>}
              {personalInfo.location && <div className="flex items-center"><MapPin className="w-3 h-3 mr-2 shrink-0"/> {personalInfo.location}</div>}
              {personalInfo.linkedin && <div className="flex items-center break-all"><Linkedin className="w-3 h-3 mr-2 shrink-0"/> {personalInfo.linkedin}</div>}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-600 pb-2">Education</h2>
            {education.map(edu => (
              <div key={edu.id} className="mb-4 text-sm">
                <div className="font-bold text-white">{edu.degree}</div>
                <div className="text-slate-300">{edu.school}</div>
                <div className="text-slate-400 text-xs">{edu.year}</div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-600 pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill.id} className="text-xs bg-slate-700 rounded px-2 py-1 text-slate-200">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 bg-white text-gray-800">
          {personalInfo.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                 <span className="w-2 h-8 bg-slate-800 mr-3 rounded-sm"></span> Profile
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                 <span className="w-2 h-8 bg-slate-800 mr-3 rounded-sm"></span> Experience
            </h2>
            <div className="space-y-8">
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                   <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-4 border-white"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg text-gray-800">{exp.role}</h3>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-600 mb-2">{exp.company}</div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Template 3: Minimal (Best for ATS)
  return (
    <div ref={forwardedRef} className="bg-white text-black h-full w-full mx-auto p-10 max-w-[210mm] min-h-[297mm] font-serif shadow-sm print:shadow-none print:p-0 print:w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-1">{personalInfo.fullName}</h1>
        <div className="text-sm text-gray-800">
          {personalInfo.location} | {personalInfo.email} | {personalInfo.phone}
          {personalInfo.linkedin && ` | ${personalInfo.linkedin}`}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-4">
           <p className="text-sm leading-6">{personalInfo.summary}</p>
        </section>
      )}

      <section className="mb-5">
        <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Experience</h2>
        {experience.map(exp => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between font-bold text-sm">
              <span>{exp.company}</span>
              <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
            </div>
            <div className="text-sm italic mb-1">{exp.role}</div>
            <p className="text-sm leading-6 whitespace-pre-wrap">{exp.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-5">
        <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Education</h2>
        {education.map(edu => (
          <div key={edu.id} className="mb-2 text-sm">
             <div className="flex justify-between">
                <span className="font-bold">{edu.school}</span>
                <span>{edu.year}</span>
             </div>
             <div>{edu.degree}</div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Skills</h2>
        <p className="text-sm leading-6">
          {skills.map(s => s.name).join(', ')}
        </p>
      </section>
    </div>
  );
};

export default Preview;