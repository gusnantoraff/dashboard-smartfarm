import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { Controller } from './useController';

export interface Template {
  template_id: string;
  name: string;
  dap_count: number;
  ecData: any;
  controllerCount: number;
  controllers: Controller[];
}

export interface TemplateResponse {
  ListTemplates: {
    listTemplate: {
      page: number;
      take: number;
      itemCount: number;
      pageCount: number;
      templates: Template[];
    };
    count: TemplateCount[];
  };
}

export interface TemplateCount {
  category: string;
  total: number;
}

export interface ListTemplateInput {
  page: number;
  limit: number;
  search?: {
    keyword: string;
  };
  filter?: {
    category?: string;
  };
  order?: {
    orderBy?: string;
    sortBy?: string;
  };
}

export function useQueryTemplate(
  templateId: string | null,
  config?: any,
) {
  const toast = useToast();
  const [data, setData] = useState<Template | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!templateId) return;
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/templates/${templateId}`, {
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
  }, [templateId, config, toast]);

  return { data, loading, error };
}

export const useMutationTemplate = () => {
  const toast = useToast();

  const updateTemplate = async (templateId: string, templateData: Partial<Template>) => {
    try {
      const response = await axios.put(`http://localhost:4000/templates/${templateId}`, templateData);
      toast({
        title: 'Template Updated',
        description: 'Template has been updated successfully.',
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

  return updateTemplate;
};
