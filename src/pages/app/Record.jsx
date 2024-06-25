import {
	Box,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	useDisclosure,
} from '@chakra-ui/react';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { FaRegCircleStop } from 'react-icons/fa6';
import { PiRecordFill } from 'react-icons/pi';
import { AuthenticatedUserContext } from '../../provider';
import { db, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { Header } from '../../components';

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

const Record = () => {
	const { user } = useContext(AuthenticatedUserContext);
	const [isRecording, setIsRecording] = useState(false);
	const [stream, setStream] = useState(null);
	const [countdown, setCountdown] = useState(60);
	const [capturedCountdown, setCapturedCountdown] = useState(null);
	const countdownRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const [lastVideoBlob, setLastVideoBlob] = useState(null);
	const [lastVideoURL, setLastVideoURL] = useState(''); // Store the last video URL
	const videoRef = useRef(null);
	const canvasRef = useRef(null); // Canvas reference for brightness analysis
	const chunks = useRef([]);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: isStartRecordingOpen,
		onOpen: onStartRecordingOpen,
		onClose: onStartRecordingClose,
	} = useDisclosure();
	const [selectedFeeling, setSelectedFeeling] = useState('');
	const [selectedpreFeeling, setSelectedpreFeeling] = useState('');
	const handleFeelingChange = (event) => {
		setSelectedFeeling(event.target.value);
	};
	const handlePreFeelingChange = (event) => {
		setSelectedpreFeeling(event.target.value);
	};

	const handleFeelingSubmit = async () => {
		if (selectedFeeling) {
			await uploadVideo(lastVideoBlob);
			saveVideoURLToFirestore(lastVideoURL, new Date());
			onClose(); // Close the modal after submission
		} else {
			alert('Please select a feeling.');
		}
	};

	const saveVideoURLToFirestore = async (url, creationDate) => {
		const docData = {
			creator: user.uid,
			recordURL: url,
			creation: serverTimestamp(),
			creationDate: creationDate,
			feeling: selectedFeeling,
		};
		console.log(docData);
		try {
			console.log(selectedFeeling);
			await addDoc(collection(db, 'posts'), {
				creator: user.uid,
				recordURL: url,
				creation: serverTimestamp(),
				creationDate: creationDate,
				feeling: selectedFeeling,
				preFeeling: selectedpreFeeling,
			});
			console.log('Video URL saved to Firestore');
		} catch (error) {
			console.error('Error saving video URL to Firestore:', error);
		}
	};

	useEffect(() => {
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
		if (stream && isRecording) {
			const canvas = canvasRef.current;
			const video = videoRef.current;
			const ctx = canvas.getContext('2d');
			let requestId;

			const checkBrightness = () => {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				const brightness = calculateBrightness(imageData.data);
				console.log('Brightness:', brightness);

				if (brightness < 100) {
					alert('Video is too dark. Move to a brighter place.');
					stopRecording();
				} else {
					requestId = requestAnimationFrame(checkBrightness);
				}
			};

			requestId = requestAnimationFrame(checkBrightness);

			return () => {
				cancelAnimationFrame(requestId);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stream, isRecording]);

	const calculateBrightness = (data) => {
		let brightness = 0;

		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			brightness += 0.299 * r + 0.587 * g + 0.114 * b;
		}

		return brightness / (data.length / 4);
	};

	const startRecording = () => {
		if (stream) {
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			mediaRecorder.ondataavailable = (event) => {
				chunks.current.push(event.data);
			};
			mediaRecorder.onstop = async () => {
				const blob = new Blob(chunks.current, { type: 'video/mp4' });
				chunks.current = [];
				const videoLength = 60 - capturedCountdown; // Calculate the length of the video
				console.log(videoLength, 'length');
				if (videoLength < 50) {
					alert('Video must be at least 50 seconds long.');
					setLastVideoBlob(null); // Reset the blob if the video is too short
					return;
				}
				setLastVideoBlob(blob); // Store blob temporarily
				// console.log('Video recorded:', blob);
				onOpen(); // Open modal for feeling selection
			};
			mediaRecorder.start();
			setIsRecording(true);
			setCapturedCountdown(null); // Reset capturedCountdown
			setCountdown(60);
			countdownRef.current = setInterval(() => {
				setCountdown((prev) => {
					if (prev === 1) {
						stopRecording();
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
			setCapturedCountdown(countdown);
			clearInterval(countdownRef.current);
		}
	};

	const uploadVideo = async (blob) => {
		const timestamp = new Date().getTime();
		const filename = `video_${timestamp}.mp4`;
		const path = `video/${user.uid}/${filename}`;
		const storageRef = ref(storage, path);

		try {
			const snapshot = await uploadBytes(storageRef, blob, {
				customMetadata: {
					creationDate: new Date().toISOString(),
					emotions: selectedFeeling,
					preFeeling: selectedpreFeeling,
				},
			});
			const downloadURL = await getDownloadURL(snapshot.ref);
			setLastVideoURL(downloadURL); // Update the last video URL state
			console.log('Video uploaded:', downloadURL);
		} catch (error) {
			console.error('Error uploading video:', error);
			alert('Upload failed: ' + error.message);
		}
	};

	return (
		<>
			<Header profile />
			<Box position="relative" width="100%" maxW="600px" margin="auto">
				<Box mt={{ base: 10 }}>
					<video
						ref={videoRef}
						autoPlay
						muted
						style={{ width: '100%', maxHeight: '400px' }}
					/>
					<canvas ref={canvasRef} style={{ display: 'none' }} />
				</Box>

				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>How are you feeling?</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
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
						</ModalBody>
						<ModalFooter>
							<Button mt={2} onClick={handleFeelingSubmit}>
								Submit Feeling
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

				<Modal isOpen={isStartRecordingOpen} onClose={onStartRecordingClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Start Recording</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Select
								placeholder="Select your feeling"
								value={selectedpreFeeling}
								onChange={handlePreFeelingChange}
							>
								{feelings.map((feeling) => (
									<option key={feeling} value={feeling}>
										{feeling}
									</option>
								))}
							</Select>
						</ModalBody>
						<ModalFooter>
							<Button onClick={startRecording} colorScheme="red" size="lg">
								Start Recording
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

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
						<button onClick={onStartRecordingOpen}>
							<PiRecordFill size={50} color="red" />
						</button>
					)}
				</Box>
				{isRecording && (
					<Box
						display="flex"
						justifyContent="center"
						mt={{ base: 6 }}
						alignItems="center"
					>
						<p style={{ color: countdown <= 10 ? 'red' : 'black' }}>
							Countdown: {countdown}
						</p>
					</Box>
				)}
			</Box>
		</>
	);
};

export default Record;
