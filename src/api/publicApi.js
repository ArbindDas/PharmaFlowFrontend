
import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8080", // Hardcode your URL temporarily
});

export const getPublicMedicines = async () => {
  try {
    const response = await api.get("/api/public/med/medicines");
    return response.data;
  } catch (error) {
    console.error("Error fetching public medicines:", error);
    throw error;
  }
};