


import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../api/auth'; // Import authService

const OAuthSuccessHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthLogin } = useAuth();

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (!accessToken) {
          throw new Error('No access token received');
        }

        // Store tokens using authService
        authService.setOAuthTokens(accessToken, refreshToken);
        
        // Use the auth context to handle the OAuth login
        await handleOAuthLogin(accessToken, refreshToken);
        
        navigate('/dashboard', { replace: true });

      } catch (error) {
        console.error('OAuth login failed:', error);
        navigate('/login', { 
          replace: true,
          state: { error: 'Login failed. Please try again.' }
        });
      }
    };

    handleOAuthSuccess();
  }, [navigate, searchParams, handleOAuthLogin]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default OAuthSuccessHandler;