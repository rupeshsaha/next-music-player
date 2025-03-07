"use client";
import { Music, Search, Upload } from "lucide-react";
import React, { useState } from "react";
import SongUploadModal from "./SongUploadModal";

const Navbar = ({ onSubmit }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSubmit = () => {
    setIsPopupOpen(false);
    onSubmit(); 
  };

  return (
    <div className="w-full flex items-center justify-between mt-3">
      <div className="md:flex hidden items-center space-x-1 bg-[#181B21] rounded-full w-[50%] px-4 py-2">
        <input
          type="text"
          placeholder="Search for a song"
          className="bg-transparent outline-none text-white w-full py-2"
        />
        <Search className="cursor-pointer" />
      </div>
      <h1 className="md:hidden font-semibold text-[#E8711E] md:text-xl justify-center flex gap-2">
        <Music color="#E8711E" />
        Music Player
      </h1>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="flex gap-2 mr-2 bg-[#a3ede677] px-3 py-2 rounded-full cursor-pointer hover:scale-105"
      >
        <Upload /> Upload Music
      </button>
      {isPopupOpen && (
        <SongUploadModal
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSubmit={()=>handleSubmit()} 
        />
      )}
    </div>
  );
};

export default Navbar;
