import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/Dashboard.layout';
import AddModal from '@/components/AddModal';
import FormItem from '@/components/FormItem';
import SearchInput from '@/components/SearchInput';
import FilterDropdown from '@/components/FilterDropdown';
import { Badge, Button, Flex, HStack, Text, Tabs, TabList, Tab, TabPanels, TabPanel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import AddTemplateForm from '@/components/AddTemplateForm';
import AddAI from '@/components/AddAI';
import axios from 'axios';
import Table from '@/components/Table';
import DeleteButton from '@/components/DeleteButton';
import TemplateDetail from '@/components/TemplateDetail';
import Link from '@/components/Link';

interface PaginationState {
  page: number;
  limit: number;
}

type ListControllerInput = {
  page: number;
  limit: number;
  filter?: {
    clusterId?: string;
  };
  search?: {
    keyword?: string;
  };
};

type AddControllerValues = {
  cluster_id: string;
};

const ControllerPage: React.FC = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);
  const [isGenerateAI, setIsGenerateAI] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    take: 10,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);


  useEffect(() => {
    fetchControllers();
  }, [pagination.page]);

  useEffect(() => {
    fetchTemplates();
  }, [pagination.page]);

  const fetchControllers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/controllers', {
        params: {
          page: pagination.page,
          take: pagination.take,
        },
      });
      const { data, meta } = response.data;

      if (Array.isArray(data)) {
        setData(data);
        setPagination(meta);
      }
    } catch (error) {
      console.error('Error fetching controllers:', error);
      setError(error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('http://localhost:4000/templates', {
        params: {
          page: pagination.page,
          take: pagination.take,
        },
      });
      const { data, meta } = response.data;

      if (Array.isArray(data)) {
        const templatesWithDetails = await Promise.all(
          data.map(async (template: any) => {
            const details = await fetchTemplateDetails(template.template_id);
            return { ...template, ...details };
          })
        );

        setTemplates(templatesWithDetails);
        setPagination(meta);
        console.log('detail', templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchTemplateDetails = async (templateId: string) => {
    try {
      const response = await axios.get(`http://localhost:4000/templates/details/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching template details:', error);
      throw error;
    }
  };


  const getTotalDevices = async (cluster_id: string): Promise<number> => {
    try {
      const response = await axios.get(`http://localhost:4000/clusters/${cluster_id}`);
      return response.data.devicesCount;
    } catch (error) {
      console.error('Error fetching device count:', error);
      throw error;
    }
  };

  const getNextDeviceName = async (cluster_id: string): Promise<string> => {
    try {
      const totalDevices = await getTotalDevices(cluster_id);
      const nextDeviceNumber = totalDevices + 1;
      const formattedDeviceNumber = String(nextDeviceNumber).padStart(3, '0');
      return `device-${formattedDeviceNumber}`;
    } catch (error) {
      console.error('Error getting next device name:', error);
      throw error;
    }
  };

  const attemptCreate = async (values: AddControllerValues) => {
    setSubmitLoading(true);
    try {
      const deviceName = await getNextDeviceName(values.cluster_id);
      if (deviceName) {
        await axios.post('http://localhost:4000/controllers', { ...values, name: deviceName });
        fetchControllers();
        setSubmitLoading(false);
        setIsOpen(false);
      } else {
        console.error('Failed to generate device name');
        setSubmitLoading(false);
      }
    } catch (error) {
      console.error('Error creating controller:', error);
      setError(error);
      setSubmitLoading(false);
    }
  };

  const handleViewDetail = (id: string, type: 'template' | 'controller') => {
    if (type === 'template') {
      setSelectedTemplateId(id);
    }
  };

  const handleDelete = async (templateId: string) => {
    try {
      await axios.delete(`http://localhost:4000/templates/${templateId}`);
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const renderTemplateList = (logControllers: any) => {
    if (!logControllers || !logControllers.length) return 'N/A';

    return (
      <div>
        {logControllers.map((logController: any, index: number) => (
          <div key={index}>
            <div>EC: {logController.ec !== undefined ? logController.ec : 'N/A'}</div>
            <div>pH: {logController.ph !== undefined ? `${logController.ph[0]}-${logController.ph[1]}` : 'N/A'}</div>
            <div>Humidity: {logController.humidity !== undefined ? `${logController.humidity}%` : 'N/A'}</div>
            <div>Air Temp: {logController.temperature_air !== undefined ? `${logController.temperature_air[0]}-${logController.temperature_air[1]}°C` : 'N/A'}</div>
            <div>Water Temp: {logController.temperature_water !== undefined ? `${logController.temperature_water}°C` : 'N/A'}</div>
            <div>Waterflow: {logController.water_flow !== undefined ? `${logController.water_flow} L/m` : 'N/A'}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderGeneratedTemplateList = (logControllers: any) => {
    if (!logControllers || !logControllers.length) return 'N/A';

    return (
      <div>
        {logControllers.map((logController: any, index: number) => (
          <div key={index}>
            <div>EC: {logController.ec !== undefined ? logController.ec : 'N/A'}</div>
            <div>pH: {logController.ph !== undefined ? `${logController.ph.max}-${logController.ph.min}` : 'N/A'}</div>
            <div>Humidity: {logController.humidity !== undefined ? `${logController.humidity}%` : 'N/A'}</div>
            <div>Air Temp: {logController.temperature_air !== undefined ? `${logController.temperature_air.max}-${logController.temperature_air.min}°C` : 'N/A'}</div>
            <div>Water Temp: {logController.temperature_water !== undefined ? `${logController.temperature_water}°C` : 'N/A'}</div>
            <div>Waterflow: {logController.water_flow !== undefined ? `${logController.water_flow} L/m` : 'N/A'}</div>
          </div>
        ))}
      </div>
    );
  };


  const handleTabChange = (index: number) => {
    setActiveTab(index);
    if (index === 0) {
      fetchControllers();
    } else if (index === 1) {
      fetchTemplates();
    }
  };

  const handleAddTemplateOrAI = async () => {
    setIsAddModalOpen(false);
    fetchTemplates();
  };

  const handlePageChange = (page: number) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page,
    }));
  };


  // kolom Controller
  const controllerColumns = [
    {
      name: '#No', selector: (_: any, idx: number) => {
        const page = pagination.page || 1;
        const limit = pagination.take || 10;
        const offset = (page - 1) * limit;
        return String(idx + 1 + offset).padStart(2, '0');
      },
    },
    { name: 'Controller Name', selector: (row: any) => row.name.split('/')?.[1] ?? row.name, width: 'w-2/12' },
    { name: 'Cluster', selector: (row: any) => row.cluster.name || '', width: 'w-2/12' },
    { name: 'Template Name', selector: (row: any) => row.template.name || '', width: 'w-2/12' },
    { name: 'DAP', selector: (row: any) => row.template.dap_count ? `${row.template.dap_count} Days` : '', width: 'w-2/12' },
    {
      name: 'Status',
      selector: (row: any) => (
        <Badge
          variant={'solid'}
          colorScheme={row.is_active ? 'green' : 'red'}
          sx={{
            backgroundColor: 'gray.200',
            color: 'green.400',
            fontWeight: '600',
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '4px',
            textTransform: 'capitalize'
          }}
        >
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
      width: 'w-2/12'
    },

    {
      name: 'Action',
      selector: (row: any) => (
        <>
          <Link target='_blank' href={`/controller/${row.controller_id}`}>
            <Button variant='solid'
              bg={'secondary'}
              borderRadius={'full'}
              color='white'
              _hover={{ bg: 'secondary_hover' }}
              size={'sm'}
            >
              View Detail
            </Button>
          </Link>
        </>
      ),
      width: 'w-1/12'
    },
  ];

  //kolom Template
  const templateColumns = [
    {
      name: '#No', selector: (_: any, idx: number) => {
        const page = pagination.page || 1;
        const limit = pagination.take || 10;
        const offset = (page - 1) * limit;
        return String(idx + 1 + offset).padStart(2, '0');
      },
    },
    { name: 'Template Name', selector: (row: any) => row.name, width: 'w-2/6' },
    { name: 'DAP', selector: (row: any) => row.dap_count ? `${row.dap_count} Days` : '', width: 'w-1/6' },
    {
      name: 'Template List',
      selector: (row: any) => (
        <>
          {row.controllers.length > 0 && (
            <div>
              {row.is_active
                ? renderTemplateList(row.controllers[0].logControllers)
                : renderGeneratedTemplateList(row.controllers[0].logControllers)}
            </div>
          )}
        </>
      ),
      width: 'w-2/6'
    },
    {
      name: 'Status',
      selector: (row: any) => (
        <Text fontSize="md" fontWeight="bold" color={row.is_active ? 'gold' : 'lime'}>
          {row.is_active ? 'Manual Input' : 'Generate By Ai'}
        </Text>
      ),
      width: 'w-1/6'
    },
    {
      name: 'Action',
      selector: (row: any) => (
        <>
          <Flex>
            <Button variant='solid'
              bg={'secondary'}
              borderRadius={'full'}
              color='white'
              _hover={{ bg: 'secondary_hover' }}
              size={'sm'}
              onClick={() => handleViewDetail(row.template_id, 'template')}
              mr={1}
            >
              View Detail
            </Button>
            <DeleteButton
              title='Delete Template'
              onDelete={() => handleDelete(row.template_id)}
            />
          </Flex>
        </>
      ),
      width: 'w-1/6'
    },
  ];

  return (
    <DashboardLayout>
      <AddModal
        loading={submitLoading}
        onSubmit={attemptCreate}
        schema={{
          cluster_id: '',
          template_id: '',
          is_active: true
        }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title='Add New Controller'
      >
        <FormItem.ClusterDropdown name="cluster_id" placeholder="Cluster" />
        <FormItem.TemplateDropdown name="template_id" placeholder="Template" />
      </AddModal>

      {/* Modal Tambah Template Baru */}
      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setIsManualInput(false); setIsGenerateAI(false); }}>
        <ModalOverlay />
        <ModalContent maxW="600px">
          <ModalHeader>Add New Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!isManualInput && !isGenerateAI ? (
              <Flex direction="column" alignItems="center">
                <Button colorScheme="blue" variant="outline" mb="5" w="60%" borderRadius="20px" onClick={() => setIsManualInput(true)}> Input Manual </Button>
                <Button colorScheme="blue" variant="outline" mb="9" w="60%" borderRadius="20px" onClick={() => setIsGenerateAI(true)}> Generate Dengan AI </Button>
              </Flex>
            ) : isManualInput ? (
              <AddTemplateForm handleAddTemplateOrAI={handleAddTemplateOrAI} />
            ) : (
              <AddAI handleAddTemplateOrAI={handleAddTemplateOrAI} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <div className='bg-white rounded-lg p-6'>
        <Tabs isLazy onChange={handleTabChange}>
          <TabList>
            <Tab>Controllers</Tab>
            <Tab>Templates</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Flex justifyContent='space-between' alignItems='center' mb='24px'>
                <HStack spacing='1rem' w={{ base: 'full', md: '50%', lg: '60%' }}>
                  <SearchInput placeholder='Cari Nama Controller' />
                  <FilterDropdown modelKey='cluster_id' placeholder='Cluster' w='40%' h='3rem' bg='other.02' />
                </HStack>
                <Button onClick={() => setIsOpen(true)} h='3rem' variant='solid' bg='primary' color='white' _hover={{ bg: 'primary_hover' }}>
                  Add New Controller
                </Button>
              </Flex>
              <Table
                columns={controllerColumns}
                data={data}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </TabPanel>
            <TabPanel>
              <Flex justifyContent='space-between' alignItems='center' mb='24px'>
                <HStack spacing='1rem' w={{ base: 'full', md: '50%', lg: '60%' }}>
                  <SearchInput placeholder='Cari Nama Template' />
                  <FilterDropdown modelKey='cluster_id' placeholder='Cluster' w='40%' h='3rem' bg='other.02' />
                </HStack>
                <Button onClick={() => setIsAddModalOpen(true)} h='3rem' variant='solid' bg='primary' color='white' _hover={{ bg: 'primary_hover' }}>
                  Add New Template
                </Button>
              </Flex>
              <Table
                columns={templateColumns}
                data={templates}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>

        {error && (
          <Text
            textAlign={'center'}
            letterSpacing={'-0.39 px'}
            lineHeight={'19.07px'}
            fontSize={'14px'}
            color='status.error'
            fontWeight={400}
            mt={2}
          >
            {String(error)}
          </Text>
        )}

        <TemplateDetail id={selectedTemplateId} />
      </div>
    </DashboardLayout>
  );
};

export default ControllerPage;