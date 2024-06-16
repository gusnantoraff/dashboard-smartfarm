import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Table, Tbody, Td, Th, Thead, Tr, Button, Flex, Input, Text } from '@chakra-ui/react';
import ModalTemplate from './ModalTemplate';

type Template = {
  template_id: string;
  name: string;
  dap_count: number;
};

type Props = {
  id: string | undefined | string[];
};

const TemplateDetail: React.FC<Props> = ({ id }: Props) => {
  const router = useRouter();
  const [data, setData] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [ecData, setEcData] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/templates/all/${id}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching template data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      const initialEcData = Array.from({ length: data.dap_count }, (_, i) => ({
        id: i + 1,
        value: 0,
      }));
      setEcData(initialEcData);
    }
  }, [data]);
  
  const onClose = () => {
    router.reload();
  };

  if (loading) {
    return null;
  }

  const template = data as Template;

  const handleDecrement = (id: number, data: any[], setData: React.Dispatch<React.SetStateAction<any[]>>) => {
    const newData = data.map(item => item.id === id ? { ...item, value: item.value - 1 } : item);
    setData(newData);
  };

  const handleIncrement = (id: number, data: any[], setData: React.Dispatch<React.SetStateAction<any[]>>) => {
    const newData = data.map(item => item.id === id ? { ...item, value: item.value + 1 } : item);
    setData(newData);
  };

  const handleDeleteData = (id: number, data: any[], setData: React.Dispatch<React.SetStateAction<any[]>>) => {
    const newData = data.filter(item => item.id !== id);
    setData(newData);
  };

  const handleAddData = (data: any[], setData: React.Dispatch<React.SetStateAction<any[]>>) => {
    const newId = data.length + 1;
    const newData = [...data, { id: newId, value: 0 }];
    setData(newData);
  };

  return (
    <ModalTemplate
      close={onClose}
      open={!!id}
      initialVal={{
        id: template.template_id,
        name: template.name,
        dap: template.dap_count,
      }}
      title={`TEMPLATE DETAIL`}
      subtitle={``}
      onEdit={(isEditing) => setIsEditMode(isEditing)}
    >
      <ModalTemplate.Data name='template_id' label='ID Template' value={template.template_id} />
      <ModalTemplate.Data
        editable
        name='name'
        label='Template Name'
        value={template.name}
        gray
      />
      <ModalTemplate.Data
        editable
        name='dap'
        label='DAP'
        value={template.dap_count}
      />
      
      <Flex justifyContent="space-between" alignItems="center" mt="10px">
        <Text fontWeight={500} fontSize={'16px'} color={'primary'}>
          SET EC VALUE / DAP
        </Text>
        {isEditMode && (
          <Button colorScheme="blue" size="sm" onClick={() => handleAddData(ecData, setEcData)}>Add New DAP</Button>
        )}
      </Flex>

      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>#No</Th>
            <Th>EC Value / DAP</Th>
            <Th>Setting</Th>
            {isEditMode && <Th>Action</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {ecData.map((item, index) => (
            <Tr key={index}>
              <Td>{item.id}</Td>
              <Td>EC Value DAP {item.id}</Td>
              <Td>
                {isEditMode ? (
                  <Flex alignItems="center">
                    <Button size="sm" onClick={() => handleDecrement(item.id, ecData, setEcData)}>-</Button>
                    <Input
                      value={item.value}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          setEcData(ecData.map(d => d.id === item.id ? { ...d, value } : d));
                        }
                      }}
                      size="sm"
                      width="40px"
                    />
                    <Button size="sm" onClick={() => handleIncrement(item.id, ecData, setEcData)}>+</Button>
                  </Flex>
                ) : (
                  <Input
                    value={item.value}
                    readOnly
                    size="sm"
                    width="40px"
                  />
                )}
              </Td>
              {isEditMode && (
                <Td>
                  <Button colorScheme="red" size="xs" onClick={() => handleDeleteData(item.id, ecData, setEcData)}>Delete</Button>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ModalTemplate>
  );
};

export default TemplateDetail;
