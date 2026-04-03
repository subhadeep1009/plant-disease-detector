import { useState } from "react";

export default function ResultCard({ result, image, onReset }) {
  const { isHealthy, healthScore, diseases, plantName, plantProbability } = result;

  return (
    <div className="w-full animate-fade-up">

      <div className="flex gap-5 mb-6">
        <img
          src={image}
          alt="Scanned"
          className="w-24 h-24 object-cover rounded-xl border border-green-900 flex-shrink-0"
        />
        <div className="flex-1">
          <p className="text-green-700 text-xs uppercase tracking-widest mb-1">Identified as</p>
          <h2
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-2xl text-white italic mb-2"
          >
            {plantName}
          </h2>
          {plantProbability > 0 && (
            <p className="text-green-600 text-xs mb-2">Confidence: {plantProbability}%</p>
          )}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            isHealthy
              ? "bg-emerald-900/40 text-emerald-300 border-emerald-800"
              : "bg-red-900/30 text-red-300 border-red-900"
          }`}>
            {isHealthy ? "✓ Healthy Plant" : "⚠ Disease Detected"}
          </span>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 text-sm">Health Score</span>
          <span className={`text-2xl font-bold ${
            healthScore > 70 ? "text-emerald-400"
            : healthScore > 40 ? "text-amber-400"
            : "text-red-400"
          }`}>
            {healthScore}%
          </span>
        </div>
        <div className="h-2 bg-green-950 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              healthScore > 70 ? "bg-emerald-500"
              : healthScore > 40 ? "bg-amber-500"
              : "bg-red-500"
            }`}
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {isHealthy && (
        <div className="glass-green rounded-2xl p-6 text-center mb-4">
          <div className="text-4xl mb-2">🎉</div>
          <h3
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-xl text-green-300 mb-1"
          >
            Plant is healthy!
          </h3>
          <p className="text-green-600 text-sm">No signs of disease were detected.</p>
        </div>
      )}

      {!isHealthy && diseases.length > 0 && (
        <div className="space-y-3 mb-4">
          <p className="text-green-700 text-xs uppercase tracking-widest">Detected Diseases</p>
          {diseases.map((disease, i) => (
            <DiseaseItem key={i} disease={disease} defaultOpen={i === 0} />
          ))}
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full py-3 mt-2 border border-green-900 hover:border-green-700 rounded-xl text-green-600 hover:text-green-400 text-sm font-medium transition-all duration-300"
      >
        Scan Again
      </button>
    </div>
  );
}

function DiseaseItem({ disease, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
          <span className="text-white text-sm text-left">{disease.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-900/40 text-red-300">
            {disease.probability}%
          </span>
          <span className="text-green-700 text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3">
          {disease.cause && (
            <div>
              <p className="text-green-700 text-xs uppercase tracking-wider mb-1">Cause</p>
              <p className="text-green-300 text-sm">{disease.cause}</p>
            </div>
          )}
          {disease.description && (
            <div>
              <p className="text-green-700 text-xs uppercase tracking-wider mb-1">Description</p>
              <p className="text-green-500 text-sm leading-relaxed">
                {disease.description.slice(0, 220)}{disease.description.length > 220 ? "..." : ""}
              </p>
            </div>
          )}
          {disease.treatment && (
            <div className="glass-green rounded-lg p-3">
              <p className="text-green-600 text-xs uppercase tracking-wider mb-2">Treatment</p>
              {typeof disease.treatment === "string" ? (
                <p className="text-green-300 text-sm">{disease.treatment}</p>
              ) : (
                <div className="space-y-1.5">
                  {disease.treatment.biological && (
                    <p className="text-green-300 text-sm">🌱 {disease.treatment.biological}</p>
                  )}
                  {disease.treatment.chemical && (
                    <p className="text-green-300 text-sm">💊 {disease.treatment.chemical}</p>
                  )}
                  {disease.treatment.prevention && (
                    <p className="text-green-300 text-sm">🛡 {disease.treatment.prevention}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}