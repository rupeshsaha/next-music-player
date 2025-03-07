"use client";
import MusicPlayer from "@/components/MusicPlayer";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SongCard from "@/components/SongCard";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";

const Page = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSongs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/track");
      if (!res.ok) throw new Error("Error while fetching songs");

      const data = await res.json();
      setSongs(data.tracks);
    } catch (error) {
      console.warn("Error fetching music:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handlePreviousTrack = useCallback(() => {
    setCurrentSong((prevSong) => {
      if (!prevSong) return songs[songs.length - 1];

      const currentIndex = songs.findIndex((s) => s._id === prevSong._id);
      return songs[(currentIndex - 1 + songs.length) % songs.length];
    });
  }, [songs]);

  const handleNextTrack = useCallback(() => {
    setCurrentSong((prevSong) => {
      if (!prevSong) return songs[0];

      const currentIndex = songs.findIndex((s) => s._id === prevSong._id);
      return songs[(currentIndex + 1) % songs.length];
    });
  }, [songs]);

  return (
    <div className="grid grid-cols-12">
      <div className="md:col-span-2 hidden md:block">
        <Sidebar />
      </div>
      <div className="md:col-span-10 col-span-12 p-2 px-5">
        <Navbar onSubmit={fetchSongs} />
        <div className="mt-4">
          <h2 className="font-bold text-lg font-sans">All Songs</h2>
          <div className="mt-2 flex flex-wrap gap-4 p-2">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              songs.map((song, idx) => (
                <SongCard
                  key={song._id}
                  data={song}
                  onSelect={() => setCurrentSong(song)}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {currentSong && (
        <MusicPlayer
          songData={currentSong}
          onPrev={handlePreviousTrack}
          onNext={handleNextTrack}
        />
      )}
    </div>
  );
};

export default Page;
