"use client";
import { getUrl } from "@/utils/aws"; // Removed getSignedUrl (not used)
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

const SongUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!title || !audioFile) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
         setIsSubmitting(true);
      const audioKey = `tracks/${title.replace(" ", "-")}-${Date.now()}.mp3`
      const audioUrlResponse = await getUrl(audioKey);

      if (!audioUrlResponse?.url || !audioUrlResponse?.objectKey) {
        throw new Error("Failed to get signed URL for audio.");
      }

      // 2️⃣ Upload Audio to S3
      const uploadAudioRes = await fetch(audioUrlResponse.url, {
        method: "PUT",
        body: audioFile,
        headers: { "Content-Type": audioFile.type },
      });

      if (!uploadAudioRes.ok) {
        throw new Error("Audio upload failed");
      }

      let thumbnailUrl = null;

      // 3️⃣ Upload Thumbnail to S3 (If exists)
      if (thumbnail) {
        const thumbnailKey = `thumbnails/${Date.now()}-${thumbnail.name}`;
        const thumbnailUrlResponse = await getUrl(
          thumbnailKey
        );

        const uploadThumbnailRes = await fetch(thumbnailUrlResponse.url, {
          method: "PUT",
          body: thumbnail,
          headers: { "Content-Type": thumbnail.type },
        });

        if (!uploadThumbnailRes.ok) {
          throw new Error("Thumbnail upload failed");
        }

        thumbnailUrl = thumbnailUrlResponse.objectKey;
      }

      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          artist,
          thumbnailUrl,
          audioUrl: audioUrlResponse.objectKey,
        }),
      });

      if (response.ok) {
        alert("Song uploaded successfully!");
        onSubmit(); 
        onClose();
      } else {
        throw new Error("Failed to save track metadata.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading: " + error.message);
    } finally {
      setIsSubmitting(false)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0d0d0d91] bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="bg-[#181B21] p-6 rounded-lg w-96 shadow-lg text-gray-100">
        <h2 className="text-lg font-semibold mb-4">Upload Song</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label >Title</label>
          <input
            type="text"
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <label >Artist</label>
          <input
            type="text"
            placeholder="Artist Name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="border p-2 rounded"
            required
          />

          {/* Thumbnail Preview */}
          <label htmlFor="">Thumnail</label>
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="w-full h-32 object-cover rounded"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="border p-2 rounded"
          />
          <label >Audio Track</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="border p-2 rounded"
            required
          />
          {isSubmitting && <Loader2 className="animate-spin"/>}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-red-500 border-red-400 border rounded"
            >
              Cancel
            </button>
            <button
              
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongUploadModal;
