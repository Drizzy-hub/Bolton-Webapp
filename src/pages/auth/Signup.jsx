import { Box, Button, Input, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { PassInput } from '../../components';

const Signup = () => {
  return (
    <Box pt={'10%'} paddingX={24} height={'100%'} w={'100%'}>
    <Text mb={10} fontWeight={700}>Signup</Text>
    <Input mb={17} placeholder='Email'/>
    <Input mb={17} placeholder='Name'/>
    <Input mb={17} placeholder='Phone Number'/>
    <PassInput mb={17}  placeholder={'Password'}/>
    <PassInput mb={30}  placeholder={'Confirm Password'}/>
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
    <Button width={'50%'} background={'#4894FE'}  color={'white'} >Signup</Button>
    </Box>
    <Box justifyContent={'center'} mt={17} display={'flex'} flexDirection={'row'}><Text>Do you have an account?</Text> <Text ml={1} color={'#4894FE'}><Link href='/login' textDecoration={'none'}>Login</Link></Text></Box>
    </Box>
   
  );
};

export default Signup;