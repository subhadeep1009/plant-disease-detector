export default function ScanningLoader({ image }) {
  return (
    <div className="text-center animate-fade-in">
      <div className="relative inline-block mb-8">
        <img
          src={image}
          alt="Scanning"
          className="w-60 h-60 object-cover rounded-2xl border border-green-900"
        />
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute left-0 right-0 h-0.5 bg-green-400/70 animate-scan-line" />
        </div>
        {[
          "top-3 left-3 border-t-2 border-l-2 rounded-tl",
          "top-3 right-3 border-t-2 border-r-2 rounded-tr",
          "bottom-3 left-3 border-b-2 border-l-2 rounded-bl",
          "bottom-3 right-3 border-b-2 border-r-2 rounded-br",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-5 h-5 border-green-400 ${cls}`} />
        ))}
      </div>

      <h3
        style={{ fontFamily: "'Playfair Display', serif" }}
        className="text-2xl text-green-300 mb-2"
      >
        Analyzing image...
      </h3>
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-green-600 animate-pulse-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}