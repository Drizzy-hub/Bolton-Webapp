import { Box, Text } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { AuthenticatedUserContext } from '../provider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserIcon } from '../assets'; // Assuming ArrowLeftIcon is your back arrow icon
import { Link, useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

const Header = ({ profile }) => {
	const { user, setUserData, userData } = useContext(AuthenticatedUserContext);

	useEffect(() => {
		const fetchUserData = async () => {
			if (user && user.uid) {
				try {
					const userDoc = await getDoc(doc(db, 'users', user.uid));
					if (userDoc.exists()) {
						setUserData(userDoc.data());
					} else {
						console.log('No such document!');
					}
				} catch (error) {
					console.error('Error fetching user data:', error);
				}
			}
		};

		fetchUserData();
	}, [user, setUserData]);
	const navigate = useNavigate();

	return (
		<>
			{profile ? (
				// Render back arrow icon for profile
				<Box ml={12} mt={12} display="flex" alignItems="center">
					<BiArrowBack size={24} onClick={() => navigate(-1)} />
				</Box>
			) : (
				// Render normal header content
				<Box
					flexDirection="row"
					display="flex"
					alignItems="center"
					justifyContent="space-between"
				>
					<Box maxWidth={400}>
						<Text fontSize={16} fontWeight={400} color="#8696BB">
							Hello,
						</Text>
						<Text fontSize={{ base: '10px', lg: '20px' }} fontWeight={700}>
							{userData?.name}
						</Text>
					</Box>
					<Box>
						<Link to="/profile">
							<UserIcon />
						</Link>
					</Box>
				</Box>
			)}
		</>
	);
};

export default Header;
