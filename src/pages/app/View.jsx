import { Box, Heading } from '@chakra-ui/react';
import { getDownloadURL, listAll, ref, getMetadata } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { storage } from '../../firebase';
import { AuthenticatedUserContext } from '../../provider';

const View = () => {
	const { user } = useContext(AuthenticatedUserContext);
	const [videosByDay, setVideosByDay] = useState({});

	useEffect(() => {
		if (user) {
			fetchVideos(user);
		}
	}, [user]);

	const fetchVideos = async (user) => {
		console.log(user, 'check');
		try {
			const storageRef = ref(storage, `video/${user.uid}`);
			const listResult = await listAll(storageRef);
			const videoUrls = [];
			for (const itemRef of listResult.items) {
				const downloadURL = await getDownloadURL(itemRef);
				const metadata = await getMetadata(itemRef);
				const creationDate = metadata.customMetadata?.creationDate;
				videoUrls.push({ url: downloadURL, creation: creationDate });
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
								src={video.url}
							/>
						</Box>
					))}
				</Box>
			))}
		</Box>
	);
};

export default View;
