import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { TemplateECDap, DetailController } from '@/types';
import { Time } from '@/types/TimeType';

export interface Controller extends Time {
    id: string;
    clusterId: string;
    templateId: string;
    templates?: TemplateECDap;
}

export interface ControllerResponse {
    ListController: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
        controllers: Controller[];
    };
}

export interface DetailControllerResponse {
    DetailController: DetailController;
}

type ResponseType = {
    GET: ControllerResponse;
    GET_ONE: DetailControllerResponse;
    // Add more methods and their response types as needed
};

export function useQueryController<T extends keyof ResponseType>(
    method: T,
    config?: any,
    id?: string
  ) {
    const toast = useToast();
    const [data, setData] = useState<ResponseType[T] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          let endpoint = `http://localhost:4000/controllers/${method}`;
          if (method === 'GET_ONE' && id) {
            endpoint = `http://localhost:4000/controllers/details/${id}`;
          }
          const response = await axios.get(endpoint, config);
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
  
      if (method !== 'GET_ONE' || id) {
        fetchData();
      } else {
        setLoading(false);
      }
  
      return () => {
        setData(null);
        setLoading(false);
        setError(null);
      };
    }, [method, config, id, toast]);
  
    return { data, loading, error };
  }  

export function useMutationController() {
    const toast = useToast();

    const updateController = async (controllerId: string, controllerData: Partial<Controller>) => {
        try {
            const response = await axios.put(`http://localhost:4000/controllers/${controllerId}`, controllerData);
            toast({
                title: 'Controller Updated',
                description: 'Controller has been updated successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            return response.data;
        } catch (error: any) {
            console.error(error);
            toast({
                title: 'Error Occurred',
                description: error.message || 'Failed to update controller.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            throw error;
        }
    };

    return updateController;
};
