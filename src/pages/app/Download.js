import { Box, Heading, Button } from '@chakra-ui/react';
import { getDownloadURL, listAll, ref, getMetadata } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { storage } from '../../firebase';
import { Header } from '../../components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Download = () => {
	const [videosByDay, setVideosByDay] = useState({});
	const [selectedDate, setSelectedDate] = useState(null);

	useEffect(() => {
		if (selectedDate) {
			fetchVideos(selectedDate);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDate]);

	const fetchVideos = async (selectedDate) => {
		try {
			const storageRef = ref(storage, 'video');
			const listResult = await listAll(storageRef);
			const videoUrls = [];
			for (const folderRef of listResult.prefixes) {
				const userListResult = await listAll(folderRef);
				for (const itemRef of userListResult.items) {
					const metadata = await getMetadata(itemRef);
					const creationDate = metadata.customMetadata?.creationDate;
					const emotions = metadata.customMetadata?.emotions;
					if (
						creationDate &&
						new Date(creationDate).toDateString() === selectedDate
					) {
						const downloadURL = await getDownloadURL(itemRef);
						videoUrls.push({
							url: downloadURL,
							creation: creationDate,
							feeling: emotions,
							name: itemRef.name,
						});
					}
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
		const selectedDateString = date.toDateString();
		setSelectedDate(selectedDateString);
	};

	const handleDownload = async (url, name) => {
		try {
			console.log(`Attempting to fetch video from URL: ${url}`);
			const response = await fetch(url, {
				mode: 'cors', // Ensure CORS is enabled
			});

			if (!response.ok) {
				throw new Error(`Network response was not ok: ${response.statusText}`);
			}

			const blob = await response.blob();
			console.log('Blob successfully fetched:', blob);

			// Create a temporary link element for the download
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = name;

			// Append the link to the body (required for Firefox)
			document.body.appendChild(link);

			// Programmatically click the link to trigger the download
			link.click();

			// Clean up: remove the link element
			document.body.removeChild(link);

			console.log('Download link created and clicked');
		} catch (error) {
			console.error('Failed to fetch video:', error);
			alert(
				`Failed to download video. Please try again. Error: ${error.message}`
			);
		}
	};

	const handleBulkDownload = async (videos) => {
		try {
			const downloadPromises = videos.map((video, index) =>
				handleDownload(video.url, `video-${index}.mp4`)
			);
			await Promise.all(downloadPromises);
			console.log('All videos downloaded');
		} catch (error) {
			console.error('Error during bulk download:', error);
		}
	};

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
				<Calendar
					onChange={handleDateChange}
					value={selectedDate ? new Date(selectedDate) : new Date()}
				/>
				{selectedDate && (
					<Box marginTop="20px">
						<Heading as="h2" size="lg" marginBottom="20px">
							Videos for {selectedDate}
						</Heading>
						{videosByDay[selectedDate]?.length > 0 ? (
							<>
								<Button
									colorScheme="blue"
									onClick={() => handleBulkDownload(videosByDay[selectedDate])}
									marginBottom="20px"
								>
									Download All
								</Button>
								{videosByDay[selectedDate].map((video, index) => (
									<Box key={index} marginBottom="20px">
										<Button
											colorScheme="blue"
											onClick={() =>
												handleDownload(video.url, `video-${index}.mp4`)
											}
										>
											Download
										</Button>
									</Box>
								))}
							</>
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

export default Download;
