import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Stack,
	useToast,
	Heading,
	List,
	ListItem,
	Text,
} from '@chakra-ui/react';
import { db } from '../../firebase';
import {
	addDoc,
	collection,
	serverTimestamp,
	Timestamp, // Import Timestamp from firebase/firestore
	query,
	orderBy,
	getDocs,
} from 'firebase/firestore';
import { AuthenticatedUserContext } from '../../provider';
import { Header } from '../../components';

const Reminders = () => {
	const { user } = useContext(AuthenticatedUserContext);
	const [reminderDate, setReminderDate] = useState('');
	const [reminderTime, setReminderTime] = useState('');
	const [reminders, setReminders] = useState([]);
	const toast = useToast();


	const dataToBeSent = {
		to: "adeyeriomotola1@gmail.com",
		subject: `LAUGHIE Reminder 😅`,
		date: reminderDate,
		time: reminderTime,
	}

	useEffect(() => {
		fetchReminders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	
	const fetchReminders = async () => {
		try {
			const remindersRef = collection(
				db,
				`reminders/${user.uid}/userReminders`
			);
			const q = query(remindersRef, orderBy('reminderDateTime', 'asc'));
			const querySnapshot = await getDocs(q);
			const fetchedReminders = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				fetchedReminders.push({
					id: doc.id,
					reminderDateTime: data.reminderDateTime.toDate(),
				});
			});
			setReminders(fetchedReminders);
		} catch (error) {
			console.error('Error fetching reminders:', error);
		}
	};

	const handleReminderSubmit = async () => {
		if (!reminderDate || !reminderTime) {
			toast({
				title: 'Error',
				description: 'Please select both date and time for the reminder.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		try {
			const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
			const formattedDateTime = Timestamp.fromDate(reminderDateTime);

			await addDoc(collection(db, `reminders/${user.uid}/userReminders`), {
				reminderDateTime: formattedDateTime,
				createdBy: user.uid,
				createdAt: serverTimestamp(),
			});

			await axios.post('https://bolton-webapp-be.vercel.app/email/send', dataToBeSent)

			toast({
				title: 'Reminder set',
				description: 'Your reminder has been successfully set.',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});

			setReminderDate('');
			setReminderTime('');
			fetchReminders(); // Refresh reminders list after setting a new reminder
		} catch (error) {
			console.error('Error setting reminder:', error);
			toast({
				title: 'Error',
				description: 'Failed to set reminder. Please try again.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<>
			<Header profile />
			<Box p={4} m={20} borderWidth="1px" borderRadius="md">
				<Heading as="h2" size="lg" mb={4}>
					Set Reminders
				</Heading>
				<FormControl id="reminderDate" isRequired>
					<FormLabel>Date</FormLabel>
					<Input
						type="date"
						value={reminderDate}
						onChange={(e) => setReminderDate(e.target.value)}
					/>
				</FormControl>
				<FormControl id="reminderTime" mt={4} isRequired>
					<FormLabel>Time</FormLabel>
					<Input
						type="time"
						value={reminderTime}
						onChange={(e) => setReminderTime(e.target.value)}
					/>
				</FormControl>
				<Stack mt={4} direction="row" spacing={4} align="center">
					<Button colorScheme="blue" onClick={handleReminderSubmit}>
						Set Reminder
					</Button>
				</Stack>

				<Box mt={8}>
					<Heading as="h2" size="lg" mb={4}>
						Your Reminders
					</Heading>
					{reminders.length === 0 ? (
						<Text>No reminders set.</Text>
					) : (
						<List spacing={3}>
							{reminders.map((reminder) => (
								<ListItem key={reminder.id}>
									<Text>
										Reminder on{' '}
										{new Date(reminder.reminderDateTime).toLocaleString()}
									</Text>
								</ListItem>
							))}
						</List>
					)}
				</Box>
			</Box>
		</>
	);
};

export default Reminders;
