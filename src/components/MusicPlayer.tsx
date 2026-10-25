'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Repeat, SkipForward } from 'lucide-react';
import { MusicTrack } from '@/types';
import { extractYouTubeId } from '@/lib/utils';

interface MusicPlayerProps {
  tracks: MusicTrack[];
}

interface YTPlayerTarget {
  setVolume: (v: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (s: number) => void;
}

interface YTPlayerEvent {
  target: YTPlayerTarget;
  data: number;
}

interface YTPlayerInstance {
  loadVideoById?: (id: string) => void;
  playVideo?: () => void;
  pauseVideo?: () => void;
  setVolume?: (v: number) => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          height: string;
          width: string;
          videoId: string;
          playerVars: Record<string, unknown>;
          events: {
            onReady?: (event: YTPlayerEvent) => void;
            onStateChange?: (event: YTPlayerEvent) => void;
          };
        }
      ) => YTPlayerInstance;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isLooping, setIsLooping] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [ytReady, setYtReady] = useState(
    () => typeof window !== 'undefined' && Boolean(window.YT && window.YT.Player)
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);

  const activeTracks = tracks && tracks.length > 0 ? tracks : [
    {
      id: 'default-1',
      title: 'Cozy Apple Orchard Lofi',
      artist: 'Cottage Breeze',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      is_active: true,
    },
  ];

  const nextTrack = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeTracks.length);
  }, [activeTracks.length]);

  const currentTrack = activeTracks[currentIndex] || activeTracks[0];
  const ytId = extractYouTubeId(currentTrack?.url || '');

  // 1. Load YouTube IFrame API Script if needed
  useEffect(() => {
    if (!ytId) return;

    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setYtReady(true);
      };
    }
  }, [ytId]);

  // 2. Initialize or Update YouTube Player
  useEffect(() => {
    if (!ytId || !ytReady || !window.YT) return;

    try {
      if (!ytPlayerRef.current) {
        ytPlayerRef.current = new window.YT.Player('yt-bg-player', {
          height: '200',
          width: '200',
          videoId: ytId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
            loop: isLooping ? 1 : 0,
            playlist: ytId,
          },
          events: {
            onReady: (event: YTPlayerEvent) => {
              event.target.setVolume(volume * 100);
              if (isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: YTPlayerEvent) => {
              if (event.data === 0) { // Ended
                if (isLooping) {
                  event.target.seekTo(0);
                  event.target.playVideo();
                } else {
                  nextTrack();
                }
              }
            },
          },
        });
      } else if (ytPlayerRef.current.loadVideoById) {
        ytPlayerRef.current.loadVideoById(ytId);
        if (isPlaying && ytPlayerRef.current.playVideo) {
          ytPlayerRef.current.playVideo();
        } else if (!isPlaying && ytPlayerRef.current.pauseVideo) {
          ytPlayerRef.current.pauseVideo();
        }
      }
    } catch (e) {
      console.warn('YouTube player setup error:', e);
    }
  }, [ytId, ytReady, isPlaying, isLooping, volume, nextTrack]);

  // 3. HTML5 Audio (For MP3 / Direct Audio Files)
  useEffect(() => {
    if (ytId) {
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.volume = volume;
    audio.loop = isLooping;

    if (currentTrack?.url) {
      audio.src = currentTrack.url;
      if (isPlaying) {
        audio.play().catch(() => {});
      }
    }

    const handleEnded = () => {
      if (!isLooping) nextTrack();
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, currentTrack?.url, ytId, isPlaying, isLooping, volume, nextTrack]);

  // 4. Volume Update
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      try {
        ytPlayerRef.current.setVolume(volume * 100);
      } catch {
        // ignore
      }
    }
  }, [volume]);

  // 5. Toggle Play / Pause
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch {
          // ignore
        }
      }
    } else {
      setIsPlaying(true);
      if (ytId) {
        if (audioRef.current) audioRef.current.pause();
        if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
          try {
            ytPlayerRef.current.playVideo();
          } catch {
            // ignore
          }
        }
      } else {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    }
  };

  return (
    <>
      {/* YouTube Audio IFrame Container (Proper dimensions to ensure YouTube API plays smoothly) */}
      <div className="fixed -bottom-[9999px] -right-[9999px] w-[200px] h-[200px] pointer-events-none opacity-0 overflow-hidden">
        <div id="yt-bg-player" />
      </div>

      <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
        {/* Expanded Controls Popup */}
        {showControls && (
          <div className="bg-[#FFFEFA]/98 backdrop-blur-md border-2 border-[#F6B8C6]/70 rounded-2xl p-3.5 shadow-xl flex flex-col gap-2.5 text-xs text-[#543E30] animate-in fade-in zoom-in-95 duration-150 min-w-[230px]">
            <div className="flex items-center justify-between border-b border-[#FCE4EC] pb-2">
              <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                {ytId && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-[#ff4d4f] text-white font-bold">
                    YT
                  </span>
                )}
                <span className="font-semibold truncate text-[#543E30]">
                  {currentTrack.title}
                </span>
              </div>
              <span className="text-[10px] text-[#947765]">
                {currentIndex + 1}/{activeTracks.length}
              </span>
            </div>

            {/* Playback Controls Row */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="cta-btn py-1 px-3 text-[11px] font-semibold text-[#543E30] cursor-pointer"
              >
                {isPlaying ? 'พักเพลง' : 'เล่นเพลง'}
              </button>

              <button
                type="button"
                onClick={nextTrack}
                title="เพลงถัดไป"
                className="p-1.5 rounded-lg bg-[#F4F8F0] hover:bg-[#E8F0E2] text-[#7D946D] border border-[#C9DDB8]/60 transition cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                title={isLooping ? 'วนซ้ำเพลงเดิม' : 'เล่นตามลำดับ'}
                className={`p-1.5 rounded-lg transition cursor-pointer border ${
                  isLooping
                    ? 'bg-[#F6B8C6] border-[#F6B8C6] text-[#543E30] font-bold shadow-xs'
                    : 'bg-[#F4F8F0] border-[#C9DDB8]/60 text-[#7D946D] hover:bg-[#E8F0E2]'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Volume Slider Row */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
                className="text-[#7D946D] hover:text-[#543E30] transition cursor-pointer"
              >
                {volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-[#947765]" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#7D946D]" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-[#F6B8C6] cursor-pointer h-1.5 bg-[#FCE4EC] rounded-lg"
              />
              <span className="text-[10px] text-[#947765] w-6 text-right font-medium">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Floating Toggle Button (Always visible) */}
        <button
          type="button"
          onClick={() => {
            if (!isPlaying && !showControls) {
              togglePlay();
            }
            setShowControls(!showControls);
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300 cursor-pointer ${
            isPlaying
              ? 'bg-[#FFFEFA] border-[#F6B8C6] text-[#D06D80] ring-2 ring-[#F6B8C6]/50 shadow-[#F6B8C6]/20'
              : 'bg-[#FFFEFA] border-[#C9DDB8] text-[#947765] hover:border-[#F6B8C6] hover:text-[#543E30]'
          }`}
          title="เสียงเพลงในสวนแอปเปิ้ล"
        >
          {isPlaying ? (
            <span className="text-base select-none animate-bounce">🍎</span>
          ) : (
            <VolumeX className="w-4 h-4 text-[#947765]" />
          )}
        </button>
      </div>
    </>
  );
}
