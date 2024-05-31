import { Box, Text } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { AuthenticatedUserContext } from "../provider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";




const Header = () => {
  const { user, setUserData, userData } = useContext(AuthenticatedUserContext);
  

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        console.log(user.uid, 'id')
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
            console.log(userDoc, 'test~login');
          } else {
            console.log('No such document!');
            console.log(userDoc.data(), 'test~login');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user, setUserData]); 

  return (
    <Box>
      <Box>
        <Text>Hello,</Text>
            
      </Box>
      <Box>
    UserIcon
      </Box>
    </Box>
  );
};

export default Header;
