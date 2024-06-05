import React, { useContext, useEffect, useState } from 'react';
import { AuthenticatedUserContext } from '../../provider';
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { auth, db } from '../../firebase';
import { Box, Input, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const Profile = () => {
    const { userData, user} = useContext(AuthenticatedUserContext);  
    const [formData, setFormData] = useState({
      age: "",
      emotionalStability: "",
      employmentStatus: "",
      financialWorry: "",
      incomeSatisfaction: "",
      healthServiceSatisfaction: "",
    });
  
    useEffect(() => {
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, "users", user?.uid));
        if (userDoc.exists()) {
          console.log(userDoc.data(), "new");
        }
        setFormData({
          age: userDoc.data().age || "",
          emotionalStability: userDoc.data().emotionalStability || "",
          employmentStatus: userDoc.data().employmentStatus || "",
          financialWorry: userDoc.data().financialWorry || "",
          incomeSatisfaction: userDoc.data().incomeSatisfaction || "",
          healthServiceSatisfaction:
            userDoc.data().healthServiceSatisfaction || "",
        });
      };
      fetchUserData();
    }, [userData, user]);
  
    const handleChange = (name, value) => {
      setFormData({ ...formData, [name]: value });
    };
    const saveData = async (field, value) => {
      try {
        await updateDoc(doc(db, "users", user.uid), { [field]: value });
        alert("Profile Updated", "Your profile has been updated successfully.");
      } catch (error) {
        console.error("Error updating profile: ", error);
        alert("Error", "There was an error updating your profile.");
      }
    };
    const navigate = useNavigate();
 
    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
        localStorage.removeItem('user')
            navigate("/login");
            window.location.reload();
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }
    return (
     <Box padding={{base:12}} overflowY="scroll">
            <Input
            mb={4}
              editable={false}
              value={userData?.name}
              placeholder="Name"
              label={"First Name"}
            />
            <Input
            mb={4}
              editable={false}
              label={"Email"}
              value={user?.email}
              placeholder={"Email"}
         
            />
            <Input
            mb={4}
              editable={false}
              label={"Phone Number"}
              value={userData?.phone}
              placeholder={"Phone Number"}
            />
            <Input
            mb={4}
              label={"Age"}
              placeholder={"Age"}
              value={formData.age}
              onChange={(value) => handleChange("age", value)}
              onBlur={() => saveData("age", formData.age)}
              
            />
            <Input
            mb={4}
              value={formData.emotionalStability}
              onChange={(value) => handleChange("emotionalStability", value)}
              onBlur={() =>
                saveData("emotionalStability", formData.emotionalStability)
              }
              label={"Emotional Stability"}
              placeholder={"Emotionally Stable"}
              
            />
            <Input
            mb={4}
              value={formData.employmentStatus}
              onChange={(value) => handleChange("employmentStatus", value)}
              onBlur={() =>
                saveData("employmentStatus", formData.employmentStatus)
              }
              label={"What is your current employment Status?"}
              placeholder={"What is your current employment Status"}
             
            />
            <Input
            mb={4}
              value={formData.financialWorry}
              onChange={(value) => handleChange("financialWorry", value)}
              onBlur={() => saveData("financialWorry", formData.financialWorry)}
              label={
                "How often do you worry about meeting your financial obligations, such as rent, utility bills, or loan repayments?"
              }
              placeholder={
                "How often do you worry about meeting your financial obligations, such as rent, utility bills, or loan repayments?"
              }
              
            />
            <Input
            mb={4}
              value={formData.incomeSatisfaction}
              onChange={(value) => handleChange("incomeSatisfaction", value)}
              onBlur={() =>
                saveData("incomeSatisfaction", formData.incomeSatisfaction)
              }
              label={"How satisfied are you with your current level of income?"}
              placeholder={
                "How satisfied are you with your current level of income?"
              }
             
            />
            <Input
            mb={4}
              value={formData.healthServiceSatisfaction}
              onChange={(value) =>
                handleChange("healthServiceSatisfaction", value)
              }
              onBlur={() =>
                saveData(
                  "healthServiceSatisfaction",
                  formData.healthServiceSatisfaction
                )
              }
              label={"How satisfied are you with the health service"}
              placeholder={"How satisfied are you with the health service"}
            />
            <Box style={{ marginTop: 20 }}>
              <Text color={'#4894FE'} cursor={'pointer'} onClick={handleLogout} >Log out</Text>
              <Text color={'red'}>
                Delete Account
              </Text>
            </Box>
        </Box>
    )
  }
export default Profile;