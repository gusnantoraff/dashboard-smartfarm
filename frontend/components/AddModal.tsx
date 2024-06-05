import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';

type Props = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
  schema: any;
  onSubmit: (values: any, { setSubmitting }?: any) => any;
  loading?: boolean;
};

export default function AddModal({
  children,
  open,
  title,
  onClose,
  schema,
  onSubmit,
  loading,
}: Props) {
  const validateValue = (values: any) => {
    const errors: any = {};

    for (const key in values) {
      if (
        values[key] === '' ||
        values[key] === null ||
        values[key] === undefined
      ) {
        errors[key] = 'Required';
      }
    }

    return errors;
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={schema}
          validate={validateValue}
          onSubmit={onSubmit}
        >
          <Form>
            <ModalBody pb={6}>
              <div className='flex flex-col gap-y-6'>{children}</div>
            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={loading}
                type='submit'
                variant={'secondary'}
                mr={3}
              >
                Add
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
}
