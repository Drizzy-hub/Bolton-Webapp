import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';
import { Header } from '../../components';
import { MdRememberMe } from 'react-icons/md';
import { BiVideo } from 'react-icons/bi';
import { CgScreen } from 'react-icons/cg';
import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<Box
			paddingLeft={{ base: 12, lg: 24 }}
			paddingRight={{ base: 12, lg: 24 }}
			paddingTop={{ base: 13, lg: 26 }}
		>
			<Header />
			<SimpleGrid
				columns={{ sm: 2, md: 3 }}
				spacing="40px"
				p="5"
				mt={'15%'}
				borderWidth="1px"
			>
				<Link to="/record">
					<Box
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
	);
};

export default Home;
