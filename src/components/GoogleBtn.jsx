import { FcGoogle } from 'react-icons/fc';
import { Button, Center, Text } from '@chakra-ui/react';

export default function GoogleButton({onClick}) {
  return (
   
    <Center justifyContent={'center'} alignItems={'center'} flexDirection={'row'} display={'flex'} width={'fit-content'} mt={8}>
      <Button
      onClick={onClick}
        w={'fit-content'}
        maxW={'fit-content'}
        variant={'outline'}
        leftIcon={<FcGoogle />}>
        <Center>
          <Text p={3}>Sign in with Google</Text>
        </Center>
      </Button>
    </Center>
   
  );
}