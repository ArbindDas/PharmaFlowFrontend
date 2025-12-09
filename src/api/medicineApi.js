

import axios from "/node_modules/.vite/deps/axios.js?v=75e7dad8";

const API_BASE_URL = "http://localhost:8080/api/medicines";

// Create axios instance without default auth header
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to dynamically add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getMedicines = async () => {
  try {
    const response = await api.get("/getMedicines");
    return response.data;
  } catch (error) {
    console.error("Error fetching medicines:", error);
    throw error;
  }
};

export const addMedicine = async (medicineData, imageFile) => {
  console.log("addMedicine called with data:", medicineData);
  console.log("Image file:", imageFile);
  const formData = new FormData();
  
  formData.append("name", medicineData.name);
  formData.append("description", medicineData.description);
  formData.append("price", medicineData.price.toString());
  formData.append("stock", medicineData.stock.toString());
  formData.append("expiryDate", medicineData.expiryDate);
  
  // FIX: Provide a default value if medicineStatus is not provided
  const status = medicineData.medicineStatus || "ADDED"; // Default to "ADDED"
  formData.append("medicineStatus", status.toUpperCase());

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await api.post("/addMedicines", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding medicine:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    // throw error;
  }
};


export const updateMedicine = async (id, formData, imageFile) => {
  const formDataToSend = new FormData();
  
  formDataToSend.append("name", formData.name);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("price", formData.price);
  formDataToSend.append("stock", formData.stock);
  formDataToSend.append("expiryDate", formData.expiryDate);
  
  // Use uppercase for status - backend expects this in update endpoint
  formDataToSend.append("status", (formData.status || "ADDED").toUpperCase());

  if (imageFile) {
    formDataToSend.append("image", imageFile);
  }

  try {
    const response = await api.put(`/${id}`, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating medicine:", error);
    throw error;
  }
};

export const deleteMedicine = async (id) => {
  try {
    await api.delete(`/${id}`);
  } catch (error) {
    console.error("Error deleting medicine:", error);
    throw error;
  }
};

