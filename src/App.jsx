import { useState, useCallback } from "react";
import ImageUploader from "./components/ImageUploader";
import ScanningLoader from "./components/ScanningLoader";
import ResultCard from "./components/ResultCard";
import { detectDisease } from "./services/plantApi";

export default function App() {
  const [state, setState] = useState("idle");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleImageSelect = useCallback(async (base64) => {
    setImage(base64);
    setState("scanning");
    setError("");
    try {
      const data = await detectDisease(base64);
      setResult(data);
      setState("result");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setState("error");
    }
  }, []);

  const handleReset = () => {
    setState("idle");
    setImage(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-green-950 to-gray-950 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-green-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-green-950/30 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-md mx-auto px-4 py-10 min-h-screen flex flex-col">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 animate-pulse px-4 py-1.5 glass rounded-full text-green-600 text-xs uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            AI-powered plant health monitoring
          </div>
          <h1
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-700 via-gray-400 to-gray-600 bg-clip-text text-transparent inline-block w-fit"
          >
            Flora
            <span className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent inline-block w-fit">
              Scan
            </span>
          </h1>
          <p className="text-green-700 text-sm max-w-xs mx-auto leading-relaxed">
            Upload or capture a photo of a plant leaf — AI will detect diseases
            instantly
          </p>
        </header>

        <main className="flex-1 flex flex-col justify-center">
          {state === "idle" && (
            <div className="animate-fade-up">
              <ImageUploader
                onImageSelect={handleImageSelect}
                isLoading={false}
              />
            </div>
          )}

          {state === "scanning" && <ScanningLoader image={image} />}

          {state === "result" && result && (
            <ResultCard result={result} image={image} onReset={handleReset} />
          )}

          {state === "error" && (
            <div className="text-center animate-fade-in">
              <div className="glass rounded-2xl p-8 mb-5">
                {error === "NOT_A_PLANT" ? (
                  <>
                    <div className="text-5xl mb-3">🚫</div>
                    <h3
                      style={{ fontFamily: "'Playfair Display', serif" }}
                      className="text-xl text-amber-300 mb-2"
                    >
                      No plant detected
                    </h3>
                    <p className="text-green-600 text-sm">
                      Please upload a clear photo of a plant or leaf.
                    </p>
                    <p className="text-green-800 text-xs mt-2">
                      Cars, buildings, and other objects are not supported.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-3">⚠️</div>
                    <h3
                      style={{ fontFamily: "'Playfair Display', serif" }}
                      className="text-xl text-red-300 mb-2"
                    >
                      Something went wrong
                    </h3>
                    <p className="text-green-700 text-sm">{error}</p>
                    <p className="text-green-800 text-xs mt-3">
                      Please check that your API key is correctly set in
                      plantApi.js
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-green-800 hover:bg-green-700 rounded-xl font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
