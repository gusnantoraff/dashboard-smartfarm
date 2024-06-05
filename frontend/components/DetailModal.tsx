import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast,
  } from '@chakra-ui/react';
  import { Form, Formik } from 'formik';
  import Image from 'next/image';
  import React, { useState, createContext, useContext } from 'react';
  import FormItem from './FormItem';
  import { useMutationUser } from '@/hooks/useUser';
  import { useMutationCluster } from '@/hooks/useCluster';
  
  type EditContextType = {
    isEdit: boolean;
    setIsEdit?: (value: boolean) => void;
  };
  
  const EditContext = createContext<EditContextType>({
    isEdit: false,
    setIsEdit: () => {},
  });
  
  type Props = {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    initialVal?: any;
    btnText?: string;
    cluster?: boolean;
    open: boolean;
    close: () => void;
  };
  
  function Border() {
    return <Box borderBottom={'1px'} borderBottomColor={'#C4C4C480'} my='24px' />;
  }
  
  function Data({
    label,
    name,
    value,
    gray,
    editable = false,
    type = 'text',
  }: {
    label: string;
    name?: string;
    value: string | number;
    gray?: boolean;
    editable?: boolean;
    type?:
      | 'text'
      | 'password'
      | 'email'
      | 'number'
      | 'tel'
      | 'url'
      | 'datetime-local'
      | 'time';
  }) {
    const { isEdit } = useContext(EditContext);
  
    return (
      <Box
        px='16px'
        py='11px'
        display={'flex'}
        backgroundColor={gray ? '#FAFAFA' : '#FFFFFF'}
        justifyContent={'space-between'}
      >
        <Text fontSize={'14px'} color={'black'} fontWeight={500}>
          {label}
        </Text>
        {isEdit && editable && name !== 'role' && name !== 'timezone' ? (
          <FormItem.InputInline
            name={name ?? label}
            placeholder={label}
            type={type}
          />
        ) : isEdit && editable && name === 'role' ? (
          <FormItem.Select
            name={name ?? label}
            placeholder={label}
            options={['SUPER_ADMIN', 'ADMIN', 'USER']}
          />
        ) : isEdit && editable && name === 'timezone' ? (
          <FormItem.Select
            name={name ?? label}
            placeholder={label}
            options={['ASIA/JAKARTA', 'ASIA/MAKASSAR', 'ASIA/JAYAPURA']}
          />
        ) : (
          <Text fontSize={'14px'} color={'black'} fontWeight={500}>
            {value}
          </Text>
        )}
      </Box>
    );
  }
  
  function DetailModal({
    children,
    title,
    subtitle,
    initialVal,
    cluster = false,
    open,
    close,
  }: Props) {
    const toast = useToast();
    const [isEdit, setIsEdit] = useState(false);
    const [editUser, { loading }] = useMutationUser('UPDATE', {
      onCompleted: () => {
        setIsEdit(false);
        toast({
          title: 'Success',
          description: 'User has been updated',
          status: 'success',
          variant: 'left-accent',
  
          duration: 3000,
          isClosable: true,
        });
      },
    });
    const [editCluster, { loading: loadingCluster }] = useMutationCluster(
      'UPDATE',
      {
        onCompleted: () => {
          setIsEdit(false);
          toast({
            title: 'Success',
            description: 'Cluster has been updated',
            status: 'success',
            variant: 'left-accent',
  
            duration: 3000,
            isClosable: true,
          });
        },
      },
    );
  
    const validateValue = (values: any) => {
      const errors: any = {};
  
      for (const key in values) {
        if (!values[key]) {
          errors[key] = 'Required';
        }
      }
  
      return errors;
    };
  
    const onSubmit = (values: any) => {
      if (cluster) {
        editCluster({
          variables: {
            data: values,
          },
        });
      } else {
        editUser({
          variables: {
            data: values,
          },
        });
      }
    };
  
    return (
      <EditContext.Provider value={{ isEdit }}>
        <Modal isOpen={open} onClose={close}>
          <ModalOverlay />
          <ModalContent p='40px' minW='640px'>
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
                  {title}
                </Text>
                <Text fontSize={'14px'} color={'text.02'} fontWeight={500}>
                  {subtitle}
                </Text>
              </Box>
              <Image
                onClick={close}
                src='/icons/modal_close.svg'
                width={32}
                height={32}
                alt='close'
                className='cursor-pointer bg-transparent hover:bg-slate-100 transition-all duration-100 ease-in-out rounded-full'
              />
            </ModalHeader>
  
            <ModalBody p='0'>
              <Formik
                initialValues={initialVal}
                validate={validateValue}
                onSubmit={onSubmit}
              >
                <Form>
                  {children}
                  <DetailModal.Border />
                  {isEdit ? (
                    <Flex gap='8px'>
                      <Button
                        isLoading={cluster ? loadingCluster : loading}
                        type='submit'
                        variant='solid'
                        bg={'secondary'}
                        w={'80%'}
                        color='white'
                        _hover={{ bg: 'secondary_hover' }}
                        fontSize={'14px'}
                        fontWeight={600}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEdit(false);
                        }}
                        variant='solid'
                        colorScheme='gray'
                        w={'20%'}
                        fontSize={'14px'}
                        fontWeight={600}
                      >
                        Cancel
                      </Button>
                    </Flex>
                  ) : (
                    <Button
                      onClick={() => setIsEdit(true)}
                      variant='outline'
                      color={'primary'}
                      borderColor={'primary'}
                      fontSize={'14px'}
                      fontWeight={600}
                      w='full'
                    >
                      Edit Data
                    </Button>
                  )}
                </Form>
              </Formik>
            </ModalBody>
          </ModalContent>
        </Modal>
      </EditContext.Provider>
    );
  }
  
  DetailModal.Border = Border;
  DetailModal.Data = Data;
  
  export default DetailModal;
  