import { Box, Button, Input, Link, Text } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { Google, PassInput } from '../../components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth} from "../../firebase";
import { AuthenticatedUserContext } from '../../provider';


const Login = () => {
  const { setUser  } = useContext(AuthenticatedUserContext);
  const [inputValue, setInputValue] = useState({
    password:'',
    email:'',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: value,
    }));
  };

  const onLogin = async () => {
    try {
      if (inputValue.email !== "" && inputValue.password !== "") {
        const userCredential = await signInWithEmailAndPassword(auth, inputValue.email, inputValue.password);
        const user = userCredential.user;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify(user?.accessToken));
        // console.log(user, 'user')
        // navigate('/');
      } else {
        alert("Please fill in both fields");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <Box pt={'15%'} paddingX={24} height={'100%'} w={'100%'}>
    <Text mb={10} fontWeight={700}>Login</Text>
    <Input value={inputValue.email} name='email' onChange={handleChange} mb={17} placeholder='Email'/>
    <PassInput value={inputValue.password} onChange={handleChange} name="password" mb={30} placeholder='Password'/>
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
    <Button disabled={inputValue.email === "" && inputValue.password === ""}
    onClick={onLogin}
     width={'50%'} background={'#4894FE'}  color={'white'} >Login</Button>
    </Box>
    <Text justifyContent={'center'} mt={17} display={'flex'} flexDirection={'row'}>Don't have an account? <Text  color={'#4894FE'}><Link href='/signup' textDecoration={'none'}>Signup</Link></Text></Text> 
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
    <Google />
    </Box>
    </Box>

  );
};

export default Login;