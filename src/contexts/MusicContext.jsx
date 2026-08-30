import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const MusicContext = createContext();

/**
 * Dynamically scans the /public/music/ directory for any audio files.
 * Uses Vite's import.meta.glob to automatically detect added, edited, or deleted files.
 */
function scanFolderTracks() {
  try {
    const modules = import.meta.glob([
      '/public/music/*.{mp3,wav,m4a,ogg,aac,flac,webm}',
      '/src/assets/music/*.{mp3,wav,m4a,ogg,aac,flac,webm}'
    ], { eager: true });

    const folderTracks = [];
    let counter = 1;

    for (const path in modules) {
      const mod = modules[path];
      const rawSrc = typeof mod === 'string' ? mod : (mod?.default || path);
      // Clean path for web serving: /public/music/xyz.mp3 -> /music/xyz.mp3
      const src = rawSrc.startsWith('/public') ? rawSrc.replace('/public', '') : rawSrc;

      const filename = path.split('/').pop() || '';
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
      const formattedTitle = nameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (formattedTitle) {
        folderTracks.push({
          id: `folder_${counter++}_${nameWithoutExt}`,
          title: formattedTitle,
          src: src,
          filename: filename,
          isFromFolder: true
        });
      }
    }

    return folderTracks;
  } catch (err) {
    console.warn('Error scanning music directory:', err);
    return [];
  }
}

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [folderTracks, setFolderTracks] = useState(() => scanFolderTracks());
  const [userUploadedTracks, setUserUploadedTracks] = useState([]);
  
  // Only scanned folder tracks + user uploaded tracks (no mock demo fallbacks)
  const [playlist, setPlaylist] = useState(() => scanFolderTracks());

  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);

  const [volume, setVolumeState] = useState(() => {
    const savedVol = localStorage.getItem('music_volume');
    return savedVol !== null ? parseFloat(savedVol) : 0.4;
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const hasAutoplayAttempted = useRef(false);

  // Sync playlist when folder or user tracks change
  useEffect(() => {
    const scanned = scanFolderTracks();
    setFolderTracks(scanned);
    const combined = [...scanned, ...userUploadedTracks];
    setPlaylist(combined);
  }, [userUploadedTracks]);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    localStorage.setItem('music_volume', volume.toString());
  }, [volume]);

  // Autoplay on site entry (with browser autoplay policy fallback)
  useEffect(() => {
    if (playlist.length > 0 && !hasAutoplayAttempted.current) {
      hasAutoplayAttempted.current = true;

      const triggerAutoplay = () => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
              setIsEnabled(true);
            })
            .catch(() => {
              // If browser blocks autoplay before user gesture, play immediately on first interaction anywhere
              const startOnInteraction = () => {
                if (audioRef.current) {
                  audioRef.current.play()
                    .then(() => {
                      setIsPlaying(true);
                      setIsEnabled(true);
                    })
                    .catch(e => console.warn('Play after interaction error:', e));
                }
                window.removeEventListener('click', startOnInteraction, true);
                window.removeEventListener('touchstart', startOnInteraction, true);
                window.removeEventListener('keydown', startOnInteraction, true);
              };

              window.addEventListener('click', startOnInteraction, { capture: true, once: true });
              window.addEventListener('touchstart', startOnInteraction, { capture: true, once: true });
              window.addEventListener('keydown', startOnInteraction, { capture: true, once: true });
            });
        }
      };

      const timer = setTimeout(triggerAutoplay, 300);
      return () => clearTimeout(timer);
    }
  }, [playlist]);

  // Refresh/re-scan folder files manually if needed
  const refreshFolderTracks = () => {
    const scanned = scanFolderTracks();
    setFolderTracks(scanned);
    const combined = [...scanned, ...userUploadedTracks];
    setPlaylist(combined);
  };

  // Add custom track directly from user file picker
  const addUserTrack = (file) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    const cleanTitle = nameWithoutExt.replace(/[-_]/g, ' ').trim();

    const newTrack = {
      id: `user_upload_${Date.now()}`,
      title: cleanTitle || file.name,
      src: objectUrl,
      filename: file.name,
      isUserUploaded: true
    };

    setUserUploadedTracks(prev => [newTrack, ...prev]);
    // Automatically switch to the newly uploaded track
    setTimeout(() => {
      setCurrentTrack(0);
      playMusic();
    }, 150);
  };

  // Play / Pause handlers
  const playMusic = () => {
    if (audioRef.current && playlist.length > 0) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsEnabled(true);
        })
        .catch(err => {
          console.warn('Playback prevented by browser policy:', err);
          setIsPlaying(false);
        });
    }
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsEnabled(false);
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  const selectTrack = (index) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentTrack(index);
      setTimeout(() => {
        playMusic();
      }, 100);
    }
  };

  const nextTrack = () => {
    if (playlist.length === 0) return;
    const nextIdx = (currentTrack + 1) % playlist.length;
    selectTrack(nextIdx);
  };

  const prevTrack = () => {
    if (playlist.length === 0) return;
    const prevIdx = (currentTrack - 1 + playlist.length) % playlist.length;
    selectTrack(prevIdx);
  };

  const seekTo = (seconds) => {
    if (audioRef.current && Number.isFinite(seconds)) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setVolume = (newVol) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
  };

  // Audio event listeners
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const value = {
    isPlaying,
    isEnabled: isPlaying || isEnabled,
    currentTrack,
    currentTrackData: playlist[currentTrack] || null,
    playlist,
    folderTracksCount: folderTracks.length,
    volume,
    currentTime,
    duration,
    toggleMusic,
    playMusic,
    pauseMusic,
    nextTrack,
    prevTrack,
    selectTrack,
    setCurrentTrack,
    seekTo,
    setVolume,
    refreshFolderTracks,
    addUserTrack,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      {playlist.length > 0 && playlist[currentTrack] && (
        <audio
          ref={audioRef}
          src={playlist[currentTrack]?.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={nextTrack}
          preload="auto"
        />
      )}
    </MusicContext.Provider>
  );
};
