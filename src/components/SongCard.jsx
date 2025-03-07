import Image from "next/image";
import React from "react";
import defaultThumbnail from "../../public/thumbnail.jpg"

const SongCard = ({ data, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="relative w-42 flex flex-wrap flex-col items-center p-2 rounded-xl shadow-xl overflow-hidden border hover:scale-105 duration-100 cursor-pointer mt-2"
    >
     

      <div className="relative z-10 flex flex-col items-center">
        <Image
          src={data.thumbnailUrl || defaultThumbnail}
          alt="Song thumbnail"
          width={200}
          height={200}
          className="rounded-lg object-cover h-30"
          unoptimized
        />
        <h1 className="font-semibold  mt-2 text-center">
          {data.title}
        </h1>
        <h2 className="text-sm  text-center">{data.artist}</h2>
      </div>
    </div>
  );
};

export default SongCard;
