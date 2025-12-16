

import axios from "/node_modules/.vite/deps/axios.js?v=75e7dad8";

const API_BASE_URL = "http://localhost:8080/api/medicines";

// Create axios instance without default auth header
export const api = axios.create({
  baseURL: API_BASE_URL,
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





// Update your response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized - Token might be invalid or expired');
      console.error('❌ Current token:', localStorage.getItem('token'));
      // Don't redirect automatically for API calls
      return Promise.reject(new Error('Authentication required'));
    }
    return Promise.reject(error);
  }
);


// Add this debug function at the top of your file
export const debugToken = () => {
  const token = localStorage.getItem('token');
  console.log('🔍 === TOKEN DEBUG ===');
  console.log('Token exists?', !!token);
  
  if (token) {
    console.log('Token length:', token.length);
    console.log('Token first 50 chars:', token.substring(0, 50) + '...');
    
    try {
      // Decode JWT token
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('🔍 Token payload:', payload);
        console.log('🔍 Username:', payload.sub);
        console.log('🔍 Roles in token:', payload.roles || 'NO ROLES FOUND');
        console.log('🔍 Has ADMIN role?', payload.roles && payload.roles.includes('ADMIN'));
        console.log('🔍 Token expiry:', new Date(payload.exp * 1000));
        console.log('🔍 Is expired?', Date.now() > payload.exp * 1000);
      } else {
        console.log('❌ Invalid token format');
      }
    } catch (error) {
      console.log('❌ Error decoding token:', error);
    }
  }
  
  console.log('🔍 === END DEBUG ===');
};



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
  
  // Debug token first
  debugToken();
  
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ No token found in localStorage');
    throw new Error('Please login first');
  }
  
  const formData = new FormData();
  
  formData.append("name", medicineData.name);
  formData.append("description", medicineData.description);
  formData.append("price", medicineData.price.toString());
  formData.append("stock", medicineData.stock.toString());
  formData.append("expiryDate", medicineData.expiryDate);
  
  const status = medicineData.medicineStatus || "ADDED";
  formData.append("medicineStatus", status.toUpperCase());

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    console.log('📤 Sending POST to /addMedicines');
    console.log('📤 Token being sent:', token.substring(0, 20) + '...');
    
    // ✅ REMOVE the manual Authorization header - let interceptor handle it
    const response = await api.post("/addMedicines", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log('✅ Add medicine successful:', response.data);
    return response.data;
    
  } catch (error) {
    console.error("❌ Error adding medicine:", error);
    
    if (error.response) {
      console.error("❌ Status code:", error.response.status);
      console.error("❌ Response data:", error.response.data);
      console.error("❌ Response headers:", error.response.headers);
      
      if (error.response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      }
      if (error.response.status === 403) {
        throw new Error("You need ADMIN privileges to add medicines.");
      }
    }
    
    throw error; // Re-throw to handle in component
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

