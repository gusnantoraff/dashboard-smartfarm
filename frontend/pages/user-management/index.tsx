import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/layouts/Dashboard.layout';
import {
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
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

interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
}

const UserManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<User>({
    user_id: '',
    name: '',
    email: '',
    role: '',
  });
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchUsers = async () => {
    try {
      let url = 'http://localhost:4000/users';

      if (activeTab === 'Superadmin') {
        url = 'http://localhost:4000/users?role=superadmin';
      } else if (activeTab === 'Admin') {
        url = 'http://localhost:4000/users?role=admin';
      } else if (activeTab === 'User') {
        url = 'http://localhost:4000/users?role=user';
      }

      const response = await axios.get(url);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
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

  const handleDeleteUser = async () => {
    if (selectedUserId) {
      try {
        await axios.delete(`http://localhost:4000/users/${selectedUserId}`);
        const updatedUsers = users.filter(user => user.user_id !== selectedUserId);
        setUsers(updatedUsers);
        setIsConfirmationOpen(false);
      } catch (error) {
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

  const handleOpenConfirmation = (user_id: string) => {
    setSelectedUserId(user_id);
    setIsConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setSelectedUserId(null);
    setIsConfirmationOpen(false);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleViewDetail = (user: User) => {
    setSelectedUserDetail(user);
    toggleModal();
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    user.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    user.role.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const renderUsersByRole = (role: string) => {
    if (role === 'All') {
      return filteredUsers;
    } else {
      return filteredUsers.filter(user => user.role.includes(role.toLowerCase()));
    }
  };

  return (
    <DashboardLayout >
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

      <Tabs colorScheme="blue" onChange={index => setActiveTab(index === 0 ? 'All' : ['Superadmin', 'Admin', 'User'][index - 1])}>
        <TabList>
          <Tab>All</Tab>
          <Tab>Superadmin</Tab>
          <Tab>Admin</Tab>
          <Tab>User</Tab>
        </TabList>
        <TabPanels>
          {['All', 'Superadmin', 'Admin', 'User'].map((role, index) => (
            <TabPanel key={index}>
              <Table variant="simple" mt="4">
                <Thead>
                  <Tr>
                    <Th># No</Th>
                    <Th>Name</Th>
                    <Th>Role</Th>
                    <Th>Email</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {renderUsersByRole(role).map((user, index) => (
                    <Tr key={user.user_id}>
                      <Td>{index + 1}</Td>
                      <Td>{user.name}</Td>
                      <Td>{user.role}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <Button size="sm" colorScheme="blue" onClick={() => handleViewDetail(user)}>View</Button>
                        <Button size="sm" colorScheme="red" ml="2" onClick={() => handleOpenConfirmation(user.user_id)}>Delete</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
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
                <option value="superadmin">Superadmin</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
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

      <AlertDialog
        isOpen={isConfirmationOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseConfirmation}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Delete</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this user?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseConfirmation}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteUser} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default UserManagementPage;
