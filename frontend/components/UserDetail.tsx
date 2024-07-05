import React, { useEffect, useState } from 'react';
import DetailModal from './DetailModal';
import { User } from '@/hooks/useUser';
import { Modal, ModalContent, ModalOverlay, Tag, Text } from '@chakra-ui/react';
import Table from './Table';
import { Memberships } from '@/types';
import { useRouter } from 'next/router';
import SkeletonComponent from './Skeleton';
import axios from 'axios';

type Props = {
  userId: string | undefined | string[];
  onClose: () => void;
};
  
const membershipColumns = [
  {
    name: '# No',
    selector: (_: Memberships, idx: number) => String(idx + 1).padStart(2, '0'),
    width: 'w-[20%]',
  },
  {
    name: 'Cluster',
    selector: (row: Memberships) => row.cluster.name,
    width: 'w-[30%]',
  },
  {
    name: 'Invite By',
    selector: (row: Memberships) => row.invited_by,
    width: 'w-[30%]',
  },
  {
    name: 'Status',
    selector: (row: Memberships) => {
      if (row.is_active) {
        return <Tag colorScheme='green'>Active</Tag>;
      } else {
        return <Tag colorScheme='red'>Inactive</Tag>;
      }
    },
    width: 'w-[20%]',
  },
];

export default function UserDetail({ userId, onClose }: Props) {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    take: 10,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const handlePageChange = (page: number) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page,
    }));
  };

  const [users, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchUser = async () => {
    if (userId) {
      setLoading(true);
      try {
        const userResponse = await axios.get(`http://localhost:4000/users/${userId}`);
        setUser(userResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  console.log('userid',userId);
  console.log('data', users);

  useEffect(() => {
    if (userId) {
        fetchUser();
    }
  }, [userId]);

  const handleModalClose = () => {
    onClose();
    router.push('/user-management');
  };


  if (error) {
    return (
      <Modal isOpen={!!userId} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent display={'flex'} justifyContent={'center'} p='40px' minW='688px'>
          There is an error while fetching user data, please try again later.
        </ModalContent>
      </Modal>
    );
  }

  if (loading) {
    return <SkeletonComponent />;
  }

  const user = users as User;

  return (
    <DetailModal
      close={handleModalClose}
      open={!!userId}
      initialVal={{
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      }}
      title={`${user.role} DETAIL`}
      subtitle={`DETAIL ${user.role} OS SMART FARM`}
    >
      <DetailModal.Data label='ID User' value={user.user_id} />
      <DetailModal.Data
        editable
        name='name'
        label='Nama User'
        value={user.name}
        gray
      />
      <DetailModal.Data
        name='email'
        editable
        label='E-mail'
        value={user.email}
      />
      <DetailModal.Data
        editable
        name='role'
        label='Role User'
        value={user.role}
        gray
      />
          <DetailModal.Border />
          <Text fontWeight={500} fontSize={'16px'} color={'primary'} my='10px'>
            MEMBERSHIPS
          </Text>
          <Table
            data={user.memberships || []}
            columns={membershipColumns}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
    </DetailModal>
  );
}
