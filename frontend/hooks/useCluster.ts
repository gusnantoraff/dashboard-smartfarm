import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { Cluster, DetailCluster } from '@/types';

export interface ClusterResponse {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  clusters: Cluster[];
}

export interface DetailClusterResponse {
  data : DetailCluster;
}

export interface UpdateClusterResponse {
  success: boolean;
  message?: string;
}

type ResponseType = {
  GET: ClusterResponse;
  GET_ONE: DetailClusterResponse;
  GET_LAT_LONG: ClusterResponse;
};

export function useQueryCluster<T extends keyof ResponseType>(
  method: T,
  config?: any,
) {
  const toast = useToast();
  const [data, setData] = useState<ResponseType[T] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/clusters/${method}`, config);
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

export function useMutationCluster() {
  const toast = useToast();

  const updateCluster = async (clusterId: string, newData: Partial<Cluster>) => {
    try {
      const response = await axios.put(`http://localhost:4000/clusters/${clusterId}`, newData);
      toast({
        title: 'Cluster Updated',
        description: 'Cluster has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      return response.data;
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error Occurred',
        description: error.message || 'Failed to update cluster.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  return updateCluster;
};