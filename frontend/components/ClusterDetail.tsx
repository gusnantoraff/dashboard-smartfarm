import React, { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQueryCluster } from '@/hooks/useCluster';
import SkeletonComponent from './Skeleton';
import { DetailCluster, DetailController, Memberships } from '@/types';
import DetailItem from './Detailitem';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import Table, { Columns } from './Table';
import dayjs from 'dayjs';
import Link from 'next/link';
import SearchInput from './SearchInput';

type Props = {
  name: string;
  clusterId?: string | undefined | string[];
  timezone: string;
  latitude: string;
  longitude: string;
  owner: string;
};

// Definisi kolom untuk tabel controller
const controllerColumns: Columns[] = [
  {
    name: '#',
    selector: (_: DetailController, idx: number) => idx + 1,
    className: 'text-center',
  },
  {
    name: 'Controller Name',
    selector: (row: DetailController) => row.name.split('/')[1] ?? '',
  },
  {
    name: 'Device Added',
    selector: (row: DetailController) =>
      dayjs(row.createdAt).format('DD-MM-YYYY HH:mm'),
  },
  {
    name: 'Status',
    selector: (row: DetailController) => {
      return row.isActive ? (
        <Badge className='w-full text-center' variant={'active'}>
          Active
        </Badge>
      ) : (
        <Badge className='w-full text-center' variant={'inactive'}>
          Deactived
        </Badge>
      );
    },
  },
  {
    name: 'Action',
    selector: (row: DetailController) => {
      return (
        <Link target='_blank' href={`/controller/${row.id}`}>
          <Button
            variant='solid'
            bg={'secondary'}
            borderRadius={'full'}
            color='white'
            _hover={{ bg: 'secondary_hover' }}
            size={'sm'}
          >
            View Detail
          </Button>
        </Link>
      );
    },
  },
];

// Definisi kolom untuk tabel membership
const membershipColumns: Columns[] = [
  {
    name: '#',
    selector: (_: Memberships, idx: number) => idx + 1,
    className: 'text-center',
  },
  {
    name: 'Member Name',
    selector: (row: Memberships) => row.userId,
  },
  {
    name: 'Role Member',
    selector: (row: Memberships) => {
      if (row.isOwner || row.isFirstOwner) {
        return 'Cluster Owner';
      }
      return 'Common Member';
    },
  },
  {
    name: 'Invite By',
    selector: (row: Memberships) => row.invitedBy,
  },
  {
    name: 'Status',
    selector: (row: Memberships) => {
      return row.isActive ? (
        <Badge className='w-full text-center' variant={'active'}>
          Active
        </Badge>
      ) : (
        <Badge className='w-full text-center' variant={'inactive'}>
          Deactived
        </Badge>
      );
    },
  },
  {
    name: 'Action',
    selector: (row: Memberships) => {
      return (
        <Link target='_blank' href={`/user-management?id=${row.id}`}>
          <Button
            variant='solid'
            bg={'secondary'}
            borderRadius={'full'}
            color='white'
            _hover={{ bg: 'secondary_hover' }}
            size={'sm'}
          >
            View Detail
          </Button>
        </Link>
      );
    },
  },
];

// Komponen utama ClusterDetail
const ClusterDetail = ({
  name,
  timezone,
  latitude,
  longitude,
  clusterId
}: Props) => {
  const [tabIdx, setTabIdx] = useState(0);
  const [filtered, setFiltered] = useState<any>({
    controller: null,
    membership: null,
  });
  const { data, loading, error } = useQueryCluster('GET_ONE', {
    variables: { cluster_id: clusterId },
  });
  const router = useRouter();

  // Fungsi untuk menutup modal
  const onClose = () => {
    // Jika ada `clusterId`, arahkan kembali ke halaman cluster
    if (clusterId) {
      router.reload();
    }
  };

  // Penanganan kesalahan
  if (error) {
    return (
      <Modal isOpen={!!clusterId} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          display={'flex'}
          justifyContent={'center'}
          p='40px'
          minW='688px'
        >
          There is an error while fetching cluster data, please try again later.
        </ModalContent>
      </Modal>
    );
  }

  // Loading
  if (loading) {
    return (
      <Modal isOpen={!!clusterId} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p='40px' minW='688px'>
          <ModalHeader
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            px='0'
            pt='0'
            pb={'24px'}
            mb={'24px'}
            borderBottom={'1px'}
            borderBottomColor={'#C4C4C480'}
          >
            <Box>
              <Text fontSize={'20px'} color={'primary'} fontWeight={600}>
                CLUSTER DETAIL
              </Text>
              <Text fontSize={'14px'} color={'text.02'} fontWeight={500}>
                Loading...
              </Text>
            </Box>
            <Image
              onClick={onClose}
              src='/icons/modal_close.svg'
              width={32}
              height={32}
              alt='close'
              className='cursor-pointer bg-transparent hover:bg-slate-100 transition-all duration-100 ease-in-out rounded-full'
            />
          </ModalHeader>

          <ModalBody p='0'>
            <SkeletonComponent />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  // Mendapatkan data cluster dan memberships
  const cluster = data?.DetailCluster as DetailCluster;
  const memberships = cluster?.memberships as Memberships[];
  const owner = memberships?.find((m) => m.isOwner)?.userId;

  // Render hasil
  return (
    <Modal isOpen={!!clusterId} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p='40px' minW='688px'>
        <ModalHeader
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          px='0'
          pt='0'
          pb={'24px'}
          mb={'24px'}
          borderBottom={'1px'}
          borderBottomColor={'#C4C4C480'}
        >
          <Box>
            <Text fontSize={'20px'} color={'primary'} fontWeight={600}>
              CLUSTER DETAIL
            </Text>
            <Text fontSize={'14px'} color={'text.02'} fontWeight={500}>
              Detail Cluster {cluster?.name}
            </Text>
          </Box>
          <Button onClick={onClose} bg='transparent' p={0}>
            <Image
              src='/icons/modal_close.svg'
              width={32}
              height={32}
              alt='close'
              className='cursor-pointer bg-transparent hover:bg-slate-100 transition-all duration-100 ease-in-out rounded-full'
            />
          </Button>
        </ModalHeader>

        <ModalBody p='0'>
          <div className='mb-2'>
            <DetailItem label='Cluster Name' value={name} />
            <DetailItem label='Timezone' value={timezone} />
            <DetailItem
              label='Location'
              value={
                <Box
                  as='a'
                  target='_blank'
                  href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                  className='flex items-center gap-x-2'
                  color='secondary'
                  _hover={{
                    color: 'secondary_hover',
                    cursor: 'pointer',
                  }}
                >
                  <span>
                    {latitude}, {longitude}
                  </span>
                  <ExternalLinkIcon />
                </Box>
              }
            />
            <DetailItem label='Cluster Owner' value={owner} />
          </div>

          <Tabs isLazy index={tabIdx}>
            <TabList
              px='16px'
              borderRadius={'12px'}
              backgroundColor='other.02'
              fontWeight={600}
              color='text.02'
            >
              <Tab
                key={0}
                onClick={() => {
                  setTabIdx(0);
                }}
                py='16px'
                fontSize={'14px'}
                _selected={{
                  color: 'primary',
                  borderBottomWidth: '2px',
                  borderBottomColor: 'primary',
                }}
                display={'flex'}
                gap={'6px'}
              >
                <span>Controller</span>
                <Tag
                  color={tabIdx === 0 ? 'primary' : 'text.02'}
                  fontWeight={600}
                  backgroundColor={tabIdx === 0 ? '#ECF4FE' : '#F2F2F2'}
                  fontSize={'12px'}
                >
                  {cluster?.controllers?.length ?? 0}
                </Tag>
              </Tab>
              <Tab
                key={1}
                onClick={() => {
                  setTabIdx(1);
                }}
                py='16px'
                fontSize={'14px'}
                _selected={{
                  color: 'primary',
                  borderBottomWidth: '2px',
                  borderBottomColor: 'primary',
                }}
                display={'flex'}
                gap={'6px'}
              >
                <span>Memberships</span>
                <Tag
                  color={tabIdx === 1 ? 'primary' : 'text.02'}
                  fontWeight={600}
                  backgroundColor={tabIdx === 1 ? '#ECF4FE' : '#F2F2F2'}
                  fontSize={'12px'}
                >
                  {cluster?.memberships?.length ?? 0}
                </Tag>
              </Tab>
            </TabList>
            <TabPanels mt='8px'>
              <TabPanel key={0} p={0}>
                <div className='w-full'>
                  <SearchInput
                    width='40%'
                    size='md'
                    className='mb-2'
                    placeholder='Search Controller Name'
                    onSearch={(value) => {
                      if (!value) {
                        setFiltered({
                          ...filtered,
                          controller: null,
                        });
                        return;
                      }

                      const newData = cluster?.controllers?.filter((c) =>
                        c.name.toLowerCase().includes(value.toLowerCase()),
                      );

                      setFiltered({
                        ...filtered,
                        controller: newData,
                      });
                    }}
                  />
                </div>
                <Table
                  loading={loading}
                  columns={controllerColumns}
                  data={
                    filtered.controller
                      ? filtered.controller
                      : cluster?.controllers
                  }
                  paginate={false}
                />
              </TabPanel>
              <TabPanel key={1} p={0}>
                <div className='w-full'>
                  <SearchInput
                    size='md'
                    width='40%'
                    className='mb-2'
                    placeholder='Search User Name'
                    onSearch={(value) => {
                      if (!value) {
                        setFiltered({
                          ...filtered,
                          membership: null,
                        });
                        return;
                      }

                      const newData = cluster?.memberships?.filter((c) =>
                        c.userId.toLowerCase().includes(value.toLowerCase()),
                      );

                      setFiltered({
                        ...filtered,
                        membership: newData,
                      });
                    }}
                  />
                </div>
                <Table
                  loading={loading}
                  columns={membershipColumns}
                  data={
                    filtered.membership
                      ? filtered.membership
                      : cluster?.memberships
                  }
                  paginate={false}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { ClusterDetail };
