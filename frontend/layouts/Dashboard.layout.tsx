'use client';

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Breadcrumb,
  BreadcrumbItem,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useLocalStorage from '@/hooks/useLocalStorage';
import LinkBox from '@/components/LinkBox';
import Cookies from 'js-cookie';
import Image from 'next/image';
import React from 'react';
import SkeletonComponent from '@/components/Skeleton';

interface LinkItemProps {
  name: string;
  icon: React.ReactElement;
  key: string;
  href: string;
  items?: Array<LinkItemProps>;
}

interface NavItemProps extends FlexProps {
  name?: string;
  icon: React.ReactElement;
  children?: React.ReactNode;
  selected: boolean;
  href: string;
  items?: Array<LinkItemProps>;
}

interface NavChildrenProps extends FlexProps {
  name?: string;
  icon: React.ReactElement;
  children?: React.ReactNode;
  page: string;
  href: string;
  items?: Array<LinkItemProps>;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
  isOpen: boolean;
  pageTitle: string;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  isOpen: boolean;
  pageTitle: string;
}

const LinkItems: Array<LinkItemProps> = [
  {
    name: 'Dashboard',
    icon: (
      <Image
        height={24}
        alt='nav-icon'
        width={24}
        src='/icons/navigation/dashboard.svg'
      />
    ),
    key: 'dashboard',
    href: '/dashboard',
  },
  {
    name: 'Cluster',
    icon: (
      <Image
        height={24}
        alt='nav-icon'
        width={24}
        src='/icons/navigation/cluster.svg'
      />
    ),
    key: 'cluster',
    href: '/cluster',
  },
  {
    name: 'Device / Controller',
    icon: (
      <Image
        height={24}
        alt='nav-icon'
        width={24}
        src='/icons/navigation/device.svg'
      />
    ),
    key: 'controller',
    href: '/controller',
  },
  {
    name: 'User Management',
    icon: (
      <Image
        height={24}
        alt='nav-icon'
        width={24}
        src='/icons/navigation/user.svg'
      />
    ),
    key: '',
    href: '',
    items: [
      {
        name: 'User List',
        icon: (
          <Image
            className='opacity-0'
            height={24}
            alt='nav-icon'
            width={24}
            src='/icons/navigation/user.svg'
          />
        ),
        key: 'user-management',
        href: '/user-management',
      },
      {
        name: 'Approval User',
        icon: (
          <Image
            className='opacity-0'
            height={24}
            alt='nav-icon'
            width={24}
            src='/icons/navigation/user.svg'
          />
        ),
        key: 'approval-user',
        href: '/approval-user',
      },
    ],
  },
];

const UserProfile = () => {
  const { user, loading, removeAllItem } = useLocalStorage('user');

  const router = useRouter();

  const logout = () => {
    removeAllItem();
    Cookies.remove('token');
    Cookies.remove('role');

    router.push('/');
  };

  return (
    <HStack spacing={{ base: '0', md: '6' }}>
      <Flex alignItems={'center'}>
        <Menu>
          <MenuButton
            borderRadius={'full'}
            p={'6px'}
            backgroundColor={'other.01'}
            transition='all 0.3s'
            _focus={{ boxShadow: 'none' }}
          >
            {loading ? (
              <Spinner color='secondary' />
            ) : (
              <HStack gap={'12px'}>
                <Avatar size={'sm'} src={'/images/avatar.svg'} />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems='flex-start'
                  spacing='1px'
                >
                  <Text fontSize='14px' fontWeight={600}>
                    {user?.name}
                  </Text>
                </VStack>
                <Box mr={'8px'} display={{ base: 'none', md: 'flex' }}>
                  <img src='/icons/arrows/Dropdown.svg' />
                </Box>
              </HStack>
            )}
          </MenuButton>
          <MenuList bg={'white'} borderColor={'gray.200'}>
            <MenuItem onClick={logout}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </HStack>
  );
};

const SidebarContent = ({
  onClose,
  isOpen,
  pageTitle,
  ...rest
}: SidebarProps) => {
  return (
    <Box
      zIndex={isOpen ? 50 : 0}
      pointerEvents={isOpen ? 'auto' : 'none'}
      transition='0.2s ease'
      bg={'primary'}
      color={'white'}
      w={{ base: isOpen ? '100vw' : '0px', md: isOpen ? '300px' : '0px' }}
      pos='fixed'
      h='full'
      // hidden={!isOpen}
      opacity={isOpen ? '100%' : '0'}
      {...rest}
    >
      <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
        <Text fontSize='24px' textAlign={'center'} fontWeight='bold' flex={1}>
          OS SMART<span className='text-[#1CDF9B]'>FARM</span>
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Box
        as='nav'
        mt='16px'
        display={'flex'}
        flexDirection={'column'}
        gap='0.5rem'
      >
        {LinkItems.map((link) =>
          link.items ? (
            <NavItemChildren
              name={link.name}
              key={link.name}
              icon={link.icon}
              page={pageTitle.toLowerCase()}
              href={link.href}
              items={link.items}
            />
          ) : (
            <NavItem
              key={link.name}
              icon={link.icon}
              selected={pageTitle.toLowerCase() === link.key}
              href={link.href}
            >
              {link.name}
            </NavItem>
          ),
        )}
      </Box>
    </Box>
  );
};

const NavItemChildren = ({
  name,
  icon,
  items,
  page,
  ...rest
}: NavChildrenProps) => {
  return (
    <Accordion allowMultiple>
      <AccordionItem border={'none'}>
        <AccordionButton
          display={'flex'}
          cursor='pointer'
          _hover={{
            bg: 'secondary',
          }}
          justifyContent={'space-between'}
          w={'268px'}
          transition='0.2s ease'
          mx='4'
          bg={
            items?.some((item) => page === item.key) ? 'secondary' : undefined
          }
          borderRadius='lg'
          p='4'
          // align='center'
          fontWeight={600}
          role='group'
        >
          <Flex className='gap-x-3'>
            {icon && icon}
            {name}
          </Flex>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel display={'flex'} flexDirection={'column'} gap='0.5rem'>
          {items?.map((item, idx) => (
            <LinkBox
              key={`${item.name}-${idx}`}
              href={item.href}
              style={{ textDecoration: 'none' }}
              _focus={{ boxShadow: 'none' }}
            >
              <Flex
                transition='0.2s ease'
                className='gap-x-3'
                align='center'
                fontWeight={600}
                p='4'
                // mx='4'
                borderRadius='lg'
                role='group'
                cursor='pointer'
                _hover={{
                  bg: 'secondary',
                }}
                bg={page === item.key ? 'secondary' : undefined}
                {...rest}
              >
                {item.icon}
                {item.name}
              </Flex>
            </LinkBox>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const NavItem = ({ icon, children, selected, href, ...rest }: NavItemProps) => {
  return (
    <LinkBox
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        transition='0.2s ease'
        className='gap-x-3'
        align='center'
        fontWeight={600}
        p='4'
        mx='4'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        _hover={{
          bg: 'secondary',
        }}
        bg={selected ? 'secondary' : undefined}
        {...rest}
      >
        {icon && icon}
        {children}
      </Flex>
    </LinkBox>
  );
};

const MobileNav = ({ onOpen, isOpen, pageTitle, ...rest }: MobileProps) => {
  return (
    <Flex
      transition={'0.2s ease'}
      ml={{ base: 0, md: isOpen ? '300px' : '0px' }}
      px={{ base: 4, md: 4 }}
      height='20'
      bg={'white'}
      alignItems='center'
      borderBottomWidth='1px'
      borderBottomColor={'gray.200'}
      justifyContent={{ base: 'space-between' }}
      {...rest}
    >
      <Flex align={'center'} gap={'16px'}>
        <IconButton
          display={{ base: 'flex' }}
          onClick={onOpen}
          variant='ghost'
          aria-label='open menu'
          icon={<img src='/icons/Hamburger.svg' />}
        />
        <Text
          color='black'
          display={{ base: 'none', md: 'flex' }}
          fontSize='2xl'
          fontWeight='bold'
        >
          {pageTitle}
        </Text>
      </Flex>

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize='2xl'
        fontFamily='monospace'
        fontWeight='bold'
      >
        {pageTitle}
      </Text>

      <UserProfile />
    </Flex>
  );
};

const DashboardLayout = ({
  children,
  overrideTitle,
  header,
  loading = false,
}: {
  children: React.ReactNode;
  overrideTitle?: string;
  header?: React.ReactNode;
  loading?: boolean;
}) => {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  const router = useRouter();
  const { asPath } = router;

  const capitalize = (s: string): string => {
    if (typeof s !== 'string') return '';

    const sanitizeQuery = s.split('?')[0];

    const sArr = sanitizeQuery.split('-');
    if (sArr.length > 1) {
      return sArr
        .map((str) => {
          return str.charAt(0).toUpperCase() + str.slice(1);
        })
        .join(' ');
    }

    return sanitizeQuery.charAt(0).toUpperCase() + sanitizeQuery.slice(1);
  };

  const breadcrumbs = asPath.split('/').map((crumb) => {
    return crumb === '' ? 'Home' : capitalize(crumb);
  });

  const pathnames = asPath.split('/');
  const pageTitle: string = capitalize(pathnames[1]);

  return (
    <>
      <Head>
        <title>{overrideTitle ? overrideTitle : pageTitle}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box
        minH='100vh'
        display={'flex'}
        flexDirection={'column'}
        bg={'#F9F9F9'}
      >
        <SidebarContent
          onClose={onToggle}
          isOpen={isOpen}
          pageTitle={pathnames[1]}
        />
        {/* <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer> */}
        {/* mobilenav */}
        <MobileNav onOpen={onToggle} isOpen={isOpen} pageTitle={pageTitle} />
        {loading ? (
          <Box ml={{ base: 0, md: isOpen ? '300px' : 0 }} p='4'>
            <SkeletonComponent />
          </Box>
        ) : (
          <>
            <Box
              transition={'0.4s ease'}
              ml={{ base: 0, md: isOpen ? '300px' : 0 }}
              p='4'
              height={header ? 'auto' : '15'}
              bg={'white'}
            >
              {header ? (
                header
              ) : (
                <Breadcrumb ml={'57px'}>
                  {breadcrumbs.map((breadcrumb, index) => {
                    const isCurrentPage = index === breadcrumbs.length - 1;
                    const href = `${breadcrumb
                      .toLowerCase()
                      .split(' ')
                      .join('-')}`;
                    return (
                      <BreadcrumbItem
                        key={index}
                        isCurrentPage={isCurrentPage}
                        color={isCurrentPage ? 'secondary' : 'black'}
                        fontWeight={500}
                        fontSize={'14px'}
                      >
                        <LinkBox href={index === 0 ? '/dashboard' : `/${href}`}>
                          {overrideTitle && isCurrentPage
                            ? overrideTitle
                            : breadcrumb}
                        </LinkBox>
                      </BreadcrumbItem>
                    );
                  })}
                </Breadcrumb>
              )}
            </Box>
            <Box
              display={'flex'}
              flexDirection={'column'}
              flexGrow={2}
              transition={'0.4s ease'}
              ml={{ base: 0, md: isOpen ? '300px' : 0 }}
              p='4'
            >
              {children}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default DashboardLayout;
