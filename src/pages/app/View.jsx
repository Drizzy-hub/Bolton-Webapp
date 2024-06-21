import { Box, Heading, Text } from '@chakra-ui/react';
import { getDownloadURL, listAll, ref, getMetadata } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { storage } from '../../firebase';
import { AuthenticatedUserContext } from '../../provider';
import { Header } from '../../components';
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import react-calendar styles

const View = () => {
	const { user } = useContext(AuthenticatedUserContext);
	const [videosByDay, setVideosByDay] = useState({});

	const [selectedDate, setSelectedDate] = useState(null); // State to store the selected date

	useEffect(() => {
		if (user && selectedDate) {
			fetchVideos(user, selectedDate);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, selectedDate]);

	const fetchVideos = async (user, selectedDate) => {
		try {
			const storageRef = ref(storage, `video/${user.uid}`);
			const listResult = await listAll(storageRef);
			const videoUrls = [];
			for (const itemRef of listResult.items) {
				const metadata = await getMetadata(itemRef);
				const creationDate = metadata.customMetadata?.creationDate;
				const emotions = metadata.customMetadata?.emotions;
				// Check if video matches the selected date
				if (
					creationDate &&
					new Date(creationDate).toDateString() === selectedDate
				) {
					const downloadURL = await getDownloadURL(itemRef);
					// const feeling = await fetchFeeling(downloadURL); // Fetch feeling associated with the video
					videoUrls.push({
						url: downloadURL,
						creation: creationDate,
						feeling: emotions,
					});
				}
			}
			const categorizedVideos = categorizeByDay(videoUrls);
			setVideosByDay(categorizedVideos);
		} catch (error) {
			console.error('Error fetching videos:', error);
		}
	};

	const categorizeByDay = (videos) => {
		const videosByDay = {};

		videos.forEach((video) => {
			const creationDate = new Date(video.creation);
			const dateKey = creationDate.toDateString();

			if (!videosByDay[dateKey]) {
				videosByDay[dateKey] = [];
			}
			videosByDay[dateKey].push(video);
		});

		return videosByDay;
	};

	const handleDateChange = (date) => {
		const selectedDateString = date.toDateString(); // Convert selected date to string
		setSelectedDate(selectedDateString); // Update selected date state
	};
	console.log(videosByDay[selectedDate], 'data');
	return (
		<>
			<Header profile />
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flexDirection="column"
				padding="20px"
			>
				{/* Calendar component for date selection */}
				<Calendar
					onChange={handleDateChange}
					value={selectedDate ? new Date(selectedDate) : new Date()}
				/>
				{/* Display videos for the selected date */}
				{selectedDate && (
					<Box marginTop="20px">
						<Heading as="h2" size="lg" marginBottom="20px">
							Videos for {selectedDate}
						</Heading>
						{videosByDay[selectedDate]?.length > 0 ? (
							videosByDay[selectedDate].map((video, index) => (
								<Box key={index} marginBottom="20px">
									<video
										controls
										autoPlay
										style={{ width: '100%', maxHeight: '400px' }}
										preload="auto"
										src={video.url}
									/>
									<Text backgroundColor={'lightblue'} mt={2} fontSize="lg">
										Feeling: {video.feeling}
									</Text>
								</Box>
							))
						) : (
							<Heading as="h4" size="md" marginBottom="20px">
								No videos available for this date.
							</Heading>
						)}
					</Box>
				)}
			</Box>
		</>
	);
};

export default View;
