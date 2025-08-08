// src/pages/Progress.jsx
import { useEffect, useState } from 'react';
import { ListPlus } from 'lucide-react';

export default function Progress() {
  const [progress, setProgress] = useState(null);
  const totalSecs = parseInt(localStorage.getItem('cumulativeTime') || '0');
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userProgress"));
    if (data) setProgress(data);
  }, []);

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#5a8c76] font-medium text-lg">
        No progress data yet.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#f9fbfa] overflow-x-hidden" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <button onClick={() => window.history.back()} className="flex size-12 items-center text-[#101915]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
          </svg>
        </button>
        <h2 className="text-lg font-bold text-[#101915] text-center flex-1 pr-12">Progress</h2>
      </div>

      {/* Hero Image */}
      <div className="@container @[480px]:px-4 @[480px]:py-3">
        <div className="w-full min-h-[218px] bg-cover bg-center rounded-xl"
          style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCItO3UUovla6vy-xB0mK78kZ7K-x9rw4YZ-fw2ST_XILDR8QXfVLxwITAjkFdoJoHFwqVmFmQywcN5fkBEg-CkYHxb8SMDEgkb3VQBXk45JhKndKknaS5DqcLrFxVAYSHVe2EyE1lecN-BcrnG9SkvWIjYpPt7PU8jSpARN8-SSYeEsMQH_3Q4ubvdYyays0dwQKqkBp0hHYuKm3YCrlvYgpIdSpKmXiQyUAN3Px7-WIbE7tzlHATospzJEU7DZOe4RbPc427QXpYb")` }}
        ></div>
      </div>

      {/* Stats */}
      <h2 className="text-[22px] font-bold text-[#101915] px-4 pt-5 pb-3">Your Journey</h2>
      <div className="flex flex-wrap gap-4 px-4">
        <StatCard title="Total Time" value={`${hours}h ${minutes}m`} />
        <StatCard title="Modules" value={progress.modulesCompleted} />
        <StatCard title="Diary Entries" value={progress.entries} />
        <StatCard title="Feelings Logged" value={progress.feelingsLogged} />
      </div>

      {/* Timeline */}
      <h2 className="text-[22px] font-bold text-[#101915] px-4 pt-5 pb-3">Timeline</h2>
      <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4 pb-10">
        {progress.timeline.map((item, i) => (
          <div className="contents" key={i}>
            <div className="flex flex-col items-center pt-3">
              <ListPlus/>
              <div className="w-[1.5px] h-full bg-[#d3e3dc] grow"></div>
            </div>
            <div className="flex flex-col py-3">
              <p className="text-base font-medium">{item.label}</p>
              <p className="text-sm text-[#5a8c76]">{new Date(item.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const StatCard = ({ title, value }) => (
  <div className="flex-1 min-w-[158px] rounded-xl border border-[#d3e3dc] p-6">
    <p className="text-base font-medium text-[#101915]">{title}</p>
    <p className="text-2xl font-bold text-[#101915]">{value}</p>
  </div>
);
