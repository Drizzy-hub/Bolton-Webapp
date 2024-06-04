import { Box, Text } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { AuthenticatedUserContext } from "../provider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserIcon } from "../assets";




const Header = () => {
  const { user, setUserData, userData } = useContext(AuthenticatedUserContext);
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
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

  return (
    <Box flexDirection={'row'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
      <Box maxWidth={400}>
        <Text fontSize={16} fontWeight={400} color={'#8696BB'}>Hello,</Text>
        <Text fontSize={{ base: '10px', lg: '20px' }} fontWeight={700}>{userData?.name}</Text>
      </Box>
      <Box>
    <UserIcon />
      </Box>
    </Box>
  );
};

export default Header;
