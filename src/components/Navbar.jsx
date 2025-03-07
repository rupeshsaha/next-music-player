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
    <div className="fixed top-0 left-0 w-full z-50 bg-[#23262d] p-3 shadow-md">
      <div className="w-full flex items-center justify-between">
        

        <h1 className=" font-semibold text-[#E8711E] text-lg flex gap-2 items-center">
          <Music color="#E8711E" />
          Music Player
        </h1>

        <button
          onClick={() => setIsPopupOpen(true)}
          className="flex gap-2 mr-2 bg-[#a3ede677] px-3 py-2 rounded-full cursor-pointer hover:scale-105 transition"
        >
          <Upload /> Upload Music
        </button>

        {isPopupOpen && (
          <SongUploadModal
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
