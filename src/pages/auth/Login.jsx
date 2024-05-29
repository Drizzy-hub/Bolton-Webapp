import { Box, Button, Input, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { Google } from '../../components';

const Login = () => {
  return (
    <Box pt={'15%'} paddingX={24} height={'100%'} w={'100%'}>
    <Text mb={10} fontWeight={700}>Login</Text>
    <Input mb={17} placeholder='Email'/>
    <Input mb={30} placeholder='Password'/>
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
    <Button width={'50%'} background={'#4894FE'}  color={'white'} >Login</Button>
    </Box>
    <Box justifyContent={'center'} mt={17} display={'flex'} flexDirection={'row'}><Text>Don't have an account?</Text> <Text ml={1} color={'#4894FE'}><Link href='/signup' textDecoration={'none'}>Signup</Link></Text></Box>
    <Google />
    </Box>

  );
};

export default Login;