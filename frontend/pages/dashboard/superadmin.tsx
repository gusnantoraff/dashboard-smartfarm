import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/Dashboard.layout';
import { Box, Text, SimpleGrid, Icon, Button, Badge } from '@chakra-ui/react';
import { FiInfo, FiCpu } from 'react-icons/fi';
import axios from 'axios';
import DeleteButton from '@/components/DeleteButton';
import Table from '@/components/Table';
import { ClusterDetail } from '@/components/ClusterDetail';
import Link from '@/components/Link';
import { Template } from '@/hooks/useTemplate';
import TemplateDetail from '@/components/TemplateDetail';

interface Cluster {
  cluster_id: string;
  name: string;
  timezone: string;
  latitude: string;
  longitude: string;
  owner: string;
  devicesCount: number;
}

const SuperadminDashboard = () => {
  const [totalDevices, setTotalDevices] = useState<number>(0);
  const [totalClusters, setTotalClusters] = useState<number>(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const fetchTotalClusters = async () => {
    try {
      const clustersResponse = await axios.get('http://localhost:4000/clusters/all');
      const clustersData = clustersResponse.data;
      setTotalClusters(clustersData.length);
    } catch (error) {
      console.error('Error fetching clusters data:', error);
    }
  };

  const fetchTotalDevices = async () => {
    try {
      const controllersResponse = await axios.get('http://localhost:4000/controllers/all');
      const controllersData = controllersResponse.data;
      setTotalDevices(controllersData.length);
    } catch (error) {
      console.error('Error fetching controllers data:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const templatesResponse = await axios.get('http://localhost:4000/templates/all');
      const templatesData = templatesResponse.data;
    const templatesWithCount = templatesData.map((template: Template) => ({
      ...template,
      controllerCount: template.controllers.length,
    }));
    setTemplates(templatesWithCount);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };


  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    take: 10,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [selectedClusterDetail, setSelectedClusterDetail] = useState<Cluster | null>(null);
  const [isClusterTableVisible, setIsClusterTableVisible] = useState(false);
  const [isControllerTableVisible, setIsControllerTableVisible] = useState(false);
  const [data, setData] = useState<any[]>([]);

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
    }
  };

  useEffect(() => {
    fetchTotalClusters();
    fetchTotalDevices();
    fetchClusters();
    fetchControllers();
    fetchTemplates();
  }, [pagination.page]);

  const toggleClusterTable = () => {
    setIsClusterTableVisible(!isClusterTableVisible);
  };

  const toggleControllerTable = () => {
    setIsControllerTableVisible(!isControllerTableVisible);
  };

  const toggleProduct = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const fetchClusters = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/clusters/`, {
        params: {
          page: pagination.page,
          take: pagination.take,
        },
      });

      const { data, meta } = response.data;

      if (Array.isArray(data)) {
        setClusters(data);
        setPagination(meta);
      }
    } catch (error) {
      console.error('Error fetching clusters:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page,
    }));
  };

  const handleDeleteCluster = async (selectedClusterId: string) => {
    if (selectedClusterId) {
      try {
        await axios.delete(`http://localhost:4000/clusters/${selectedClusterId}`);
        const updatedClusters = clusters.filter(cluster => cluster.cluster_id !== selectedClusterId);
        setClusters(updatedClusters);
      } catch (error) {
        console.error('Error deleting cluster:', error);
      }
    }
  };

  const handleViewDetail = (cluster: Cluster) => {
    setSelectedClusterDetail(cluster);
  };

  const handleViewDetailController = (id: string, type: 'template' | 'controller') => {
    // logika view detail
    console.log(`View details of ${type} with id: ${id}`);
  };

  const columns = [
    {
      name: '# NO', selector: (_: any, idx: number) => {
        const page = pagination.page || 1;
        const limit = pagination.take || 10;
        const offset = (page - 1) * limit;
        return String(idx + 1 + offset).padStart(2, '0');
      },
    },
    { name: 'Cluster Name', selector: (row: Cluster) => row.name },
    { name: 'Timezone', selector: (row: Cluster) => row.timezone },
    { name: 'Latitude', selector: (row: Cluster) => row.latitude },
    { name: 'Longitude', selector: (row: Cluster) => row.longitude },
    { name: 'Owner', selector: (row: Cluster) => row.owner },
    {
      name: 'Action',
      selector: (row: Cluster) => (
        <>
          <Button variant='solid'
            bg={'secondary'}
            borderRadius={'full'}
            color='white'
            _hover={{ bg: 'secondary_hover' }}
            size={'sm'}
            onClick={() => handleViewDetail(row)}
            mr={1}
          >
            View Detail
          </Button>
          <DeleteButton
            title='Delete Cluster'
            onDelete={() => handleDeleteCluster(row.cluster_id)}
          />
        </>
      ),
    },
  ];

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
    { name: 'DAP', selector: (row: any) => row.dap_count ? `${row.dap_count} Days` : '', width: 'w-2/12' },
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
            onClick={() => handleViewDetailController(row.controller_id, 'controller')}>
            View Detail
          </Button>
          </Link>
        </>
      ),
      width: 'w-1/12'
    },
  ];

  return (
    <DashboardLayout
      header={
        <div className='w-full flex flex-col'>
          <div className='flex gap-1 text-sm'>
            <span>Home</span>
            <span>/</span>
            <Link href='/dashboard'>Dashboard</Link>
          </div>
        </div>
      }
    >
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={5} mb={5}>
        <Box
          p={5}
          shadow='md'
          borderWidth='1px'
          borderRadius='md'
          textAlign='center'
        >
          <div className='w-full flex justify-between items-center'>
            <Icon as={FiCpu} boxSize={4} color='gray' />
            <Text fontSize='l' fontWeight='bold' color='black'>Device Total</Text>
            <Icon as={FiInfo} boxSize={4} color='black' cursor='pointer' onClick={toggleControllerTable} />
          </div>
          <Text fontSize='2xl' fontWeight='bold' color='blue.500'>{totalDevices}</Text>
        </Box>
        <Box
          p={5}
          shadow='md'
          borderWidth='1px'
          borderRadius='md'
          textAlign='center'
        >
          <div className='w-full flex justify-between items-center'>
            <Icon as={FiCpu} boxSize={4} color='gray' />
            <Text fontSize='l' fontWeight='bold' color='black'>Cluster Total</Text>
            <Icon as={FiInfo} boxSize={4} color='black' cursor='pointer' onClick={toggleClusterTable} />
          </div>
          <Text fontSize='2xl' fontWeight='bold' color='blue.500'>{totalClusters}</Text>
        </Box>
        {templates.map((template, index) => (
          <Box
            key={template.template_id}
            p={5}
            shadow='md'
            borderWidth='1px'
            borderRadius='md'
            textAlign='center'
          >
            <div className='w-full flex justify-between items-center'>
              <Icon as={FiCpu} boxSize={4} color='gray' />
              <Text fontSize='l' fontWeight='bold' color='black'>{template.name}</Text>
              <Icon as={FiInfo} boxSize={4} color='black' cursor='pointer'  onClick={() => toggleProduct(template.template_id)} />
            </div>
            <Text fontSize='2xl' fontWeight='bold' color='blue.500'>{template.controllerCount}</Text>
          </Box>
        ))}
        {selectedTemplateId && (
        <TemplateDetail id={selectedTemplateId} />
      )}

      </SimpleGrid>
      {isClusterTableVisible && (
        <Table
          columns={columns}
          data={clusters}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
      {selectedClusterDetail && (
        <ClusterDetail
          clusterId={selectedClusterDetail.cluster_id}
          name={selectedClusterDetail.name}
          timezone={selectedClusterDetail.timezone}
          latitude={selectedClusterDetail.latitude}
          longitude={selectedClusterDetail.longitude}
          owner={selectedClusterDetail.owner}
        />
      )}
      {isControllerTableVisible && (
        <Table
          columns={controllerColumns}
          data={data}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </DashboardLayout>
  );
};

export default SuperadminDashboard;
