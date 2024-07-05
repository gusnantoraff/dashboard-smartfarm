import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Table, Tbody, Td, Th, Thead, Tr, Button, Flex, Input, Text, Textarea } from '@chakra-ui/react';
import ModalTemplate from './ModalTemplate';

type Template = {
  template_id: string;
  name: string;
  dap_count: number;
  ecData: Array<{ id: number; value: number; note: string }>;
};

type Props = {
  id: string | undefined | string[];
};

const TemplateDetail: React.FC<Props> = ({ id }: Props) => {
  const router = useRouter();
  const [data, setData] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Template>(`http://localhost:4000/templates/all/${id}`);
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

  const onClose = () => {
    router.reload();
  };

  const handleDecrement = (id: number, step: number = 0.1) => {
    const newData = data!.ecData.map(item =>
      item.id === id ? { ...item, value: parseFloat((item.value - step).toFixed(1)) } : item
    );
    setData(prevData => ({
      ...prevData!,
      ecData: newData
    }));
  };
  
  const handleIncrement = (id: number, step: number = 0.1) => {
    const newData = data!.ecData.map(item =>
      item.id === id ? { ...item, value: parseFloat((item.value + step).toFixed(1)) } : item
    );
    setData(prevData => ({
      ...prevData!,
      ecData: newData
    }));
  };

  const handleDeleteData = (id: number) => {
    const newData = data!.ecData.filter(item => item.id !== id);
    setData(prevData => ({
      ...prevData!,
      ecData: newData
    }));
  };

  const handleAddData = () => {
    const newId = data!.ecData.length + 1;
    const newData = [...data!.ecData, { id: newId, value: 0, note: '' }];
    setData(prevData => ({
      ...prevData!,
      ecData: newData
    }));
  };

  const handleNoteChange = (id: number, value: string) => {
    const newData = data!.ecData.map(item => {
      if (item.id === id) {
        return {
          ...item,
          note: value,
        };
      }
      return item;
    });

    setData(prevData => ({
      ...prevData!,
      ecData: newData
    }));
  };

  if (loading || !data) {
    return null;
  }

  return (
    <ModalTemplate
      close={onClose}
      open={!!id}
      initialVal={{
        id: data.template_id,
        name: data.name,
        dap_count: data.dap_count,
        ecData: data.ecData,
      }}
      title={`TEMPLATE DETAIL`}
      subtitle={``}
      ecData={data.ecData}
      onEdit={(isEditing) => setIsEditMode(isEditing)}
    >
      <ModalTemplate.Data name='template_id' label='ID Template' value={data.template_id} />
      <ModalTemplate.Data
        editable
        name='name'
        label='Template Name'
        value={data.name}
        gray
      />
      <ModalTemplate.Data
        editable
        name='dap_count'
        label='DAP'
        value={data.dap_count}
        type='number'
      />

      <Flex justifyContent="space-between" alignItems="center" mt="10px">
        <Text fontWeight={500} fontSize={'16px'} color={'primary'}>
          SET EC VALUE / DAP
        </Text>
        {isEditMode && (
          <Button colorScheme="blue" size="sm" onClick={handleAddData}>Add New DAP</Button>
        )}
      </Flex>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>#No</Th>
            <Th>EC Value / DAP</Th>
            <Th>Setting</Th>
            <Th textAlign="center">Note</Th>
            {isEditMode && <Th>Action</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {Array.from({ length: data.dap_count }).map((_, index) => {
            const item = data.ecData[index] || { id: index + 1, value: 0, note: '' };
            return (
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>EC Value DAP {item.id}</Td>
                <Td>
                  {isEditMode ? (
                    <Flex alignItems="center">
                      <Button size="sm" onClick={() => handleDecrement(item.id)}>-</Button>
                      <Input
                        type='number'
                        step='0.1'
                        value={item.value.toFixed(1)}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            const roundedValue = Math.round(value * 10) / 10;
                            handleIncrement(item.id, roundedValue);
                          }
                        }}
                        size="sm"
                        width="60px"
                      />
                      <Button size="sm" onClick={() => handleIncrement(item.id)}>+</Button>
                    </Flex>
                  ) : (
                    <Input
                      value={item.value}
                      readOnly
                      size="sm"
                      width="60px"
                    />
                  )}
                </Td>
                <Td>
                  {isEditMode ? (
                    <Textarea
                      value={item.note || ''}
                      onChange={(e) => handleNoteChange(item.id, e.target.value)}
                      size="sm"
                      height="80px"
                      width="200px"
                    />
                  ) : (
                    <Textarea
                      value={item.note || ''}
                      readOnly
                      size="sm"
                      height="80px"
                      width="200px"
                    />
                  )}
                </Td>
                {isEditMode && (
                  <Td>
                    <Button colorScheme="red" size="xs" onClick={() => handleDeleteData(item.id)}>Delete</Button>
                  </Td>
                )}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </ModalTemplate>
  );
};

export default TemplateDetail;
