import { Box, Button, Input, Link, Text } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { PassInput } from '../../components';  // Assuming this is a custom password input component
import { AuthenticatedUserContext } from '../../provider';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from '@firebase/firestore';
import { auth, db } from "../../firebase";


const Signup = () => {
  const { setUser } = useContext(AuthenticatedUserContext);
  const [inputValue, setInputValue] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmpassword: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputValue.email,
        inputValue.password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name: inputValue.name,
        phone: inputValue.phone,
      });

      const signInUser = await signInWithEmailAndPassword(auth, inputValue.email, inputValue.password);
      setUser(signInUser.user);
      localStorage.setItem('token', JSON.stringify(signInUser?.user?.accessToken));
      localStorage.setItem('user', JSON.stringify(signInUser?.user));
      // navigate('/');
      console.log("User registered successfully");
    } catch (error) {
      console.log("Error signing up user:", error);
    }
  };

  return (
    <Box pt="10%" px={24} height="100%" width="100%">
      <Text mb={10} fontWeight={700}>Signup</Text>
      <Input
        mb={17}
        name="email"
        value={inputValue.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <Input
        mb={17}
        name="name"
        value={inputValue.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <Input
        mb={17}
        name="phone"
        value={inputValue.phone}
        onChange={handleChange}
        placeholder="Phone Number"
      />
      <PassInput
        mb={17}
        name="password"
        value={inputValue.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <PassInput
        mb={30}
        name="confirmpassword"
        value={inputValue.confirmpassword}
        onChange={handleChange}
        placeholder="Confirm Password"
      />
      <Box display="flex" alignItems="center" justifyContent="center">
        <Button
          onClick={handleSignup}
          width="50%"
          background="#4894FE"
          color="white"
        >
          Signup
        </Button>
      </Box>
      <Box justifyContent="center" mt={17} display="flex" flexDirection="row">
        <Text>Do you have an account?</Text>
        <Text ml={1} color="#4894FE">
          <Link href="/login" textDecoration="none">Login</Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Signup;
