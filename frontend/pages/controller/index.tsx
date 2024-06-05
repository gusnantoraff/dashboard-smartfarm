import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/Dashboard.layout';
import AddModal from '@/components/AddModal';
import FormItem from '@/components/FormItem';
import SearchInput from '@/components/SearchInput';
import FilterDropdown from '@/components/FilterDropdown';
import { Badge, Button, Flex, HStack, Text, Tabs, TabList, Tab, TabPanels, TabPanel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import AddTemplateForm from '@/components/AddTemplateForm';
import AddAI from '@/components/AddAI';  // Import komponen AddAI
import axios from 'axios';
import Table from '@/components/Table'; // Import komponen Table
import DeleteButton from '@/components/DeleteButton';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Untuk modal tambah template baru
  const [isManualInput, setIsManualInput] = useState(false); // Untuk mengontrol tampilan form input manual
  const [isGenerateAI, setIsGenerateAI] = useState(false); // Untuk mengontrol tampilan form input AI
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

  useEffect(() => {
    fetchControllers();
  }, [pagination.page]);

  const fetchControllers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/controllers/all', {
        params: {
          page: pagination.page,
          take: pagination.take,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching controllers:', error);
      setError(error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('http://localhost:4000/templates/all');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
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
    // logika view detail
    console.log(`View details of ${type} with id: ${id}`);
  };

  const handleDelete = async (templateId: string) => {
    try {
      await axios.delete(`http://localhost:4000/templates/${templateId}`);
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const renderTemplateList = (config: any) => {
    if (!config) return 'N/A';

    return (
      <div>
        <div>EC: {config.ec ?? 'N/A'}</div>
        <div>pH: {config.ph ?? 'N/A'}</div>
        <div>Humidity: {config.humidity !== undefined ? `${config.humidity}%` : 'N/A'}</div>
        <div>Air Temp: {config.airTemperature !== undefined ? `${config.airTemperature}°C` : 'N/A'}</div>
        <div>Water Temp: {config.waterTemperature !== undefined ? `${config.waterTemperature}°C` : 'N/A'}</div>
        <div>Waterflow: {config.waterflow ?? 'N/A'} L/m</div>
      </div>
    );
  };

  const renderGeneratedTemplateList = (config: any, is_active: boolean) => {
    if (!config) return 'N/A';

    return (
      <div>
        <div>EC: {config.ecData?.[0]?.value ?? 'N/A'}</div>
        <div>pH: {config.phData?.[0]?.value ?? 'N/A'}</div>
        <div>Humidity: {config.humidityData?.[0]?.value !== undefined ? `${config.humidityData?.[0]?.value}%` : 'N/A'}</div>
        <div>Air Temp: {config.airTempData?.[0]?.value !== undefined ? `${config.airTempData?.[0]?.value}°C` : 'N/A'}</div>
        <div>Water Temp: {config.waterTempData?.[0]?.value !== undefined ? `${config.waterTempData?.[0]?.value}°C` : 'N/A'}</div>
        <div>Waterflow: {config.waterflowData?.[0]?.value ?? 'N/A'} L/m</div>
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
    setPagination({ ...pagination, page });
  };

  // kolom Controller
  const controllerColumns = [
    { name: '#No', selector: (row: any, idx: number) => idx + 1, width: 'w-1/12' },
    { name: 'Controller Name', selector: (row: any) => row.name.split('/')?.[1] ?? row.name, width: 'w-2/12' },
    { name: 'Cluster', selector: (row: any) => row.cluster.name || '', width: 'w-2/12' },
    { name: 'Template Name', selector: (row: any) => row.template.name || '', width: 'w-2/12' },
    { name: 'DAP', selector: (row: any) => row.dap_count ? `${row.dap_count} Days` : '', width: 'w-2/12' },
    { name: 'Status',
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
          <Button variant='solid'
            bg={'secondary'}
            borderRadius={'full'}
            color='white'
            _hover={{ bg: 'secondary_hover' }}
            size={'sm'}
            onClick={() => handleViewDetail(row.controller_id, 'controller')}>
            View Detail
          </Button>
        </>
      ),
      width: 'w-1/12'
    },
  ];

  //kolom Template
  const templateColumns = [
    { name: '#No', selector: (row: any, idx: number) => idx + 1, width: 'w-1/6' },
    { name: 'Template Name', selector: (row: any) => row.name, width: 'w-2/6' },
    { name: 'DAP', selector: (row: any) => row.dap_count ? `${row.dap_count} Days` : '', width: 'w-1/6' },
    {
      name: 'Template List',
      selector: (row: any) => (
        <>
          {row.is_active
            ? renderTemplateList(row.config_ec_dap)
            : renderGeneratedTemplateList(row.config_ec_dap, row.is_active)}
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
          dap_count: '',
          is_active: true
        }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title='Add New Controller'
      >
        <FormItem.ClusterDropdown name="cluster_id" placeholder="Cluster" />
        <FormItem.TemplateDropdown name="template_id" placeholder="Template" />
        <FormItem.Input name="dap_count" type="number" placeholder="DAP" />
      </AddModal>

      {/* Modal Tambah Template Baru */}
      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setIsManualInput(false); setIsGenerateAI(false); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!isManualInput && !isGenerateAI ? (
              <Flex direction="column" alignItems="center">
                <Button colorScheme="blue" variant="outline" mb="5" w="60%" borderRadius="20px" onClick={() => setIsManualInput(true)}> Input Manual </Button>
                <Button colorScheme="blue" variant="outline" mb="9" w="60%" borderRadius="20px" onClick={() => setIsGenerateAI(true)}> Generate Dengan AI </Button>
              </Flex>
            ) : isManualInput ? (
              <AddTemplateForm handleAddTemplateOrAI={handleAddTemplateOrAI}/>
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
      </div>
    </DashboardLayout>
  );
};

export default ControllerPage;

