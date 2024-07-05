import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/Dashboard.layout';
import {
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import SearchInput from '@/components/SearchInput';
import axios from 'axios';
import DeleteButton from '@/components/DeleteButton';
import Table from '@/components/Table';
import DetailModal from '@/components/DetailModal';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import AddModal from '@/components/AddModal';
import FormItem from '@/components/FormItem';
import moment from 'moment-timezone';
import UserDetail from '@/components/UserDetail';

interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
}

type AddMemberValues = {
  cluster_id: string;
  user_id: string;
};

const UserManagementPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    take: 10,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Superadmin');
  const [errorPopup, setErrorPopup] = useState(false);
  const token = Cookies.get('token');
  const [isOpen, setIsOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);


  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
    if (id) {
      setSelectedUserId(id as string);
  }
  }, [id, activeTab, pagination.page]);

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

  const fetchUsers = async () => {
    try {
      let url = 'http://localhost:4000/users';

      if (activeTab === 'Superadmin') {
        url = 'http://localhost:4000/users?role=SUPER_ADMIN';
      } else if (activeTab === 'Admin') {
        url = 'http://localhost:4000/users?role=ADMIN';
      } else if (activeTab === 'User') {
        url = 'http://localhost:4000/users?role=USER';
      }

      const response = await axios.get(url, {
        params: {
          page: pagination.page,
          take: pagination.take,
        },
      });
      const { data, meta } = response.data;

      if (Array.isArray(data)) {
        setUsers(data);
        setPagination(meta);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleTabChange = (index: number) => {
    switch (index) {
      case 0:
        setActiveTab('Superadmin');
        break;
      case 1:
        setActiveTab('Admin');
        break;
      case 2:
        setActiveTab('User');
        break;
      default:
        setActiveTab('Superadmin');
        break;
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page,
    }));
  };

  const handleAddMember = async (values: AddMemberValues) => {
    setSubmitLoading(true);
    try {
      const response = await fetch('http://localhost:4000/memberships/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      setSubmitLoading(false);

      if (!response.ok) {
        throw new Error('Failed to add member');
      }
      console.log('Member added successfully');

      setIsOpen(false);
    } catch (error) {
      console.error('Error adding member');
    }
  };


  const handleDeleteUser = async (selectedUserId: string) => {
    if (selectedUserId) {
      try {

        if (!token) {
          console.error('No token available');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(`http://localhost:4000/users/${selectedUserId}`, config);
        const updatedUsers = users.filter(user => user.user_id !== selectedUserId);
        setUsers(updatedUsers);
      } catch (error) {
        setErrorPopup(true);
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleViewDetail = (user: User) => {
    setSelectedUserDetail(user);
  };

  const renderUsersByRole = (role: string) => {
    if (role === 'All') {
      return users;
    } else {
      return users.filter(user => user.role.includes(role.toUpperCase()));
    }
  };

  const columns = [
    {
      name: '# No',
      selector: (_: any, idx: number) => {
        const page = pagination.page || 1;
        const limit = pagination.take || 10;
        const offset = (page - 1) * limit;
        return String(idx + 1 + offset).padStart(2, '0');
      },
    },
    { name: 'Name', selector: (row: User) => row.name },
    { name: 'Role', selector: (row: User) => row.role },
    { name: 'Email', selector: (row: User) => row.email },
    {
      name: 'Action',
      selector: (row: User) => (
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
          <DeleteButton title='Delete User' onDelete={() => handleDeleteUser(row.user_id)} />
        </>
      ),
    },
  ];


  const handleUserDetailClose = () => {
    setSelectedUserId(null);
  };

  const onClose = () => {
    router.reload();
  };

  const user = selectedUserDetail || {} as User;

  return (
    <DashboardLayout >
      <div className='bg-white rounded-lg p-6'>
        <Flex justifyContent="space-between" alignItems="center" mb="24px" bg="white">
          <HStack spacing="1rem" w={{ base: 'full', md: '50%', lg: '60%' }}>
            <SearchInput placeholder="Search User" onSearch={handleSearch} />
          </HStack>
          <Button
            onClick={() => setIsOpen(true)}
            variant='solid'
            bg='primary'
            color='white'
            _hover={{ bg: 'primary_hover' }}
          >
            Add New Member
          </Button>
        </Flex>
      </div>
      <Tabs colorScheme="blue" onChange={handleTabChange}>
        <TabList>
          <Tab>Superadmin</Tab>
          <Tab>Admin</Tab>
          <Tab>User</Tab>
        </TabList>
        <TabPanels>
          {['SUPER_ADMIN', 'ADMIN', 'USER'].map((role, index) => (
            <TabPanel key={index}>
              <Table
                columns={columns}
                data={renderUsersByRole(role)}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      <AddModal
        loading={submitLoading}
        onSubmit={handleAddMember}
        schema={{
          cluster_id: '',
          user_id: '',
          is_owner: false,
          is_first_owner: false,
          is_active: true,
          invited_by: currentUser?.name,
          invited_at: new Date(moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')),
          status: "active"
        }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title='Add New Member'
      >
        <FormItem.ClusterDropdown name="cluster_id" placeholder="Cluster" />
        <FormItem.UserDropdown name="user_id" placeholder="User" />
      </AddModal>

      <DetailModal
        close={onClose}
        open={!!selectedUserDetail}
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
      </DetailModal>

      <Modal isOpen={errorPopup} onClose={() => setErrorPopup(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            You do not have permission to perform this action.
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setErrorPopup(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {selectedUserId && <UserDetail userId={selectedUserId} onClose={handleUserDetailClose}/>}

    </DashboardLayout>
  );
};

export default UserManagementPage;
