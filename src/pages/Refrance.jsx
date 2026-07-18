// src/pages/Refrance.jsx
import React, { useState } from "react";
import { ExternalLink, Globe, ArrowLeft, BookOpen, Video, FileText, Building, Users, GraduationCap, Headphones, Smartphone, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const sources = [
  {
    name: "منظمة الصحة العالمية",
    link: "https://www.who.int",
    icon: <Globe className="w-5 h-5 themed-text-secondary" />,
  },
  {
    name: "American Psychological Association",
    link: "https://www.apa.org",
    icon: <Globe className="w-5 h-5 themed-text-secondary" />,
  },
  {
    name: "Verywell Mind",
    link: "https://www.verywellmind.com",
    icon: <Globe className="w-5 h-5 themed-text-secondary" />,
  },
  {
    name: "PubMed",
    link: "https://pubmed.ncbi.nlm.nih.gov",
    icon: <Globe className="w-5 h-5 themed-text-secondary" />,
  },
  { 
    name: "دليل تدريب مهارات العلاج الجدلي السلوكي (عربي)", 
    link: "https://dbt-mena.com/ar/", 
    icon: <BookOpen className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "العلاج المعرفي السلوكي لاضطراب الشخصية الحدية", 
    link: "https://dbt-mena.com/ar/", 
    icon: <BookOpen className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "Building a Life Worth Living - Marsha Linehan", 
    link: "https://www.guilford.com/books/Building-a-Life-Worth-Living/Marsha-Linehan/9780812994612", 
    icon: <BookOpen className="w-5 h-5 themed-text-secondary" /> 
  },
  
  // فيديوهات
  { 
    name: "قناة DBT-RU (Rutgers University)", 
    link: "https://www.youtube.com/@DBTSkillsTraining", 
    icon: <Video className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "فيديوهات مهارات DBT (Ontario Shores)", 
    link: "https://www.ontarioshores.ca/dbt-videos-module", 
    icon: <Video className="w-5 h-5 themed-text-secondary" /> 
  },
  
  // مواقع تعليمية
  { 
    name: "DBT Self Help (المرجع الرئيسي)", 
    link: "https://dialecticalbehaviortherapy.com", 
    icon: <Globe className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "APA - American Psychological Association", 
    link: "https://www.apa.org", 
    icon: <Globe className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "Therapist Aid (أوراق عمل)", 
    link: "https://www.therapistaid.com", 
    icon: <FileText className="w-5 h-5 themed-text-secondary" /> 
  },
  
  // منظمات وشركات
  { 
    name: "DBT MENA (الشرق الأوسط)", 
    link: "https://dbt-mena.com/ar/", 
    icon: <Building className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "DBT Labs (تدريب مهني)", 
    link: "https://www.getdbt.com/dbt-learn", 
    icon: <GraduationCap className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "Treatment Implementation Collaborative", 
    link: "https://www.ticllc.org", 
    icon: <Users className="w-5 h-5 themed-text-secondary" /> 
  },
  
  // مراجع إضافية
  { 
    name: "NHS - Cognitive Behavioral Therapy Guide", 
    link: "https://www.nhs.uk", 
    icon: <Globe className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "المعهد الوطني للصحة النفسية (NIMH)", 
    link: "https://www.nimh.nih.gov", 
    icon: <Building className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "الذكاء العاطفي - دانييل جولمان", 
    link: "https://www.goodreads.com/book/show/26329.Emotional_Intelligence", 
    icon: <BookOpen className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "فن إدارة المشاعر - د. إبراهيم الفقي", 
    link: "https://www.neelwafurat.com/itempage.aspx?id=lbb224327-301614&search=books", 
    icon: <BookOpen className="w-5 h-5 themed-text-secondary" /> 
  },
  
  // فيديوهات تعليمية
  { 
    name: "قناة د. أحمد عمارة (إدارة المشاعر)", 
    link: "https://www.youtube.com/@ahmedammarapsychology", 
    icon: <Video className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "سلسلة فهم المشاعر - TED Talks", 
    link: "https://www.ted.com/topics/emotions", 
    icon: <Video className="w-5 h-5 themed-text-secondary" /> 
  },
  
  // مواقع وتطبيقات
  { 
    name: "منصة recovery للصحة النفسية", 
    link: "https://hayatipsych.com", 
    icon: <Globe className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "تطبيق MoodKit (إدارة المشاعر)", 
    link: "https://moodkitapp.com", 
    icon: <Smartphone className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "دليل المشاعر من جمعية علم النفس الأمريكية", 
    link: "https://www.apa.org/topics/emotions", 
    icon: <Globe className="w-5 h-5 themed-text-secondary" /> 
  },
  
  // تمارين عملية
  { 
    name: "أوراق عمل تنظيم المشاعر (Therapist Aid)", 
    link: "https://www.therapistaid.com/therapy-worksheets/emotions", 
    icon: <FileText className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "تمارين اليقظة لإدارة المشاعر", 
    link: "https://www.mindful.org/category/meditation/mindfulness-of-emotions/", 
    icon: <Brain className="w-5 h-5 themed-text-secondary" /> 
  },
  
  // دعم مجتمعي
  { 
    name: "مجموعات الدعم العاطفي (7cups)", 
    link: "https://www.7cups.com", 
    icon: <Users className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "منصة شيزلونج  للاستشارات النفسية", 
    link: "https://www.shezlong.com", 
    icon: <Users className="w-5 h-5 themed-text-secondary" /> 
  },
  
  // بودكاست
  { 
    name: "بودكاست عقول مع د. عبدالله السبيعي", 
    link: "https://soundcloud.com/aqwal", 
    icon: <Headphones className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "The Happiness Lab - د. لوري سانتوس", 
    link: "https://www.happinesslab.fm", 
    icon: <Headphones className="w-5 h-5 themed-text-secondary" /> 
  },
  
  // مراجع علمية
  { 
    name: "مركز جامعة بيركلي لعلوم المشاعر", 
    link: "https://greatergood.berkeley.edu", 
    icon: <GraduationCap className="w-5 h-5 themed-text-secondary" /> 
  },
  { 
    name: "دليل المشاعر الأساسية (باول إيكمان)", 
    link: "https://www.paulekman.com/universal-emotions/", 
    icon: <BookOpen className="w-5 h-5 themed-text-secondary" /> 
  }
];

export default function SourcesPage() {
  const [selectedSource, setSelectedSource] = useState(null);
  const nav = useNavigate();
  
  const handleClick = (source) => {
    setSelectedSource(source);
  };

  const handleVisit = () => {
    window.open(selectedSource.link, "_blank");
    setSelectedSource(null);
  };

  return (
    <div className="flex flex-col min-h-screen themed-bg px-4 pb-10 font-sans">
      <header className="flex items-center pt-4 pb-2 justify-between">
        <button onClick={() => nav(-1)} className="flex size-10 items-center themed-text">
          <ArrowLeft size={24} />
        </button>
        <h2 className="flex-1 text-center pr-10 text-lg font-bold themed-text-heading">References</h2>
      </header>

      {selectedSource && (
        <div className="mt-4 mb-6 border themed-border bg-[#e7f3ee]/30 dark:bg-[#1a2820]/40 p-6 rounded-xl shadow-inner transition-all">
          <p className="text-lg font-semibold mb-4 themed-text">
            هل ترغب في زيارة <span className="themed-text-secondary font-bold">{selectedSource.name}</span>؟
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleVisit}
              className="px-4 py-2 bg-[#6c42ea] text-white rounded-lg hover:opacity-90 transition"
            >
              نعم، أريد ذلك
            </button>
            <button
              onClick={() => setSelectedSource(null)}
              className="px-4 py-2 themed-bg-subtle themed-text rounded-lg hover:opacity-85 transition"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
      
      <div className="grid gap-4">
        {sources.map((source, index) => (
          <button
            key={index}
            onClick={() => handleClick(source)}
            className="flex items-center gap-3 p-4 themed-border border rounded-xl themed-bg-card shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="w-8 h-8 flex items-center justify-center themed-bg-subtle rounded-full">
              {source.icon}
            </div>
            <span className="text-lg font-medium themed-text">{source.name}</span>
          </button>
        ))}
      </div>

      <ScrollToTopButton />
    </div>
  );
}
