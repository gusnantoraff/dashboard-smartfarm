import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/Dashboard.layout';
import axios from 'axios';
import { Box, Button, Image, Skeleton, Text } from '@chakra-ui/react';
import { getLocation } from '@/utils/getLocation';
import { Location } from '@/types/location.type';
import FilterDropdown from '@/components/FilterDropdown';
import ChartCard from '@/components/dashboard/ChartCard';

const AdminDashboard = () => {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedController, setSelectedController] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [loadingController, setLoadingController] = useState<boolean>(true);
  const [cluster, setCluster] = useState<any>(null);
  const [controller, setController] = useState<any>(null);
  const [controllerId, setControllerId] = useState<any>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    take: 10,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const fetchClusterAndControllerData = async () => {
    if (selectedCluster) {
      setLoadingController(true);
      try {
        const clusterResponse = await axios.get(`http://localhost:4000/clusters/${selectedCluster}`);
        setCluster(clusterResponse.data);
        const loc = await getLocation(clusterResponse.data.latitude, clusterResponse.data.longitude);
        setLocation(loc);
        setLoadingLocation(false);
      } catch (error) {
        console.error('Error fetching cluster data:', error);
      }
    }

    if (selectedController) {
      try {
        const controllerResponse = await axios.get(`http://localhost:4000/controllers/${selectedController}`);
        setController(controllerResponse.data);
        setControllerId(controllerResponse.data.controller_id);
        setLoadingController(false);
      } catch (error) {
        console.error('Error fetching controller data:', error);
      }
    }
  };

  useEffect(() => {
    fetchClusterAndControllerData();
  }, [selectedCluster, selectedController]);

 return (
   <DashboardLayout
     header={
       <div className='w-full flex justify-between'>
         <div className='flex flex-col gap-1'>
           <Skeleton
             isLoaded={!loadingLocation}
             width={loadingLocation ? 240 : 'auto'}
             height={loadingLocation ? '36px' : 'auto'}
           >
             <Text fontWeight={600} fontSize={24}>
               {cluster?.name || 'Pilih Cluster'}
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
             disabled={!cluster}
           >
             TAMPILKAN CLUSTER
           </Button>
         </div>
       </div>
     }
   >
     {!(cluster || controller) ? null : (
       <div className='bg-white rounded-lg'>
         <div className='w-full border-b border-b-[#C4C4C4] px-[10px] py-[15px] flex justify-between items-center'>
           <Text fontWeight={600} fontSize={14}>
             Data Cluster
           </Text>
         </div>
           <ChartCard
           clusterId={selectedCluster}
           pagination={pagination}
           onPageChange={handlePageChange}          
           />
       </div>
     )}

     <div></div>
   </DashboardLayout>
 );
};

export default AdminDashboard;
