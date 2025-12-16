
// unifiedAuth.js
import axios from 'axios';

export const unifiedLogin = async (email, password) => {
  console.log('=== UNIFIED LOGIN START ===');
  
  try {
    const response = await axios.post('http://localhost:8080/api/auth/signin', {
      email,
      password
    });
    
    console.log('✅ Unified login response:', response.data);
    
    if (response.data.token) {
      // Store in ALL possible locations for compatibility
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        roles: response.data.roles || []
      }));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      console.log('✅ Token stored in all locations');
      
      // Verify storage
      console.log('🔍 Stored token:', localStorage.getItem('token'));
      console.log('🔍 Stored user:', localStorage.getItem('user'));
      
      return {
        success: true,
        token: response.data.token,
        username: response.data.username,
        roles: response.data.roles
      };
    } else {
      throw new Error('No token in response');
    }
    
  } catch (error) {
    console.error('❌ Unified login failed:', error);
    localStorage.clear(); // Clear everything on error
    
    return {
      success: false,
      message: error.response?.data?.error || error.message
    };
  } finally {
    console.log('=== UNIFIED LOGIN END ===');
  }
};