"use client";
import {
  AudioWaveform,
  House,
  LayoutGrid,
  ListMusic,
  LogOut,
  Music,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen  flex-col justify-between items-center bg-[#181B21] flex  ">
      <div className="w-full">
        <h1 className="font-semibold text-[#E8711E] md:text-xl mt-5 justify-center flex gap-2">
          <Music color="#E8711E" />
          Music Player
        </h1>

        <div className="mt-16 flex flex-col gap-2 px-2">
          <Link
            href="#"
            className={`flex gap-2 px-6 py-3 rounded-2xl ${
              pathname === "/" ? "bg-[#303236]" : ""
            }`}
          >
            <House /> Home
          </Link>
          <Link
            href="#"
            className={`flex gap-2 px-6 py-3 rounded-2xl ${
              pathname === "/tracks" ? "bg-[#303236]" : ""
            }`}
          >
            <AudioWaveform /> Tracks
          </Link>
          <Link
            href="#"
            className={`flex gap-2 px-6 py-3 rounded-2xl ${
              pathname === "/genres" ? "bg-[#303236]" : ""
            }`}
          >
            <LayoutGrid /> Genres
          </Link>
          <Link
            href="#"
            className={`flex gap-2 px-6 py-3 rounded-2xl ${
              pathname === "/playlists" ? "bg-[#303236]" : ""
            }`}
          >
            <ListMusic /> Playlists
          </Link>
        </div>
      </div>

      {/* Logout Button at Bottom */}
      <div className="mb-4">
        <button className="flex gap-2 px-6 py-3 rounded-2xl text-red-500 hover:bg-[#303236]">
          <LogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
