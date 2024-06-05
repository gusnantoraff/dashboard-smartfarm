import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/layouts/Dashboard.layout';
import { Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, AlertDialogCloseButton } from '@chakra-ui/react';
import SearchInput from '@/components/SearchInput';
import axios from 'axios';
import Table from '@/components/Table';
import { ClusterDetail } from '@/components/ClusterDetail'; // Import ClusterDetail component
import FilterDropdown from '@/components/FilterDropdown';
import { HStack } from '@chakra-ui/react';
import DeleteButton from '@/components/DeleteButton';

interface Cluster {
  cluster_id: string;
  name: string;
  timezone: string;
  latitude: string;
  longitude: string;
  owner: string;
  devicesCount: number;
}

const ClusterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    take: 10,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [formData, setFormData] = useState<Cluster>({
    cluster_id: '',
    name: '',
    timezone: '',
    latitude: '',
    longitude: '',
    devicesCount: 0,
    owner: ''
  });

  const cancelRef = useRef<HTMLButtonElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedClusterDetail, setSelectedClusterDetail] = useState<Cluster | null>(null);
  const [error, setError] = useState('');

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    fetchClusters();
  }, [pagination.page]);

  const fetchClusters = async () => {
    try {
      let allClusters: Cluster[] = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
      const response = await axios.get(`http://localhost:4000/clusters/`, {
        params: {
          page: currentPage,
          take: pagination.take,
         },
      });

      const { data, meta } = response.data;

      if (Array.isArray(data)) {
        allClusters = [...allClusters, ...data]; 
        totalPages = meta.pageCount;
        currentPage++;
        setPagination(meta);
      }  else {
        setError('Invalid data format');
        return;
      }
    }
    setClusters(allClusters);
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

  const handleAddCluster = async (formData: Cluster) => {
    try {
      const response = await axios.post(`http://localhost:4000/clusters/`, formData);
      setClusters([...clusters, response.data]);
      toggleModal();
    } catch (error) {
      console.error('Error adding cluster:', error);
    }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    handleAddCluster(formData);
    setFormData({ cluster_id: '', name: '', timezone: '', latitude: '', longitude: '', devicesCount: 0, owner: '' });
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleViewDetail = (cluster: Cluster) => {
    setSelectedClusterDetail(cluster);
  };

  /*const filteredClusters = clusters.filter(cluster =>
    cluster.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );*/

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

  return (
    <DashboardLayout>
      <div className='bg-white rounded-lg p-6'>
        <Flex justifyContent='space-between' alignItems='center' mb='24px'>
          <HStack spacing='1rem' w={{ base: 'full', md: '50%', lg: '60%' }}>
            <SearchInput placeholder='Search Cluster Name' onSearch={handleSearch} />
              <FilterDropdown modelKey='cluster_id' placeholder='Cluster' bg='other.02' />
          </HStack>
          <Button
            onClick={toggleModal}
            variant='solid'
            bg='primary'
            color='white'
            _hover={{ bg: 'primary_hover' }}
          >
            Add New Cluster
          </Button>
        </Flex>
        <Table
          columns={columns}
          data={clusters}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Cluster</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Cluster Name</FormLabel>
              <Input type='text' name='name' value={formData.name} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Timezone</FormLabel>
              <Select name='timezone' value={formData.timezone} onChange={handleChange}>
                <option value='' disabled>Timezone</option>
                <option value='ASIA_JAKARTA'>Asia/Jakarta</option>
                <option value='ASIA_MAKASSAR'>Asia/Makassar</option>
                <option value='ASIA_JAYAPURA'>Asia/Jayapura</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Latitude</FormLabel>
              <Input type='number' name='latitude' value={formData.latitude} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Longitude</FormLabel>
              <Input type='number' name='longitude' value={formData.longitude} onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='outline' mr={3} onClick={toggleModal}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
    </DashboardLayout>
  );
};

export default ClusterPage;
