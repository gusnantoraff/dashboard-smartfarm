import DeleteButton from '@/components/DeleteButton';
import SearchInput from '@/components/SearchInput';
import SkeletonComponent from '@/components/Skeleton';
import Table from '@/components/Table';
import DashboardLayout from '@/layouts/Dashboard.layout';
import { Dictionary } from '@/types/DictionaryType';
import { Button, Flex, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Data palsu sebagai contoh
const fakeData = {
  ListUsers: {
    count: [
      { role: 'SUPER_ADMIN', total: 1 },
      { role: 'ADMIN', total: 1 },
      { role: 'USER', total: 2 }
    ],
    listUser: {
      users: [
        { id: '1', name: 'Liana Bavira', role: 'SUPER_ADMIN', email: 'lianavira@gmail.com' },
        { id: '2', name: 'Dean Lonny', role: 'ADMIN', email: 'deanlonny@gmail.com' },
      ],
      total: 1,
      totalPage: 5
    }
  }
};

export default function UserManagement({}) {
  const router = useRouter();
  const [data, setData] = useState(fakeData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const deleteUser = async (userId: string) => {
    try {
      console.log(`Menghapus pengguna dengan ID: ${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true); 
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(fakeData); 
        setError(null); 
      } catch (error) {
        setError(String(error)); 
      } finally {
        setLoading(false);
      }
    }
    fetchData(); 
  }, [pagination]);

  
  const columns: Dictionary = {
    SUPER_ADMIN: [
      { name: '#', selector: (row: any, idx: number) => String(idx + 1), width: 'w-[10%]' },
      { name: 'Name', selector: (row: any) => row.name, width: 'w-[20%]' },
      { name: 'Email', selector: (row: any) => row.email, width: 'w-[20%]' },
      { name: 'Cluster', selector: (row: any) => row.cluster, width: 'w-[20%]' }, 
      {
        name: 'Action',
        selector: (row: any) => (
          <span className='flex gap-2'>
            <Button onClick={() => handleApprove(row.id)} size={'sm'} variant='solid' bg={'blue.500'} borderRadius={'full'} color='white' _hover={{ bg: 'green.600' }}>Approve</Button> {/* Mengubah tombol menjadi Approve */}
            <Button onClick={() => handleReject(row.id)} size={'sm'} variant='solid' bg={'red.500'} borderRadius={'full'} color='white' _hover={{ bg: 'red.600' }}>Reject</Button> {/* Mengubah tombol menjadi Reject */}
          </span>
        ),
        width: 'w-[30%]'
      }
    ],
  };
  
  const handleApprove = (userId: string) => {
    console.log(`Menyetujui pengguna dengan ID: ${userId}`);
  };

  const handleReject = (userId: string) => {
    console.log(`Menolak pengguna dengan ID: ${userId}`);
  };

  return (
    <DashboardLayout>
      <div className='bg-white rounded-lg p-6'>
        <Flex h='full' justifyContent='space-between' alignItems='center' mb={'24px'}>
          <HStack h='full' spacing='1rem' w={{ base: 'full', md: '50%', lg: '60%' }}>
          <SearchInput placeholder='Search User' setPagination={(value) => setPagination({...value, limit: 10})} />
          </HStack>
        </Flex>

        {error && (
          <Text textAlign={'center'} letterSpacing={'-0.39 px'} lineHeight={'19.07px'} fontSize={'14px'} color='status.error' fontWeight={400} mt={2}>
            {error}
          </Text>
        )}
        {loading ? (
          <SkeletonComponent />
        ) : (
          <>
            <Tabs isLazy index={0}>
              <TabPanels mt='8px'>
                {data.ListUsers.count.map((item: any, idx: number) => (
                  <TabPanel key={idx} p={0}>
                    <Table loading={loading} columns={columns[item.role]} data={data.ListUsers.listUser.users} pagination={pagination} setPagination={setPagination} />
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </>
        )}
      </div>
      {}
    </DashboardLayout>
  );
}
