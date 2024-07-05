import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/Dashboard.layout';
import { Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import SearchInput from '@/components/SearchInput';
import axios from 'axios';
import Table from '@/components/Table';
import FilterDropdown from '@/components/FilterDropdown';
import { HStack } from '@chakra-ui/react';
import DeleteButton from '@/components/DeleteButton';
import { useRouter } from 'next/router';
import { User } from '@/hooks/useUser';
import Cookies from 'js-cookie';
import moment from 'moment-timezone';

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
  const router = useRouter();
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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentUser, setCurrentUser] = useState<User>();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    fetchClusters();
    fetchCurrentUser();
  }, [pagination.page]);

  const token = Cookies.get('token');

  const fetchCurrentUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://localhost:4000/users/me', config);
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };
  console.log('user',currentUser);

  const fetchClusters = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/clusters/`, {
        params: {
          page: pagination.page,
          take: pagination.take,
        }
      });
  
      const { data, meta } = response.data;
  
      if (Array.isArray(data)) {
        setClusters(data);
        setPagination(meta);
      } else {
        console.error('Error fetching clusters:');
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

  const handleAddCluster = async (formData: Cluster) => {
    try {
      const response = await axios.post(`http://localhost:4000/clusters/`,{
        ...formData,
        owner: currentUser?.name 
      });

      await axios.post(`http://localhost:4000/memberships/`, {
        cluster_id: response.data.cluster_id,
        user_id: currentUser?.user_id,
        is_owner: true,
        is_first_owner: true,
        is_active: true,
        invited_by: '',
        invited_at: new Date(moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')),
        status: 'active',
      });

      console.log('form',formData);
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
    router.push(`/cluster/${cluster.cluster_id}`);
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
    </DashboardLayout>
  );
};

export default ClusterPage;
