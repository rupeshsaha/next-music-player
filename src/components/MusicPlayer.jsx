"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import defaultThumbnail from "../../public/thumbnail.jpg";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

const MusicPlayer = ({ songData, onPrev, onNext }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current && songData?.audioUrl) {
      audioRef.current.src = songData.audioUrl;
      audioRef.current.load();
      audioRef.current
        .play()
        .catch((err) => console.log("Autoplay blocked:", err));
      setIsPlaying(true);
    }
  }, [songData?.audioUrl, onPrev, onNext]);


  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else
      audioRef.current.play().catch((err) => console.log("Play blocked:", err));
    setIsPlaying(!isPlaying);
  };

  const handleProgress = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setProgress(
      (audioRef.current.currentTime / audioRef.current.duration) * 100
    );
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(Number(e.target.value));
  };

  const handleVolume = (e) => {
    if (!audioRef.current) return;
    const newVolume = Number(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
      audioRef.current.volume = 0;
    } else {
      setVolume(prevVolume);
      audioRef.current.volume = prevVolume;
    }
  };

  const handleMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

const handleNext = () => {
  onNext();
  setTimeout(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Autoplay blocked:", err));
    }
  }, 300);
};

const handlePrev = () => {
  onPrev();
  setTimeout(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Autoplay blocked:", err));
    }
  }, 300);
};


    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.addEventListener("ended", handleNext);
        return () => audio.removeEventListener("ended", handleNext);
      }
    }, [handleNext]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="fixed border-t bottom-0 w-full bg-[#181b21d0] backdrop-blur-lg py-5 px-7 flex items-center justify-between lg:gap-20 md:gap-12 z-20 ">
      <div className="flex items-center gap-x-3 md:min-w-[200px]">
        <Image
          src={songData?.thumbnailUrl || defaultThumbnail}
          width={50}
          height={50}
          alt="thumbnail"
          className="rounded-full object-cover w-12 h-12"
          unoptimized
        />
        <div className="flex flex-col md:w-40  overflow-hidden">
          <h1 className="font-semibold text-white text-sm truncate">
            {songData?.title || "No Song Playing"}
          </h1>
          <h2 className="text-xs text-gray-400 truncate">
            {songData?.artist || "Unknown Artist"}
          </h2>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleProgress}
        onLoadedMetadata={handleMetadata}
      />

      <div className="flex items-center gap-x-4 mx-4">
        <SkipBack
          size={28}
          className="text-gray-300 cursor-pointer hover:text-white"
          onClick={handlePrev}
        />
        <button
          onClick={togglePlay}
          className="bg-[#57595D] text-white rounded-full w-12 h-12 p-3 cursor-pointer hover:bg-gray-500 flex justify-center items-center"
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <SkipForward
          size={28}
          className="text-gray-300 cursor-pointer hover:text-white"
          onClick={handleNext}
        />
      </div>

      {/* Progress Bar */}
      <div className="flex-1 mx-4 flex-col flex sm:static absolute -top-2 -left-4 w-full  items-center sm:mt-2">
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="w-full "
        />
        <div className="flex justify-between w-full">
          <span className="text-gray-400 text-xs">
            {formatTime(currentTime)}
          </span>
          <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-x-2">
        {volume === 0 ? (
          <VolumeX
            onClick={toggleMute}
            className="text-gray-300 cursor-pointer hover:text-white"
          />
        ) : (
          <Volume2
            onClick={toggleMute}
            className="text-gray-300 cursor-pointer hover:text-white md:block hidden"
          />
        )}
        <input
          type="range"
          name="volume"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          className="w-24 md:block hidden"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
