import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const MusicContext = createContext();

const playlist = [
  { title: "1", src: "/WiinVuzh4DA.mp3" },
  { title: "2", src: "/l08Zw-RY__Q.mp3" },
  { title: "3", src: "/TM6ksLVReM8.mp3" },
  { title: "أغنية أخرى", src: "/UfcAVejslrU.mp3" },
];

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('backgroundMusic') === 'true';
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(() =>
    Math.floor(Math.random() * playlist.length)
  );
  const audioRef = useRef(null);

  // قائمة الأغاني
 

  useEffect(() => {
    localStorage.setItem('backgroundMusic', isEnabled.toString());

    if (isEnabled && playlist.length > 0) {
      audioRef.current?.load();
      audioRef.current?.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    } else {
      pauseMusic();
    }
  }, [isEnabled]);

  useEffect(() => {
    if (isEnabled && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  }, [currentTrack]);

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    if (playlist.length > 1) {
      let next;
      do {
        next = Math.floor(Math.random() * playlist.length);
      } while (next === currentTrack);
      setCurrentTrack(next);
    }
  };

  const prevTrack = () => {
    if (playlist.length > 1) {
      let prev;
      do {
        prev = Math.floor(Math.random() * playlist.length);
      } while (prev === currentTrack);
      setCurrentTrack(prev);
    }
  };

  const toggleMusic = () => {
    setIsEnabled(prev => {
      const newVal = !prev;
      localStorage.setItem('backgroundMusic', newVal.toString());

      if (newVal && audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      } else {
        pauseMusic();
      }

      return newVal;
    });
  };

  const value = {
    isEnabled,
    isPlaying,
    currentTrack,
    playlist,
    toggleMusic,
    playMusic,
    pauseMusic,
    nextTrack,
    prevTrack,
    setCurrentTrack,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      {playlist.length > 0 && (
        <audio
          ref={audioRef}
          src={playlist[currentTrack]?.src}
          loop={playlist.length === 1}
          onEnded={nextTrack}
          preload="auto"
          volume={0.3}
        />
      )}
    </MusicContext.Provider>
  );
};
