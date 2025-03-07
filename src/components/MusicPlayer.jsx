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
  X,
  ArrowLeft,
} from "lucide-react";

const MusicPlayer = ({ songData, onPrev, onNext }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

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
    <>
      {isExpanded ? (
        <div className="fixed inset-0 bg-gradient-to-b from-[#103333] to-[#061a1a] flex backdrop-blur-xl flex-col justify-center items-center p-6 z-50">

          <button
            className="absolute top-6 left-6 text-white hover:text-gray-300 transition-transform transform hover:scale-110"
            onClick={() => setIsExpanded(false)}
          >
            <ArrowLeft size={32} />
          </button>

          <Image
            src={songData?.thumbnailUrl || defaultThumbnail}
            width={300}
            height={300}
            alt="thumbnail"
            className="rounded-xl object-cover w-64 h-64 mb-5 shadow-lg"
            unoptimized
          />
          <h1 className="text-white text-2xl font-bold text-center">
            {songData?.title || "No Song Playing"}
          </h1>
          <h2 className="text-gray-400 text-md text-center">
            {songData?.artist || "Unknown Artist"}
          </h2>

          <div className="flex items-center gap-x-8 mt-6">
            <SkipBack
              size={40}
              className="text-gray-400 cursor-pointer hover:text-white transition-transform transform hover:scale-110"
              onClick={handlePrev}
            />
            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full w-20 h-20 flex items-center justify-center shadow-md hover:shadow-xl transition-transform transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause size={42} /> : <Play size={42} />}
            </button>
            <SkipForward
              size={40}
              className="text-gray-400 cursor-pointer hover:text-white transition-transform transform hover:scale-110"
              onClick={handleNext}
            />
          </div>

          <div className="w-full max-w-lg mt-6 px-4">
            <input
              type="range"
              value={progress || 0}
              onChange={handleSeek}
              className="w-full h-2 rounded-full bg-gray-700  cursor-pointer accent-white"
            />
            <div className="flex justify-between text-gray-400 text-xs mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="fixed border-t bottom-0 bg-gray-900 w-full backdrop-blur-lg py-3 px-7 flex items-center justify-around z-20 cursor-pointer"
          onClick={(e) => setIsExpanded(true)}
        >
          <div className="flex items-center gap-x-3">
            <Image
              src={songData?.thumbnailUrl || defaultThumbnail}
              width={40}
              height={40}
              alt="thumbnail"
              className="rounded-full object-cover w-10 h-10"
              unoptimized
            />
            <div className="flex flex-col overflow-hidden">
              <h1 className="font-semibold text-sm truncate text-gray-300">
                {songData?.title || "No Song Playing"}
              </h1>
              <h2 className="text-xs text-gray-400 truncate">
                {songData?.artist || "Unknown Artist"}
              </h2>
            </div>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex gap-2 items-center"
          >
            <SkipBack
              size={40}
              className="text-gray-300 cursor-pointer hover:text-white"
              onClick={handlePrev}
            />
            <button
              onClick={togglePlay}
              className="bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-600"
            >
              {isPlaying ? <Pause size={30} /> : <Play size={30} />}
            </button>
            <SkipForward
              size={40}
              className="text-gray-300 cursor-pointer hover:text-white"
              onClick={handleNext}
            />
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className=" -top-4 md:w-lg w-full md:mt-6 absolute md:static"
          >
            <input
              type="range"
              value={progress || 0}
              onChange={handleSeek}
              className="w-full "
            />
            <div className="md:flex hidden justify-between text-gray-400 text-xs">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={handleProgress}
        onLoadedMetadata={handleMetadata}
      />
    </>
  );
};

export default MusicPlayer;
