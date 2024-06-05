import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  memberships?: Membership[];
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
  clusters: any; // Adjust type as needed
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
    orderBy?: string; // Adjust type as needed
    sortBy?: string; // Adjust type as needed
  };
}

export interface UserResponse {
  ListUsers: {
    listUser: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
      users: User[];
    };
    count: RoleCount[];
  };
}

export type RoleEnum = 'SUPER_ADMIN' | 'ADMIN' | 'USER';
export interface RoleCount {
  role: RoleEnum;
  total: number;
}

export function useQueryUser<T extends keyof ResponseType>(
  method: T,
  config: any,
) {
  const toast = useToast();
  const [data, setData] = useState<ResponseType[T] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:400/users', {
          params: config?.params || {},
        });
        setData(response.data);
        setLoading(false);
      } catch (error:any) {
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
  }, [config, toast]);

  return { data, loading, error };
}

export const useMutationUser = (method: string, options?: any) => {
  const toast = useToast();
  const mutate = async (variables: any) => {
    try {
      const response = await axios.delete(`http://localhost:4000/users/${method}`);
      return response.data; // Adjust return data as needed
    } catch (error:any) {
      console.error(error);
      toast({
        title: 'Error Occurred',
        variant: 'left-accent',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };
  

  return [mutate, { loading: false, error: null, data: null }];
};
