import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { Cluster, DetailCluster } from '@/types';

// Definisikan jenis respons dari API
export interface ClusterResponse {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  clusters: Cluster[];
}

export interface DetailClusterResponse {
  DetailCluster: DetailCluster;
}

type ResponseType = {
  GET: ClusterResponse;
  GET_ONE: DetailClusterResponse;
  GET_LAT_LONG: ClusterResponse;
  // Tambahkan metode lain dan jenis responsnya sesuai kebutuhan
};

// Buat hook untuk melakukan query ke API cluster
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
      } catch (error: any) { // Tetapkan tipe 'any' untuk 'error'
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

    // Fungsi untuk membersihkan state saat komponen unmount
    return () => {
      setData(null);
      setLoading(false);
      setError(null);
    };
  }, [method, config, toast]);

  return { data, loading, error };
}