import { Box, Text, Select, Button } from '@chakra-ui/react';
import {
	addDoc,
	collection,
	query,
	where,
	getDocs,
	serverTimestamp,
} from '@firebase/firestore';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { FaRegCircleStop } from 'react-icons/fa6';
import { PiRecordFill } from 'react-icons/pi';
import { db, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AuthenticatedUserContext } from '../../provider';

const Record = () => {
	const { user } = useContext(AuthenticatedUserContext);
	const [isRecording, setIsRecording] = useState(false);
	const [stream, setStream] = useState(null);
	const [countdown, setCountdown] = useState(0);
	const [videoCount, setVideoCount] = useState(0);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [selectedFeeling, setSelectedFeeling] = useState('');
	const [lastVideoURL, setLastVideoURL] = useState(''); // State for storing last video URL
	const mediaRecorderRef = useRef(null);
	const videoRef = useRef(null);
	const chunks = useRef([]);
	const minDuration = 50; // 50 seconds
	const maxDuration = 60; // 1 minute
	const feelings = [
		'Happy',
		'Joy',
		'Excited',
		'Satisfied',
		'Sad',
		'Angry',
		'Feared',
		'Anxious',
		'Stressed',
		'Frustrated',
		'Disappointed',
		'Depressed',
		'Guilty',
		'Ashamed',
		'Bored',
		'Neutral',
	];

	useEffect(() => {
		// Request access to the webcam
		const getMedia = async () => {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			setStream(stream);
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		};
		getMedia();
	}, []);

	useEffect(() => {
		if (user) {
			checkVideoCount();
		}
	}, [user]);

	const checkVideoCount = async () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const q = query(
			collection(db, 'posts'),
			where('creator', '==', user.uid),
			where('creation', '>=', today)
		);
		const querySnapshot = await getDocs(q);
		setVideoCount(querySnapshot.size);
	};

	const startRecording = () => {
		if (videoCount >= 3) {
			alert('You have reached your daily video limit.');
			return;
		}

		if (stream) {
			setCountdown(3);
			const countdownInterval = setInterval(() => {
				setCountdown((prevCountdown) => {
					if (prevCountdown === 1) {
						clearInterval(countdownInterval);
						const mediaRecorder = new MediaRecorder(stream);
						mediaRecorderRef.current = mediaRecorder;
						mediaRecorder.ondataavailable = (event) => {
							chunks.current.push(event.data);
						};
						mediaRecorder.onstop = async () => {
							const blob = new Blob(chunks.current, { type: 'video/mp4' });
							chunks.current = [];
							const duration = await getBlobDuration(blob);
							if (duration < minDuration || duration > maxDuration) {
								alert('Video must be between 50 seconds and 1 minute.');
								return;
							}
							await uploadVideo(blob);
							setIsDropdownVisible(true);
						};
						mediaRecorder.start();
						setIsRecording(true);
					}
					return prevCountdown - 1;
				});
			}, 1000);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	const uploadVideo = async (blob) => {
		const timestamp = new Date().getTime(); // Generate a unique timestamp
		const filename = `video_${timestamp}.mp4`; // Construct filename with timestamp
		const path = `video/${user.uid}/${filename}`;
		const storageRef = ref(storage, path);

		try {
			const snapshot = await uploadBytes(storageRef, blob, {
				customMetadata: {
					creationDate: new Date().toISOString(),
				},
			});
			const downloadURL = await getDownloadURL(snapshot.ref);
			setLastVideoURL(downloadURL); // Update the last video URL state
		} catch (error) {
			console.error('Error uploading video:', error);
			alert('Upload failed: ' + error.message);
		}
	};

	const saveVideoURLToFirestore = async (url, creationDate, feeling) => {
		try {
			await addDoc(collection(db, 'posts'), {
				creator: user.uid,
				recordURL: url,
				creation: serverTimestamp(),
				creationDate: creationDate,
				feeling: feeling || 'Not provided', // Add the feeling to the document
			});
			console.log('Video URL saved to Firestore');
		} catch (error) {
			console.error('Error saving video URL to Firestore:', error);
		}
	};

	const getBlobDuration = (blob) => {
		return new Promise((resolve) => {
			const tempVideo = document.createElement('video');
			tempVideo.onloadedmetadata = () => {
				resolve(tempVideo.duration);
			};
			tempVideo.src = URL.createObjectURL(blob);
		});
	};

	const handleFeelingChange = (event) => {
		setSelectedFeeling(event.target.value);
	};

	const handleFeelingSubmit = () => {
		if (selectedFeeling) {
			// Save the feeling to Firestore for the last uploaded video
			saveVideoURLToFirestore(lastVideoURL, new Date(), selectedFeeling);
			setIsDropdownVisible(false);
		} else {
			alert('Please select a feeling.');
		}
	};

	return (
		<Box position="relative" width="100%" maxW="600px" margin="auto">
			<Box mt={{ base: 10 }}>
				<video
					ref={videoRef}
					autoPlay
					muted
					style={{ width: '100%', maxHeight: '400px' }}
				/>
				{countdown > 0 && (
					<Box
						position="absolute"
						top="0"
						left="0"
						width="100%"
						height="100%"
						display="flex"
						justifyContent="center"
						alignItems="center"
						bg="rgba(0, 0, 0, 0.5)"
						color="white"
						fontSize="5xl"
						zIndex="10"
					>
						<Text>{countdown}</Text>
					</Box>
				)}
			</Box>
			<Box
				display={'flex'}
				justifyContent={'center'}
				mt={{ base: 6 }}
				alignItems={'center'}
			>
				{isRecording ? (
					<button onClick={stopRecording}>
						<FaRegCircleStop size={50} />
					</button>
				) : (
					<button onClick={startRecording}>
						<PiRecordFill size={50} color="red" />
					</button>
				)}
			</Box>
			{isDropdownVisible && (
				<Box mt={4}>
					<Select
						placeholder="Select your feeling"
						value={selectedFeeling}
						onChange={handleFeelingChange}
					>
						{feelings.map((feeling) => (
							<option key={feeling} value={feeling}>
								{feeling}
							</option>
						))}
					</Select>
					<Button mt={2} onClick={handleFeelingSubmit}>
						Submit Feeling
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default Record;
