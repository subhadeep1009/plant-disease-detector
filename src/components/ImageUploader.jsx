import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

export default function ImageUploader({ onImageSelect, isLoading }) {
  const [mode, setMode] = useState("upload");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onImageSelect(e.target.result);
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const capturePhoto = useCallback(() => {
    const img = webcamRef.current?.getScreenshot();
    if (img) onImageSelect(img);
  }, [onImageSelect]);

  return (
    <div className="w-full">

      <div className="flex gap-1 p-1 glass rounded-xl w-fit mx-auto mb-6">
        {["upload", "camera"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2 rounded-lg text-sm   font-medium transition-all duration-300 ${
              mode === m
                ? "bg-green-700 text-white"
                : "text-green-500 hover:text-white"
            }`}
          >
            {m === "upload" ? "📁 Upload Image" : "📷 Camera"}
          </button>
        ))}
      </div>

      {mode === "upload" && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all duration-300 ${
            dragOver
              ? "border-green-400 bg-green-900/20 scale-[1.02]"
              : "border-green-900 hover:border-green-700"
          }`}
        >
          <div className="text-5xl mb-4">🌿</div>
          <p style={{ fontFamily: "'Playfair Display', serif" }}
             className="text-xl text-green-300 mb-2">
            Drag your image here
          </p>
          <p className="text-green-700 text-sm mb-6">or click to browse files</p>
          <span className="px-5 py-2.5 bg-green-800 hover:bg-green-700 rounded-xl text-sm transition-colors">
            Choose Image
          </span>
          <p className="text-green-800 text-xs mt-4">JPG · PNG · WebP supported</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      )}

      {mode === "camera" && (
        <div className="text-center">
          <div className="relative inline-block rounded-2xl overflow-hidden border border-green-900 mb-4">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full max-w-sm"
              videoConstraints={{ facingMode: "environment" }}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border border-green-400/30 rounded-xl" />
              <div className="absolute left-4 right-4 h-px bg-green-400/60 animate-scan-line" />
            </div>
          </div>
          <button
            onClick={capturePhoto}
            disabled={isLoading}
            className="flex items-center gap-3 mx-auto px-8 py-3 bg-green-700 hover:bg-green-600 rounded-full font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <span className="w-3 h-3 rounded-full bg-white" />
            Capture Photo
          </button>
        </div>
      )}
    </div>
  );
}