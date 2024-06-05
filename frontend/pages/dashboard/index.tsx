import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/Dashboard.layout';
import { Box, Button, Image, Skeleton, Text } from '@chakra-ui/react';
import { getLocation } from '@/utils/getLocation';
import { Location } from '@/types/location.type';
import FilterDropdown from '@/components/FilterDropdown';
import { Cluster } from '@/types';
import axios from 'axios';

export default function Dashboard({}) {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedClusterName, setSelectedClusterName] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [loadingCluster, setLoadingCluster] = useState<boolean>(true);

  const fetchClusterData = async (clusterId: string) => {
    try {
      const response = await axios.get(`http://localhost:4000/clusters/${clusterId}`);
      console.log('data:',response);
      return response.data;
    } catch (error) {
      console.error('Error fetching cluster data:', error);
      return null;
    }
  };

  const getClusterLocation = async (cluster: Cluster) => {
    const loc = await getLocation(cluster.latitude, cluster.longitude);

    if (loc && selectedCluster) {
      setLocation(loc);
      setLoadingLocation(false);
    } else {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    if (selectedCluster) {
      setLoadingCluster(true);
      fetchClusterData(selectedCluster)
        .then(clusterData => {
          if (clusterData) {
            getClusterLocation(clusterData);
            setSelectedClusterName(clusterData.name);
          }
          setLoadingCluster(false);
        });
    }
  }, [selectedCluster]);

  return (
    <DashboardLayout
      header={
        <div className='w-full flex justify-between'>
          <div className='flex flex-col gap-1'>
            <Skeleton
              isLoaded={!loadingCluster}
              width={loadingCluster ? 240 : 'auto'}
              height={loadingCluster ? '36px' : 'auto'}
            >
              <Text fontWeight={600} fontSize={24}>
              {selectedClusterName  || 'Pilih Cluster'}
              </Text>
            </Skeleton>
            {!selectedCluster ? (
              <Box height={5} />
            ) : (
              <Skeleton
                isLoaded={!loadingLocation}
                width={loadingLocation ? 300 : 'auto'}
                height={loadingLocation ? 5 : 'auto'}
              >
                <div className='flex gap-1 items-center'>
                  <Image alt='icon' src='/icons/location.svg' />

                  <Text
                    fontSize={14}
                    fontWeight={500}
                    color='#8392AB'
                    className='uppercase'
                  >
                    {location?.address?.county ||
                      location?.address?.town ||
                      location?.address?.city ||
                      'Lokasi tidak ditemukan'}

                    {location?.address?.state
                      ? `, ${location?.address?.state}`
                      : ''}
                  </Text>
                </div>
              </Skeleton>
            )}
          </div>

          <div className='flex gap-2 items-center'>
            <Text fontWeight={600} fontSize={14}>
              Cluster
            </Text>
            <FilterDropdown
              noIcon
              onSelect={(value) => {
                setLoadingLocation(true);
                setSelectedCluster(value);
              }}
              modelKey='cluster_id'
              w='320px'
              h='40px'
            />
            <Button
              onClick={() => {}}
              variant='outline'
              color={'primary'}
              borderColor={'primary'}
              fontSize={'14px'}
              fontWeight={600}
              h={'40px'}
              w='197px'
              disabled={!selectedCluster}
            >
              TAMPILKAN CLUSTER
            </Button>
          </div>
        </div>
      }
    >
      <div>{/* Konten dashboard */}</div>
    </DashboardLayout>
  );
}
