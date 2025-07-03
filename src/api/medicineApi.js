import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/medicines";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store JWT token in localStorage
  },
});

const token = localStorage.getItem("token");
if (!token) {
  throw new Error("No authentication token found");
}

export const getMedicines = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching medicines:", error);
    throw error;
  }
};

export const addMedicine = async (formData, imageFile) => {
  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("description", formData.description);
  // Append all form fields
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formDataToSend.append(key, value);
    }
  });

  // Append image file if exists
  if (imageFile) {
    formDataToSend.append("image", imageFile);
  }

  try {
    const response = await api.post("/", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding medicine:", error);
    throw error;
  }
};

export const updateMedicine = async (id, medicineData, imageFile) => {
  try {
    const formData = new FormData();

    Object.entries(medicineData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await api.put(`/${id}`, formData, {
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
    await api.delete(`/${id}`); // Use api instead of axios
  } catch (error) {
    console.error("Error deleting medicine:", error);
    throw error;
  }
};
