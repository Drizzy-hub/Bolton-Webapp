import { Box, Heading } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../firebase';
import { AuthenticatedUserContext } from '../../provider';
import { collection, getDocs, query, where } from '@firebase/firestore';

const View = () => {
	const { user } = useContext(AuthenticatedUserContext);
	const [videosByDay, setVideosByDay] = useState({});

	useEffect(() => {
		if (user) {
			fetchVideos(user);
		}
	}, [user]);

	const fetchVideos = async (user) => {
		try {
			// Fetch video documents from Firestore
			const q = query(
				collection(db, 'posts'),
				where('creator', '==', user.uid)
			);
			const querySnapshot = await getDocs(q);
			const videos = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				console.log(data.creation, 'data');
				videos.push({
					url: data.recordURL, // Use recordURL directly as it contains the download URL
					creation: data.creation,
				});
			});

			// Categorize videos by creation day
			const categorizedVideos = categorizeByDay(videos);
			setVideosByDay(categorizedVideos);
		} catch (error) {
			console.error('Error fetching videos:', error);
		}
	};

	const categorizeByDay = (videos) => {
		const videosByDay = {};

		videos.forEach((video) => {
			const creationDate = video.creation.toDate();
			const dateKey = creationDate.toDateString();

			if (!videosByDay[dateKey]) {
				videosByDay[dateKey] = [];
			}
			videosByDay[dateKey].push(video);
		});

		return videosByDay;
	};

	return (
		<Box overflowY="scroll" maxHeight="80vh" padding="20px">
			{Object.keys(videosByDay).map((day) => (
				<Box key={day} marginBottom="20px">
					<Heading as="h3" size="lg" marginBottom="10px">
						{day}
					</Heading>
					{videosByDay[day].map((video, index) => (
						<Box key={index} marginBottom="20px">
							<video
								controls
								autoPlay
								style={{ width: '100%', maxHeight: '400px' }}
								preload="auto"
								src={video.url} // Set src to video.url
							/>
						</Box>
					))}
				</Box>
			))}
		</Box>
	);
};

export default View;
