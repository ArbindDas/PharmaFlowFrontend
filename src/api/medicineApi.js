

import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/medicines";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Check for token once when the module loads
const token = localStorage.getItem("token");
if (!token) {
  console.warn("No authentication token found");
  // Don't throw error here as it would prevent any API calls
  // Instead, the API calls will fail with 401 which can be handled
}

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
  const formData = new FormData();
    console.log("Sending status:", medicineData.status); // Add this line
    // Ensure status is uppercase and valid
  const validStatuses = ["ADDED", "AVAILABLE", "OUT_OF_STOCK", "EXPIRED", "DISCONTINUED"];

  const status = validStatuses.includes(medicineData.status?.toUpperCase()) 
    ? medicineData.status.toUpperCase() 
    : "ADDED";
  // Only append necessary fields
  formData.append("name", medicineData.name);
  formData.append("description", medicineData.description);
  formData.append("price", medicineData.price.toString());
  formData.append("stock", medicineData.stock.toString());
  formData.append("expiryDate", medicineData.expiryDate);
  // formData.append("status", medicineData.status);
  //  formData.append("status", status); // Use validated status
  formData.append("medicineStatus", status);  // Changed from "status" to "medicineStatus"

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await api.post("/addMedicines", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding medicine:", error);
    throw error;
  }
};




export const updateMedicine = async (id, formData, imageFile) => {
   const token = localStorage.getItem("token");
  
  // Verify token exists
  if (!token) {
    throw new Error("No authentication token found");
  }


  const formDataToSend = new FormData();
  
  // Append all required fields
  formDataToSend.append("name", formData.name);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("price", formData.price);
  formDataToSend.append("stock", formData.stock);
  formDataToSend.append("expiryDate", formData.expiryDate);
  formDataToSend.append("medicineStatus", formData.status);

  // Append image file if exists
  if (imageFile) {
    formDataToSend.append("image", imageFile);
  }

  try {
    const response = await api.put(`/${id}`, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Authorization": `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    
    console.error("Error updating medicine:", error);
    // Handle token expiration
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
    throw error;
  }
};







export const deleteMedicine = async (id) => {
  try {
    await api.delete(`/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    throw error;
  }
};

// Test endpoint (if needed)
export const testEndpoint = async () => {
  try {
    const response = await api.get("/test");
    return response.data;
  } catch (error) {
    console.error("Error testing endpoint:", error);
    throw error;
  }
};