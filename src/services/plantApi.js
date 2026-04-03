// Plant.id API Service
// =============================================

const API_KEY = "gE3hVu25iHN5ErhEtR71EqSdV3CWFxZXzCIyZQvHAa8102lzeT";

const API_URL = "https://plant.id/api/v3/identification?details=common_names,description,treatment,cause&language=en";

export async function detectDisease(base64Image) {
  // take data part from base64 string 
  const imageData = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": API_KEY,
    },
    body: JSON.stringify({
      images: [imageData],
      health: "all",
      classification_level: "species",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  return parseResult(data);
}

function parseResult(data) {
  console.log("FULL API DATA:", JSON.stringify(data, null, 2));

  // Check if the image is a valid plant image or not
  const classificationSuggestions = data.result?.classification?.suggestions || [];
  const topSuggestion = classificationSuggestions[0];
  const isPlant = topSuggestion?.probability > 0.3; // If probability<30%, not a plant

  // Throw error if not a plant image
  if (!isPlant || classificationSuggestions.length === 0) {
    throw new Error("NOT_A_PLANT");
  }

  const isHealthy = data.result?.is_healthy?.binary ?? true;
  const healthProbability = data.result?.is_healthy?.probability ?? 1;

  const diseases = (data.result?.disease?.suggestions || [])
    .slice(0, 5)
    .map((d) => ({
      name: d.name,
      probability: Math.round(d.probability * 100),
      description: d.details?.description || "",
      cause: d.details?.cause || "",
      treatment: d.details?.treatment || null,
    }));

  const commonNames = topSuggestion?.details?.common_names;
  const plantName =
    (commonNames && commonNames.length > 0 ? commonNames[0] : null) ||
    topSuggestion?.name ||
    "Unknown Plant";

  return {
    isHealthy,
    healthScore: Math.round(healthProbability * 100),
    diseases,
    plantName,
    plantProbability: Math.round((topSuggestion?.probability || 0) * 100),
  };
}