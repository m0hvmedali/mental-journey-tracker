// src/components/wellness/FloatingMusicPlayer.jsx
import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  X, 
  Music as MusicIcon,
  ListMusic,
  ChevronDown,
  RotateCw,
  FolderCheck
} from 'lucide-react';
import { useMusic } from '../../contexts/MusicContext';

export default function FloatingMusicPlayer({ onClose }) {
  const { 
    isPlaying, 
    currentTrack, 
    currentTrackData, 
    playlist, 
    folderTracksCount,
    volume, 
    currentTime, 
    duration, 
    toggleMusic, 
    nextTrack, 
    prevTrack, 
    selectTrack, 
    seekTo, 
    setVolume,
    refreshFolderTracks
  } = useMusic();

  const [showList, setShowList] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Format seconds into mm:ss
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshFolderTracks();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div 
      dir="rtl"
      className="w-[320px] sm:w-[360px] bg-slate-900/95 text-slate-100 rounded-3xl border border-emerald-500/30 shadow-md backdrop-blur-xl p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <MusicIcon size={16} className={`shrink-0 ${isPlaying ? 'animate-pulse text-emerald-300' : ''}`} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">مشغل الموسيقى</h4>
            <p className="text-xs font-bold text-emerald-200">موسيقى الخلفية الهادئة</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="size-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all shrink-0"
          aria-label="إغلاق المشغل"
        >
          <X size={16} className="shrink-0" />
        </button>
      </div>

      {/* Track Info Card */}
      <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <span className={`size-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{isPlaying ? 'يتم التشغيل الآن' : 'متوقف مؤقتاً'}</span>
          </span>

          <button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-300 transition-colors"
          >
            <ListMusic size={14} className="shrink-0" />
            <span>القائمة ({playlist.length})</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${showList ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white tracking-wide truncate">
            {currentTrackData?.title || (playlist.length === 0 ? 'لا توجد مقاطع صوتية مضافة' : 'مقطع صوتي')}
          </h3>
        </div>

        {/* Seek Bar */}
        <div className="space-y-1 pt-1">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime || 0}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Playlist Status & Refresh Toolbar */}
      <div className="flex items-center justify-between gap-2 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
          <FolderCheck size={14} className="text-emerald-400 shrink-0" />
          <span className="truncate max-w-[200px]">
            {playlist.length > 0 ? `المقاطع المتاحة (${playlist.length})` : 'لا توجد مقاطع صوتية'}
          </span>
        </div>

        <button
          onClick={handleRefresh}
          className={`p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all ${
            isRefreshing ? 'animate-spin text-emerald-400' : ''
          }`}
          title="تحديث القائمة"
        >
          <RotateCw size={14} className="shrink-0" />
        </button>
      </div>

      {/* Playlist Drawer (Collapsible) */}
      {showList && (
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 bg-slate-950/60 rounded-2xl p-2 border border-slate-800/80 text-xs">
          {playlist.length === 0 ? (
            <p className="text-slate-400 text-center py-3 text-xs">لا توجد ملفات صوتية حالياً</p>
          ) : (
            playlist.map((track, idx) => (
              <button
                key={track.id || idx}
                onClick={() => selectTrack(idx)}
                className={`w-full text-right p-2 rounded-xl transition-all flex items-center justify-between ${
                  currentTrack === idx 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' 
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] opacity-60">{idx + 1}.</span>
                  <span className="truncate">{track.title}</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Controls & Volume */}
      <div className="space-y-3">
        {/* Main Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevTrack}
            className="size-10 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center active:scale-95 transition-all shrink-0"
            aria-label="المقطع السابق"
          >
            <SkipForward size={18} className="shrink-0" />
          </button>

          <button
            onClick={toggleMusic}
            className="size-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
            aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
          >
            {isPlaying ? <Pause size={22} className="shrink-0" /> : <Play size={22} className="shrink-0 ml-0.5" />}
          </button>

          <button
            onClick={nextTrack}
            className="size-10 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center active:scale-95 transition-all shrink-0"
            aria-label="المقطع التالي"
          >
            <SkipBack size={18} className="shrink-0" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2.5 px-2 pt-1">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.4)}
            className="text-slate-400 hover:text-emerald-300 transition-colors shrink-0"
            aria-label="كتم/تشغيل الصوت"
          >
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <span className="text-[10px] font-mono text-slate-500 shrink-0 min-w-[28px] text-left">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
