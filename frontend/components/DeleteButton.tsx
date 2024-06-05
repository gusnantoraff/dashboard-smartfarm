import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useRef } from 'react';

type Props = {
  onDelete: () => void;
  btnText?: string;
  title?: string;
  description?: string | React.ReactNode;
  loading?: boolean;
};

export default function DeleteButton({
  onDelete,
  title = 'Delete Data',
  description = "Are you sure? You can't undo this action afterwards.",
  btnText = 'Delete',
  loading = false,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        onClick={onOpen}
        size={'sm'}
        variant='solid'
        bg={'status.error'}
        borderRadius={'full'}
        color='white'
        _hover={{ bg: 'status.error_hover' }}
      >
        {btnText}
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{description}</AlertDialogBody>

            <AlertDialogFooter>
              <Button isLoading={loading} onClick={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={loading}
                colorScheme='red'
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                ml={3}
              >
                {btnText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
