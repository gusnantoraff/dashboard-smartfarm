import React, { useState, useContext, createContext } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Flex,
  Button,
  Input,
  useToast,
} from '@chakra-ui/react';
import Image from 'next/image';
import { Formik, Form, Field } from 'formik';
import { useMutationTemplate, Template } from '@/hooks/useTemplate';

type ModalTemplateProps = {
  close: () => void;
  open: boolean;
  title: string;
  subtitle?: string;
  template?: boolean;
  onEdit: (isEditing: boolean) => void;
  initialVal: {
    id: string;
    name: string;
    dap: number;
  };
  children: React.ReactNode;
};

type DataProps = {
  label: string;
  value: string | number;
  editable?: boolean;
  gray?: boolean;
  name: string;
};

const EditContext = createContext<{
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}>({ isEdit: false, setIsEdit: () => {} });

export const Data: React.FC<DataProps> = ({
  label,
  value,
  editable = false,
  gray,
  name,
}) => {
  const { isEdit } = useContext(EditContext);

  return (
    <Flex
      px='16px'
      py='11px'
      bg={gray ? '#FAFAFA' : '#FFFFFF'}
      justifyContent='space-between'
      alignItems='center'
      borderBottom='1px'
      borderBottomColor='#C4C4C480'
    >
      <Text fontSize='14px' fontWeight={500} color='black'>
        {label}
      </Text>
      {isEdit && editable ? (
        <Field name={name}>
          {({ field }: any) => (
            <Input {...field} size='sm' width='120px' />
          )}
        </Field>
      ) : (
        <Text fontSize='14px' fontWeight={500} color='black'>
          {value}
        </Text>
      )}
    </Flex>
  );
};

const ModalTemplate: React.FC<ModalTemplateProps> & {
  Data: React.FC<DataProps>;
} = ({
  close,
  open,
  title,
  subtitle,
  onEdit,
  template = false,
  initialVal,
  children,
}) => {
  const toast = useToast();
  const updateTemplate = useMutationTemplate();
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const validateValue = (values: any) => {
    const errors: any = {};
    for (const key in values) {
      if (!values[key]) {
        errors[key] = 'Required';
      }
    }
    return errors;
  };

  const editTemplate = async (values: Template) => {
    try {
      setLoadingTemplate(true);
      const { id, name, dap_count } = values;
      await updateTemplate(id, { name, dap_count });
      toast({
        title: 'Template Updated',
        description: 'Template has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating the template.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingTemplate(false);
    }
  };

  const onSubmit = async (values: any) => {
    console.log('Form submitted', values);
    if (template) {
      await editTemplate(values);
    }
  };

  return (
    <EditContext.Provider value={{ isEdit, setIsEdit }}>
      <Modal isOpen={open} onClose={close}>
        <ModalOverlay />
        <ModalContent p='40px' minW='640px'>
          <ModalHeader
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            px='0'
            pt='0'
            pb='24px'
            mb='24px'
            borderBottom='1px'
            borderBottomColor='#C4C4C480'
          >
            <Flex direction='column'>
              <Text fontSize='20px' color='primary' fontWeight={600}>
                {title}
              </Text>
              {subtitle && (
                <Text fontSize='14px' color='text.02' fontWeight={500}>
                  {subtitle}
                </Text>
              )}
            </Flex>
            <Image
              src='/icons/modal_close.svg'
              width={32}
              height={32}
              alt='close'
              onClick={close}
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
                <Flex gap='8px' mt='24px'>
                  {isEdit ? (
                    <>
                      <Button
                        isLoading={loadingTemplate}
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
                    </>
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
                </Flex>
              </Form>
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </EditContext.Provider>
  );
};

ModalTemplate.Data = Data;

export default ModalTemplate;
