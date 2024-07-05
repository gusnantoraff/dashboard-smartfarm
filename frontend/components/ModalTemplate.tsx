import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import React, { useState, createContext, useContext } from 'react';
import FormItem from './FormItem';
import { useMutationTemplate } from '@/hooks/useTemplate';

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
  onEdit: (isEditing: boolean) => void;
  initialVal?: any;
  open: boolean;
  close: () => void;
  ecData: Array<{ id: number; value: number; note: string }>;
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
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'datetime-local' | 'time';
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
      {isEdit && editable ? (
        <FormItem.InputInline
          name={name ?? label}
          placeholder={label}
          type={type}
        />
      ) : (
        <Text fontSize={'14px'} color={'black'} fontWeight={500}>
          {value}
        </Text>
      )}
    </Box>
  );
}

function ModalTemplate({
  children,
  title,
  subtitle,
  onEdit,
  initialVal,
  open,
  close,
  ecData
}: Props) {
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const updateTemplate = useMutationTemplate();
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);


  const validateValue = (values: any) => {
    const errors: any = {};

    for (const key in values) {
      if (!values[key]) {
        errors[key] = 'Required';
      }
    }

    return errors;
  };

  const editTemplate = async (values: any, ecData: Array<{ id: number; value: number; note: string }>) => {
    try {
      console.log('Updating template with values:', values);
      setLoadingTemplate(true);

    const { id, name, dap_count } = values;
    const templateData = { name, dap_count, ecData };

      await updateTemplate(id, templateData);
      toast({
        title: 'Template Updated',
        description: 'Template has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setIsEdit(false);
    } catch (error) {
      setErrorPopup(true);
    } finally {
      setLoadingTemplate(false);
    }
  };

  const onSubmit = async (values: any) => {
    await editTemplate(values, ecData);
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
                <ModalTemplate.Border />
                {isEdit ? (
                  <Flex gap='8px'>
                    <Button
                      isLoading={loadingTemplate}
                      onClick={() => {
                          onEdit(false);
                      }}
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
                        onEdit(false);
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
                  onClick={() => {
                    setIsEdit(true);
                    onEdit(true);
                  }}
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
    </EditContext.Provider>
  );
}

ModalTemplate.Border = Border;
ModalTemplate.Data = Data;

export default ModalTemplate;
