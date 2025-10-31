import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginData, RegisterData } from '../services/auth.service';
import { userService, ChangePasswordData } from '../services/user.service';
import Cookies from 'js-cookie';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (data) => {
      console.log("Data from backend:", data);
      
      if (data.token) {
        // Store token in cookie with proper settings
        Cookies.set('auth-token', data.token, { expires: 7,  });
        console.log('Token stored in cookie:', data.token.substring(0, 20) + '...');
      }

      // Store user data directly in query cache
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Remove token from cookie
      Cookies.remove('auth-token');
      // Clear all cached data
      queryClient.clear();
    },
    onError: () => {
      // Even if server logout fails, clear local data
      Cookies.remove('auth-token');
      queryClient.clear();
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = Cookies.get('auth-token');
      console.log('Token in useUser:', token ? token.substring(0, 20) + '...' : 'null');
      
      if (!token || token.trim() === '') {
        console.log('No valid token found');
        throw new Error('No token found');
      }
      
      try {
        console.log('Fetching profile with token');
        const profile = await authService.getProfile();
        console.log('Profile fetched successfully:', profile);
        return profile;
      } catch (error) {
        console.error('Profile fetch error:', error);
        // If token is invalid, remove it
        if ((error as any)?.response?.status === 401) {
          Cookies.remove('auth-token');
        }
        throw error;
      }
    },
    enabled: true,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { fullName?: string; email?: string; phoneNumber?: string }) => 
      userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update the user data in cache
      queryClient.setQueryData(['user'], updatedUser);
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => userService.changePassword(data),
  });
};