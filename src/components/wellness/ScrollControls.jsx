// src/components/wellness/ScrollControls.jsx
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function useScrollState() {
 const [canScrollUp, setCanScrollUp] = useState(false);
 const [canScrollDown, setCanScrollDown] = useState(false);

 useEffect(() => {
 const handleScroll = () => {
 const scrollTop = window.scrollY || document.documentElement.scrollTop;
 const scrollHeight = document.documentElement.scrollHeight;
 const clientHeight = document.documentElement.clientHeight;

 setCanScrollUp(scrollTop > 150);
 setCanScrollDown(scrollTop + clientHeight < scrollHeight - 150);
 };

 handleScroll();
 window.addEventListener('scroll', handleScroll, { passive: true });
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 return { canScrollUp, canScrollDown };
}

export function scrollToTop() {
 window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function scrollToBottom() {
 window.scrollTo({ 
 top: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), 
 behavior: 'smooth' 
 });
}

export default function ScrollButtons() {
 const { canScrollUp, canScrollDown } = useScrollState();

 if (!canScrollUp && !canScrollDown) return null;

 return (
 <div className="flex flex-col gap-1.5">
 {canScrollUp && (
 <button
 onClick={scrollToTop}
 className="size-9 rounded-2xl bg-bg-surface text-text-secondary border border-border-medium shadow-md hover:bg-bg-surface-hover active:scale-95 transition-all flex items-center justify-center shrink-0"
 aria-label="Scroll to top"
 title="للأعلى"
 >
 <ArrowUp size={16} className="shrink-0" />
 </button>
 )}

 {canScrollDown && (
 <button
 onClick={scrollToBottom}
 className="size-9 rounded-2xl bg-bg-surface text-text-secondary border border-border-medium shadow-md hover:bg-bg-surface-hover active:scale-95 transition-all flex items-center justify-center shrink-0"
 aria-label="Scroll to bottom"
 title="للأسفل"
 >
 <ArrowDown size={16} className="shrink-0" />
 </button>
 )}
 </div>
 );
}
