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
  FormControl,
  FormLabel,
  Input,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select,
} from '@chakra-ui/react';
import SearchInput from '@/components/SearchInput';
import axios from 'axios';
import DeleteButton from '@/components/DeleteButton';
import Table from '@/components/Table';
import DetailModal from '@/components/DetailModal';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
}

const UserManagementPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    take: 10,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [formData, setFormData] = useState<User>({
    user_id: '',
    name: '',
    email: '',
    role: '',
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Superadmin');
  const [errorPopup, setErrorPopup] = useState(false);
  const token = Cookies.get('token');

  useEffect(() => {
    fetchUsers();
  }, [activeTab, pagination.page]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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

  const handleAddUser = async (formData: User) => {
    try {
      const response = await axios.post('http://localhost:4000/users/', formData);
      setUsers([...users, response.data]);
      toggleModal();
    } catch (error) {
      console.error('Error adding user:', error);
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


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    handleAddUser(formData);
    setFormData({ user_id: '', name: '', email: '', role: '' });
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
            onClick={toggleModal}
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

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mt="4">
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formData.name} onChange={handleChange} />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Role</FormLabel>
              <Select name="role" value={formData.role} onChange={handleChange}>
                <option value="SUPER_ADMIN">Superadmin</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={toggleModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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

    </DashboardLayout>
  );
};

export default UserManagementPage;
