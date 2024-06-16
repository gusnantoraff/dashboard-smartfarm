import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '@/layouts/Dashboard.layout';
import { ClusterDetail } from '@/components/ClusterDetail';
import { Button, Flex, HStack } from '@chakra-ui/react';
import FilterDropdown from '@/components/FilterDropdown';
import SearchInput from '@/components/SearchInput';
import Table from '@/components/Table';
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

const ClusterDetailPage = () => {
  const router = useRouter();
  const { cluster_id } = router.query;
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    take: 10,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  useEffect(() => {
    if (cluster_id) {
      fetchClusterDetail(cluster_id as string);
    }
    fetchClusters();
  }, [cluster_id,pagination.page]);

  const fetchClusterDetail = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:4000/clusters/${id}`);
      setCluster(response.data);
    } catch (error) {
      console.error('Error fetching cluster details:', error);
    }
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
      } else {
        console.error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching clusters:', error);
    }
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
            mr={1}
          >
            View Detail
          </Button>
          <DeleteButton
            title='Delete Cluster'
            onDelete={() =>(row.cluster_id)}
          />
        </>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page,
    }));
  };

  if (!cluster) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
        <div className='bg-white rounded-lg p-6'>
        <Flex justifyContent='space-between' alignItems='center' mb='24px'>
          <HStack spacing='1rem' w={{ base: 'full', md: '50%', lg: '60%' }}>
            <SearchInput placeholder='Search Cluster Name'/>
              <FilterDropdown modelKey='cluster_id' placeholder='Cluster' bg='other.02' />
          </HStack>
          <Button
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
      <ClusterDetail
        clusterId={cluster.cluster_id}
        name={cluster.name}
        timezone={cluster.timezone}
        latitude={cluster.latitude}
        longitude={cluster.longitude}
        owner={cluster.owner}
      />
    </DashboardLayout>
  );
};

export default ClusterDetailPage;
