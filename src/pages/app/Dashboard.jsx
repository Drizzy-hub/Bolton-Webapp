import { Box, SimpleGrid, Text, Center } from '@chakra-ui/react';
import React from 'react';
import { Header } from '../../components';
import { MdRememberMe } from 'react-icons/md';
import { BiVideo } from 'react-icons/bi';
import { CgScreen } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import laughterImage from './laughter.jpg'; // Import the image

const Home = () => {
	return (
		<Box
			position="relative"
			width="100%"
			height="100vh"
			backgroundImage={`url(${laughterImage})`} // Use the imported image
			backgroundSize="cover"
			backgroundPosition="center"
		>
			<Box
				position="absolute"
				top="0"
				left="0"
				width="100%"
				height="100%"
				bg="rgba(0, 0, 0, 0.8)"
				filter="blur(10px)"
				zIndex="1"
			></Box>

			<Box
				position="relative"
				zIndex="2"
				paddingLeft={{ base: 12, lg: 24 }}
				paddingRight={{ base: 12, lg: 24 }}
				paddingTop={{ base: 13, lg: 26 }}
			>
				<Header />

				<Center marginTop="60px">
					<Text fontSize="4xl" fontWeight="bold" color="white">
						Welcome to Laughie😝
					</Text>
				</Center>

				<SimpleGrid
					columns={{ sm: 2, md: 3 }}
					spacing="40px"
					p="5"
					mt={'15%'}
					borderWidth="1px"
				>
					<Link to="/record">
						<Box
							borderRadius={9}
							padding={5}
							height={200}
							width={300}
							alignItems={'center'}
							display={'flex'}
							flexDirection={'row'}
							backgroundColor={'pink'}
						>
							<BiVideo size={50} color="white" />
							<Text ml={6} fontWeight={400} fontSize={16}>
								Record a Video
							</Text>
						</Box>
					</Link>
					<Link to="/view">
						<Box
							borderRadius={9}
							padding={5}
							height={200}
							width={300}
							alignItems={'center'}
							display={'flex'}
							flexDirection={'row'}
							backgroundColor={'green'}
						>
							<CgScreen size={50} color="white" />
							<Text ml={6} fontSize={16}>
								View Videos
							</Text>
						</Box>
					</Link>
					<Link to="/reminder">
						<Box
							borderRadius={9}
							padding={5}
							height={200}
							width={300}
							alignItems={'center'}
							display={'flex'}
							flexDirection={'row'}
							backgroundColor={'grey'}
						>
							<MdRememberMe size={50} color="white" />
							<Text ml={6} fontSize={16}>
								Create Reminder
							</Text>
						</Box>
					</Link>
				</SimpleGrid>
			</Box>
		</Box>
	);
};

export default Home;
