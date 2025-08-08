// components/Footer.jsx
import React from "react";
import { Lock, BookOpen, Globe } from "lucide-react";

const Footer = ({ sources = [] }) => {
  return (
    <div className="p-4 bg-white border-t border-[#e3e8e6]">
   {/* المصادر */}
        <div>

        <div className="flex items-center mb-2">

        <BookOpen size={18} className="text-[#4e9778] mr-2" />
          <h3 className="font-bold text-[#0e1b15]">المصادر العلمية:</h3>   
          </div>
        
               {sources.length > 0 ? (
  <ul className="text-xs text-[#374151] space-y-1 list-disc list-inside mb-4 mt-2">            
    {sources.map((src, idx) => (
                <div key={idx}>
                     
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                   className="text-[#9a2a6b] hover:underline hover:text-[#4e9778] ml-4 mb-3  "
                  >
                    <span className="flex items-center">
                      {src.label}
                      <span className="mr-2 ml-1">{src.icon}</span>
                    </span>
                   
                  </a>
                   
                </div>
              ))}
            </ul>
          ) : (
            <p>لا توجد مصادر معروضة لهذه الصفحة.</p>
          )}
        </div>

        <div className="flex items-center mb-2">
          <Lock size={18} className="text-[#4e9778] mr-2" />
          <h3 className="font-bold text-[#0e1b15]">حقوق الملكية والخصوصية:</h3>
        </div>
        <p className="text-xs text-[#374151]">
          جميع المحتويات مبنية على أدلة علمية ولأغراض تعليمية فقط. لا يُسمح بإعادة النشر دون إذن. 
          البيانات الشخصية للمستخدمين محمية وفق قوانين الخصوصية الدولية. 
          © 2025 مركز الصحة النفسية. جميع الحقوق محفوظة.
        </p>
     
        </div>

  );
};

export default Footer;
