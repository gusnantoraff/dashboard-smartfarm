import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import Cookies from 'js-cookie';

export interface User {
  user_id: string;
  name: string;
  role: string;
  email: string;
  memberships: Membership[];
}

export interface Membership {
  id: string;
  clusterId: string;
  userId: string;
  isOwner: boolean;
  isFirstOwner: boolean;
  isActive: boolean;
  invitedBy: string;
  invitedAt: string;
  clusters: any;
  users: User;
  invites: User;
}

export interface ListUserInput {
  page: number;
  limit: number;
  search?: {
    keyword: string;
  };
  filter?: {
    role?: string;
  };
  order?: {
    orderBy?: string;
    sortBy?: string;
  };
}

export interface UserResponse {
  ListUsers: {
    user_id: string;
    name: string;
    role: string;
    email: string;
    memberships?: Membership[];
  };
}

export type RoleEnum = 'SUPER_ADMIN' | 'ADMIN' | 'USER';
export interface RoleCount {
  role: RoleEnum;
  total: number;
}

export function useQueryUser<T extends keyof UserResponse>(
  method: T,
  config?: any,
) {
  const toast = useToast();
  const [data, setData] = useState<UserResponse[T] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/users/${method}`, {
          params: config?.params || {},
        });
        setData(response.data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
        toast({
          title: 'Error Occurred',
          variant: 'left-accent',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();

    return () => {
      setData(null);
      setLoading(false);
      setError(null);
    };
  }, [method, config, toast]);

  return { data, loading, error };
}

export const useMutationUser = () => {
  const toast = useToast();
  const token = Cookies.get('token');

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      if (!token) {
        console.error('No token available');
        return;
      }

      if (!userId || !userData) {
        console.error('Invalid userId or userData');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(`http://localhost:4000/users/${userId}`, userData, config);
      toast({
        title: 'User Updated',
        description: 'User has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      return response.data;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  return updateUser;
};