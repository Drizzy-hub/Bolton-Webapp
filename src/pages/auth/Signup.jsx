import {
	Box,
	Button,
	Checkbox,
	Input,
	Link,
	Text,
	useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { PassInput } from '../../components'; // Assuming this is a custom password input component
import { AuthenticatedUserContext } from '../../provider';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from '@firebase/firestore';
import { auth, db } from '../../firebase';

const Signup = () => {
	const { setUser } = useContext(AuthenticatedUserContext);
	const [inputValue, setInputValue] = useState({
		email: '',
		name: '',
		phone: '',
		password: '',
		confirmpassword: '',
		researchConsent: false,
	});
	const toast = useToast();

	const handleChange = (event) => {
		const { name, value, type, checked } = event.target;
		setInputValue((prevInputValue) => ({
			...prevInputValue,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleSignup = async () => {
		const { email, name, phone, password, confirmpassword } = inputValue;

		if (!email || !name || !phone || !password || !confirmpassword) {
			toast({
				title: 'Error',
				description: 'All fields are required.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			await setDoc(doc(db, 'users', user.uid), {
				id: user.uid,
				name,
				phone,
				researchConsent: inputValue.researchConsent ? 'yes' : null,
			});

			const signInUser = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			setUser(signInUser.user);
			localStorage.setItem(
				'token',
				JSON.stringify(signInUser?.user?.accessToken)
			);
			localStorage.setItem('user', JSON.stringify(signInUser?.user));
			// navigate('/');
			console.log('User registered successfully');
		} catch (error) {
			console.log('Error signing up user:', error);
			toast({
				title: 'Error',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<Box pt="10%" px={24} height="100%" width="100%">
			<Text mb={10} fontWeight={700}>
				Signup
			</Text>
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
			<Checkbox
				mb={30}
				name="researchConsent"
				isChecked={inputValue.researchConsent}
				onChange={handleChange}
			>
				I agree to have my data used for research purposes
			</Checkbox>
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
					<Link href="/login" textDecoration="none">
						Login
					</Link>
				</Text>
			</Box>
		</Box>
	);
};

export default Signup;
