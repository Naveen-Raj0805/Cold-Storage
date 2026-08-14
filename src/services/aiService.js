const BASE_URL = 'http://localhost:8083/api';

const handleResponse = async (response) => {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: text };
  }

  if (!response.ok) {
    const errorMsg = data.message || `HTTP error! status: ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const getAiSettings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/ai/settings`);
    return await handleResponse(res);
  } catch (err) {
    return {
      masterPrompt: "You are AgriFreeze Food Science AI, an expert post-harvest agricultural safety and spoilage engine. Analyze temperature (°C), relative humidity (%), door opening frequency, and product type. Calculate predicted remaining shelf life in days, spoilage risk percentage (0-100%), and assign an overall status (Safe, Warning, Critical). Provide role-specific actionable insights: farmer_tip (immediate field/storage operations) and manager_tip (commercial dispatch or markdown action).",
      riskThreshold: 70,
      modelVersion: "gemini-2.5-flash"
    };
  }
};

export const updateAiSettings = async (settingsData) => {
  try {
    const res = await fetch(`${BASE_URL}/ai/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData)
    });
    return await handleResponse(res);
  } catch (err) {
    return settingsData;
  }
};

export const submitDigitalInspection = async (inspectionData) => {
  try {
    const res = await fetch(`${BASE_URL}/nosql/ai/inspection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inspectionData)
    });
    return await handleResponse(res);
  } catch (err) {
    // Client-side fallback prediction logic
    const temp = Number(inspectionData.temperature || 4);
    const humidity = Number(inspectionData.humidity || 85);
    const door = inspectionData.doorMetrics || "NORMAL";
    const prod = inspectionData.productName || "Crop Harvest Batch";

    const doorFactor = door === "FREQUENT" ? 18 : (door === "OPEN" ? 30 : 5);
    const risk = Math.min(99, Math.max(5, Math.round((temp - 4) * 9.5 + Math.abs(humidity - 85) * 1.4 + doorFactor)));
    const shelfLife = Math.max(1, Math.round(90 * Math.pow(0.85, Math.max(0, temp - 4)) * (1 - risk / 130)));
    const status = risk >= 70 ? "Critical" : (risk >= 45 ? "Warning" : "Safe");

    return {
      id: Date.now(),
      productName: prod,
      temperature: temp,
      humidity: humidity,
      doorMetrics: door,
      spoilageRiskPercent: risk,
      predictedShelfLifeDays: shelfLife,
      status: status,
      farmerTip: status === "Critical"
        ? `Your humidity (${humidity}%) and temperature (${temp}°C) are too high for ${prod}. Adjust ventilation immediately to prevent surface mold.`
        : `Storage climate (${temp}°C, ${humidity}% RH) is optimal for ${prod}. Maintain current air recirculation settings.`,
      managerTip: status === "Critical"
        ? `Batch has lost 50% shelf expectancy (${shelfLife} days remaining). Route immediately to local processing or initiate an immediate 20% flash clearance markdown.`
        : `${prod} inventory status is healthy. Standard sales distribution schedule applies (${shelfLife} days shelf life remaining).`,
      createdAt: new Date().toISOString()
    };
  }
};

export const getInspectionHistory = async () => {
  try {
    const res = await fetch(`${BASE_URL}/nosql/ai/inspections`);
    return await handleResponse(res);
  } catch (err) {
    return [];
  }
};

export const getSpoilageQueue = async () => {
  try {
    const res = await fetch(`${BASE_URL}/ai/spoilage-queue`);
    return await handleResponse(res);
  } catch (err) {
    return [
      {
        id: 1,
        productName: "Fresh Roma Tomatoes",
        temperature: 8.1,
        humidity: 95.0,
        doorMetrics: "FREQUENT",
        spoilageRiskPercent: 78,
        predictedShelfLifeDays: 4,
        status: "Critical",
        farmerTip: "Your humidity and temperature are too high for tomatoes. Adjust ventilation immediately to prevent surface mold.",
        managerTip: "Batch has lost 50% shelf expectancy. Route immediately to local processing or initiate an immediate 20% flash clearance markdown."
      },
      {
        id: 2,
        productName: "Russet Baking Potatoes",
        temperature: 6.5,
        humidity: 88.0,
        doorMetrics: "NORMAL",
        spoilageRiskPercent: 42,
        predictedShelfLifeDays: 45,
        status: "Warning",
        farmerTip: "Temperature of 6.5°C is slightly elevated. Verify chamber insulation seal.",
        managerTip: "Monitor potatoes closely. Priority dispatch recommended within 45 days."
      },
      {
        id: 3,
        productName: "Organic Honeycrisp Apples",
        temperature: 4.2,
        humidity: 85.0,
        doorMetrics: "NORMAL",
        spoilageRiskPercent: 15,
        predictedShelfLifeDays: 84,
        status: "Safe",
        farmerTip: "Storage climate is optimal for apples. Maintain air recirculation to prevent ethylene buildup.",
        managerTip: "Inventory status healthy. Standard sales distribution schedule applies."
      }
    ];
  }
};
