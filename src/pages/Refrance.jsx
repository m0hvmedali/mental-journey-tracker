import React, { useState } from "react";
import { ExternalLink, Globe, ArrowLeft, BookOpen, Video, FileText, Building, Users, GraduationCap, Headphones, Smartphone, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const sources = [
    {
    name: "منظمة الصحة العالمية",
    link: "https://www.who.int",
    icon: <Globe className="w-5 h-5 text-[#0e1b15]" />,
  },
  {
    name: "American Psychological Association",
    link: "https://www.apa.org",
    icon: <Globe className="w-5 h-5 text-[#0e1b15]" />,
  },
  {
    name: "Verywell Mind",
    link: "https://www.verywellmind.com",
    icon: <Globe className="w-5 h-5 text-[#0e1b15]" />,
  },
  {
    name: "PubMed",
    link: "https://pubmed.ncbi.nlm.nih.gov",
    icon: <Globe className="w-5 h-5 text-[#0e1b15]" />,
  },
  { 
    name: "دليل تدريب مهارات العلاج الجدلي السلوكي (عربي)", 
    link: "https://dbt-mena.com/ar/", 
    icon: <BookOpen size={14} /> 
  },
  { 
    name: "العلاج المعرفي السلوكي لاضطراب الشخصية الحدية", 
    link: "https://dbt-mena.com/ar/", 
    icon: <BookOpen size={14} /> 
  },
  { 
    name: "Building a Life Worth Living - Marsha Linehan", 
    link: "https://www.guilford.com/books/Building-a-Life-Worth-Living/Marsha-Linehan/9780812994612", 
    icon: <BookOpen size={14} /> 
  },
  
  // فيديوهات
  { 
    name: "قناة DBT-RU (Rutgers University)", 
    link: "https://www.youtube.com/@DBTSkillsTraining", 
    icon: <Video size={14} /> 
  },
  { 
    name: "فيديوهات مهارات DBT (Ontario Shores)", 
    link: "https://www.ontarioshores.ca/dbt-videos-module", 
    icon: <Video size={14} /> 
  },
  
  // مواقع تعليمية
  { 
    name: "DBT Self Help (المرجع الرئيسي)", 
    link: "https://dialecticalbehaviortherapy.com", 
    icon: <Globe size={14} /> 
  },
  { 
    name: "APA - American Psychological Association", 
    link: "https://www.apa.org", 
    icon: <Globe size={14} /> 
  },
  { 
    name: "Therapist Aid (أوراق عمل)", 
    link: "https://www.therapistaid.com", 
    icon: <FileText size={14} /> 
  },
  
  // منظمات وشركات
  { 
    name: "DBT MENA (الشرق الأوسط)", 
    link: "https://dbt-mena.com/ar/", 
    icon: <Building size={14} /> 
  },
  { 
    name: "DBT Labs (تدريب مهني)", 
    link: "https://www.getdbt.com/dbt-learn", 
    icon: <GraduationCap size={14} /> 
  },
  { 
    name: "Treatment Implementation Collaborative", 
    link: "https://www.ticllc.org", 
    icon: <Users size={14} /> 
  },
  
  // مراجع إضافية
  { 
    name: "NHS - Cognitive Behavioral Therapy Guide", 
    link: "https://www.nhs.uk", 
    icon: <Globe size={14} /> 
  },
  { 
    name: "المعهد الوطني للصحة النفسية (NIMH)", 
    link: "https://www.nimh.nih.gov", 
    icon: <Building size={14} /> 
  },
  { 
    name: "الذكاء العاطفي - دانييل جولمان", 
    link: "https://www.goodreads.com/book/show/26329.Emotional_Intelligence", 
    icon: <BookOpen size={14} /> 
  },
  { 
    name: "فن إدارة المشاعر - د. إبراهيم الفقي", 
    link: "https://www.neelwafurat.com/itempage.aspx?id=lbb224327-301614&search=books", 
    icon: <BookOpen size={14} /> 
  },
  
  // فيديوهات تعليمية
  { 
    name: "قناة د. أحمد عمارة (إدارة المشاعر)", 
    link: "https://www.youtube.com/@ahmedammarapsychology", 
    icon: <Video size={14} /> 
  },
  { 
    name: "سلسلة فهم المشاعر - TED Talks", 
    link: "https://www.ted.com/topics/emotions", 
    icon: <Video size={14} /> 
  },
  
  // مواقع وتطبيقات
  { 
    name: "منصة recovery للصحة النفسية", 
    link: "https://hayatipsych.com", 
    icon: <Globe size={14} /> 
  },
  { 
    name: "تطبيق MoodKit (إدارة المشاعر)", 
    link: "https://moodkitapp.com", 
    icon: <Smartphone size={14} /> 
  },
  { 
    name: "دليل المشاعر من جمعية علم النفس الأمريكية", 
    link: "https://www.apa.org/topics/emotions", 
    icon: <Globe size={14} /> 
  },
  
  // تمارين عملية
  { 
    name: "أوراق عمل تنظيم المشاعر (Therapist Aid)", 
    link: "https://www.therapistaid.com/therapy-worksheets/emotions", 
    icon: <FileText size={14} /> 
  },
  { 
    name: "تمارين اليقظة لإدارة المشاعر", 
    link: "https://www.mindful.org/category/meditation/mindfulness-of-emotions/", 
    icon: <Brain size={14} /> 
  },
  
  // دعم مجتمعي
  { 
    name: "مجموعات الدعم العاطفي (7cups)", 
    link: "https://www.7cups.com", 
    icon: <Users size={14} /> 
  },
  { 
    name: "منصة شيزلونج  للاستشارات النفسية", 
    link: "https://www.shezlong.com", 
    icon: <Users size={14} /> 
  },
  
  // بودكاست
  { 
    name: "بودكاست عقول مع د. عبدالله السبيعي", 
    link: "https://soundcloud.com/aqwal", 
    icon: <Headphones size={14} /> 
  },
  { 
    name: "The Happiness Lab - د. لوري سانتوس", 
    link: "https://www.happinesslab.fm", 
    icon: <Headphones size={14} /> 
  },
  
  // مراجع علمية
  { 
    name: "مركز جامعة بيركلي لعلوم المشاعر", 
    link: "https://greatergood.berkeley.edu", 
    icon: <GraduationCap size={14} /> 
  },
  { 
    name: "دليل المشاعر الأساسية (باول إيكمان)", 
    link: "https://www.paulekman.com/universal-emotions/", 
    icon: <BookOpen size={14} /> 
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


    
    <div className="flex flex-col min-h-screen bg-[#f9fbfa] px-4 pb-10 font-sans">
         <header className="flex items-center pt-4 pb-2 justify-between">
        <button onClick={() => nav(-1)} className="flex size-10 items-center text-[#0e1b15]">
          <ArrowLeft size={24} />
        </button>
        <h2 className="flex-1 text-center pr-10 text-lg font-bold text-[#0e1b15]"> Refrance </h2>
      </header>

      {selectedSource && (
        <div className="mt-10 border border-blue-200 bg-blue-50 p-6 rounded-xl shadow-inner transition-all">
          <p className="text-lg font-semibold mb-4">
            هل ترغب في زيارة <span className="text-blue-700">{selectedSource.name}</span>؟
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleVisit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              نعم، أريد ذلك
            </button>
            <button
              onClick={() => setSelectedSource(null)}
              className="px-4 py-2 bg-gray-200 text-[#0e1b15] rounded-lg hover:bg-gray-300 transition"
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
            className="flex items-center gap-3 p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
              {source.icon}
            </div>
            <span className="text-lg font-medium">{source.name}</span>
          </button>
        ))}
      </div>

      {/* Dialog inside the page */}
      < ScrollToTopButton />
    </div>
  );
}
