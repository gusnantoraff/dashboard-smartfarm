import {
  Box,
  Button,
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import Image from 'next/image';
import React, { useState, createContext, useContext, useEffect } from 'react';
import FormItem from './FormItem';
import { useMutationController, Controller } from '@/hooks/useController';
import { UpdateConfigControllerMethods } from '@/types';
import { AddIcon, DeleteIcon, SettingsIcon } from '@chakra-ui/icons';

type EditContextType = {
  isEdit: boolean;
  setIsEdit?: (value: boolean) => void;
};

const EditContext = createContext<EditContextType>({
  isEdit: false,
  setIsEdit: () => { },
});

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  initialVal?: any;
  method: UpdateConfigControllerMethods;
  helperText?: string;
};

type ECProps = {
  title: string;
  subtitle?: string;
  method: UpdateConfigControllerMethods;
  helperText?: string;
  initialVal?: any;
  daps: number[];
  mode: string;
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
}: {
  label: string;
  name?: string;
  value: string;
  gray?: boolean;
  editable?: boolean;
}) {
  const { isEdit } = useContext(EditContext);

  return (
    <Box
      px='16px'
      py='11px'
      display={'flex'}
      alignItems={'center'}
      backgroundColor={gray ? '#FAFAFA' : '#FFFFFF'}
      justifyContent={'space-between'}
    >
      <Text fontSize={'14px'} color={'black'} fontWeight={500}>
        {label}
      </Text>
      {isEdit && editable && name !== 'ecMode' ? (
        <FormItem.Number name={name ?? label} placeholder={label} type='text' />
      ) : isEdit && editable && name === 'ecMode' ? (
        <FormItem.Select
          name={name ?? label}
          placeholder={label}
          options={['ALL', 'SINGLE']}
        />
      ) : (
        <Text fontSize={'14px'} color={'black'} fontWeight={500}>
          {value}
        </Text>
      )}
    </Box>
  );
}

function EC({
  subtitle = '',
  helperText,
  daps,
  mode,
  initialVal,
}: ECProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isEdit] = useState(true);
  const [dapsValue, setDapsValue] = useState<number[]>([]);
  const [ecMode, setEcMode] = useState<string | null>(mode);
  const [loading, setLoading] = useState(false);
  const updateController = useMutationController();

  const configUpdate = async (values: Controller) => {
    try {
      setLoading(true);
      const { id, clusterId, templateId, templates } = values;
      await updateController(id, { clusterId, templateId, templates });
      toast({
        title: 'Success',
        description: 'Controller has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error updating controller:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating the controller.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (daps && dapsValue?.length === 0) {
      setDapsValue(daps);
    }
  }, [daps]);

  const validateValue = (values: any) => {
    const errors: any = {};

    for (const key in values) {
      if (!values[key]) {
        errors[key] = 'Required';
      }
    }

    return errors;
  };

  const onSubmit = () => {
    const controllerId = initialVal.controllerId;
    const data = {
      controllerId,
      ecMode: ecMode?.toUpperCase(),
      ecValue: dapsValue,
    };

    configUpdate({
      id: controllerId,
      clusterId: initialVal.clusterId,
      templateId: initialVal.templateId,
      templates: {
        ecMode: data.ecMode,
        ecValue: data.ecValue,
      },
    } as unknown as Controller);
  };


  const EcSingleSetting = () => {
    return (
      <Box className='w-full flex justify-between items-center'>
        <div className='flex flex-col gap-2 '>
          <Button
            bg={'secondary'}
            color={'white'}
            mb='16px'
            _hover={{ bg: 'secondary' }}
            fontSize={'14px'}
            isLoading={loading}
            onClick={() => {
              onSubmit();
            }}
          >
            Set Single Dap
          </Button>
          <Button
            bg={'status.success'}
            color={'white'}
            leftIcon={<AddIcon />}
            _hover={{ bg: 'status.success' }}
            fontSize={'14px'}
            isLoading={loading}
            onClick={() => {
              const newDaps = [...dapsValue];
              newDaps.push(1);
              setDapsValue(newDaps);
            }}
          >
            Add DAP
          </Button>
          <Button
            bg={'status.error'}
            color={'white'}
            leftIcon={<DeleteIcon />}
            _hover={{ bg: 'status.error' }}
            fontSize={'14px'}
            isLoading={loading}
            onClick={() => {
              const newDaps = [...dapsValue];
              newDaps.pop();
              setDapsValue(newDaps);
            }}
          >
            Remove DAP
          </Button>
        </div>

        <div className='flex flex-col gap-3'>
          {dapsValue.map((dap, index) => (
            <div key={index} className='flex items-center gap-3'>
              <span>{`DAP ${index + 1}`}</span>
              <Field type='number'>
                {({ field }: any) => (
                  <FormControl w={'auto'}>
                    <NumberInput
                      defaultValue={dap}
                      max={100}
                      min={0}
                      precision={2}
                      step={0.01}
                      clampValueOnBlur={true}
                      display={'inline-block'}
                      onChange={(value) => {
                        const newDaps = [...dapsValue];
                        newDaps[index] = Number(value);
                        setDapsValue(newDaps);
                      }}
                    >
                      <NumberInputField {...field} />
                      <NumberInputStepper>
                        <NumberIncrementStepper {...field} />
                        <NumberDecrementStepper {...field} />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                )}
              </Field>
            </div>
          ))}
        </div>
      </Box>
    );
  };
  const EcAllSetting = () => {
    return (
      <Box className='w-full flex justify-between items-center'>
        <div className='flex flex-col gap-2 '>
          <Button
            bg={'secondary'}
            color={'white'}
            mb='16px'
            _hover={{ bg: 'secondary' }}
            fontSize={'14px'}
            isLoading={loading}
            onClick={() => {
              onSubmit();
            }}
          >
            Set All Dap
          </Button>
        </div>

        <div className='flex flex-col gap-3'>
          {dapsValue.map((dap, index) => (
            <div key={index} className='flex items-center gap-3'>
              <span>{`DAP ${index + 1}`}</span>
              <Field type='number'>
                {({ field }: any) => (
                  <FormControl w={'auto'}>
                    <NumberInput
                      defaultValue={dap}
                      max={100}
                      min={0}
                      precision={2}
                      step={0.01}
                      clampValueOnBlur={true}
                      display={'inline-block'}
                      onChange={(value) => {
                        const newDaps = [...dapsValue];
                        newDaps[index] = Number(value);
                        setDapsValue(newDaps);
                      }}
                    >
                      <NumberInputField {...field} />
                      <NumberInputStepper>
                        <NumberIncrementStepper {...field} />
                        <NumberDecrementStepper {...field} />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                )}
              </Field>
            </div>
          ))}
        </div>
      </Box>
    );
  };

  const PickEcMode = () => (
    <Box className='w-full flex flex-col gap-5 items-center'>
      <Button
        onClick={() => {
          setEcMode('all');
          if (dapsValue.length > 1) {
            setDapsValue([1]);
          }
        }}
        variant='solid'
        colorScheme='gray'
        w={'20%'}
        fontSize={'14px'}
        fontWeight={600}
      >
        Set All DAP
      </Button>
      <Button
        onClick={() => {
          setEcMode('single');
          if (dapsValue.length === 1) {
            setDapsValue(daps);
          }
        }}
        variant='solid'
        colorScheme='gray'
        w={'20%'}
        fontSize={'14px'}
        fontWeight={600}
      >
        Set Single DAP
      </Button>
    </Box>
  );

  return (
    <EditContext.Provider value={{ isEdit }}>
      <Tooltip label={helperText} aria-label='A tooltip'>
        <SettingsIcon onClick={onOpen} w='5' h='5' cursor='pointer' />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
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
                {ecMode
                  ? `${ecMode.toUpperCase()} DAP Setting`
                  : 'EC DAP Setting'}
              </Text>
              <Text fontSize={'14px'} color={'text.02'} fontWeight={500}>
                {subtitle}
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
            <Formik
              initialValues={{}}
              validate={validateValue}
              onSubmit={onSubmit}
            >
              <Form>
                {ecMode === 'all' ? (
                  <EcAllSetting />
                ) : ecMode === 'single' ? (
                  <EcSingleSetting />
                ) : (
                  <PickEcMode />
                )}

                <ConfigModal.Border />

                {ecMode ? (
                  <Button
                    onClick={() => {
                      setEcMode(null);
                    }}
                    variant='solid'
                    colorScheme='gray'
                    w={'20%'}
                    fontSize={'14px'}
                    fontWeight={600}
                  >
                    Back
                  </Button>
                ) : (
                  ''
                )}
              </Form>
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </EditContext.Provider>
  );
}

function ConfigModal({
  children,
  title,
  subtitle = '',
  initialVal,
  helperText,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(true);
  const [loading, setLoading] = useState(false);
  const updateController = useMutationController();

  const configUpdate = async (values: Controller) => {
    try {
      setLoading(true);
      const { id, clusterId, templateId, templates } = values;
      await updateController(id, { clusterId, templateId, templates });
      toast({
        title: 'Success',
        description: 'Controller has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error updating controller:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating the controller.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

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
    configUpdate(values);
  };

  return (
    <EditContext.Provider value={{ isEdit }}>
      <Tooltip label={helperText} aria-label='A tooltip'>
        <SettingsIcon onClick={onOpen} w='5' h='5' cursor='pointer' />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
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
              onClick={onClose}
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
                <ConfigModal.Border />
                {isEdit ? (
                  <Flex gap='8px'>
                    <Button
                      isLoading={loading}
                      type='submit'
                      variant='solid'
                      bg={'secondary'}
                      w={'80%'}
                      color='white'
                      _hover={{ bg: 'secondary_hover' }}
                      fontSize={'14px'}
                      fontWeight={600}
                    >
                      Update Config
                    </Button>
                    <Button
                      onClick={() => {
                        onClose();
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
                    Edit Controller Config
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

ConfigModal.Border = Border;
ConfigModal.Data = Data;
ConfigModal.EC = EC;

export default ConfigModal;
