import React, { useContext, useEffect, useState } from 'react';
import { AuthenticatedUserContext } from '../../provider';
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { auth, db } from '../../firebase';
import {
	Box,
	FormControl,
	FormLabel,
	Input,
	Select,
	Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Header } from '../../components';

const Profile = () => {
	const { userData, user } = useContext(AuthenticatedUserContext);
	const [formData, setFormData] = useState({
		dob: '',
		sex: '',
		emotionalStability: '',
		employmentStatus: '',
		financialWorry: '',
		chronicConditions: '',
		civilStatus: '',
		incomeSatisfaction: '',
		healthServiceSatisfaction: '',
		laughterFrequency: '',
		meansLaughter: '',
		visitingDoctor: '',
		reasonDoctor: '',
		healthStatus: '',
		socioEconomicHealth: '',
	});
	const sexes = ['Male', 'Female', 'Intersex', 'Prefer not to say'];

	const statuses = ['Employed: Full-time, part-time or contract', 'Self-employed: Freelancers, consultants, or business owners',
		'Unemployed: Actively looking for work', 'Student: Full-time or part-time education', 'Retired', 'Homemaker', 'Other']
	
	const civilStatus = ['Divorced', 'Married' , 'Never Married', 'Separated(but still in a registered partnership)', 'Separated(but still legally married)', 'Widowed', 'Prefer not to say']

	useEffect(() => {
		const fetchUserData = async () => {
			const userDoc = await getDoc(doc(db, 'users', user?.uid));
			if (userDoc.exists()) {
				console.log(userDoc.data(), 'new');
				setFormData({
					age: userDoc.data().age || '',
					emotionalStability: userDoc.data().emotionalStability || '',
					employmentStatus: userDoc.data().employmentStatus || '',
					financialWorry: userDoc.data().financialWorry || '',
					incomeSatisfaction: userDoc.data().incomeSatisfaction || '',
					healthServiceSatisfaction:
						userDoc.data().healthServiceSatisfaction || '',
					laughterFrequency: userDoc.data().laughterFrequency || '',
					meansLaughter: userDoc.data().meansLaughter || '',
					visitingDoctor: userDoc.data().visitingDoctor || '',
					reasonDoctor: userDoc.data().reasonDoctor || '',
					healthStatus: userDoc.data().healthStatus || '',
					socioEconomicHealth: userDoc.data().socioEconomicHealth || '',
				});
			}
		};
		fetchUserData();
	}, [userData, user]);

	const handleChange = (name, value) => {
		setFormData({ ...formData, [name]: value });
	};

	const saveData = async (field, value) => {
		try {
			await updateDoc(doc(db, 'users', user.uid), { [field]: value });
			alert('Profile Updated', 'Your profile has been updated successfully.');
		} catch (error) {
			console.error('Error updating profile: ', error);
			alert('Error', 'There was an error updating your profile.');
		}
	};

	const navigate = useNavigate();

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				localStorage.removeItem('user');
				navigate('/login');
				window.location.reload();
				console.log('Signed out successfully');
			})
			.catch((error) => {
				// An error happened.
			});
	};

	return (
		<>
			<Header profile />
			<Box padding={{ base: 12 }} overflowY="scroll">
				<FormControl>
					<FormLabel>Name</FormLabel>
					<Input
						aria-label="Name"
						mb={4}
						editable={false}
						value={userData?.name}
						placeholder="Name"
						label={'First Name'}
					/>
					<FormLabel>Email</FormLabel>
					<Input
						mb={4}
						editable={false}
						label={'Email'}
						value={user?.email}
						placeholder={'Email'}
					/>
					<FormLabel>Phone Number</FormLabel>
					<Input
						mb={4}
						editable={false}
						label={'Phone Number'}
						value={userData?.phone}
						placeholder={'Phone Number'}
					/>

					<FormControl id="birthDate" isRequired>
						<FormLabel>Date of Birth</FormLabel>
						<Input
							type="date"
							value={formData.dob}
							onChange={(e) => handleChange('dob',e.target.value)}
						/>
					</FormControl>
					<FormLabel>Sex</FormLabel>
					<Select
						mb={4}
						value={formData.sex}
						onChange={(e) => handleChange('sex', e.target.value)}
						onBlur={() => saveData('sex', formData.sex)}
					>
						{sexes.map((range) => (
							<option key={range} value={range}>
								{range}
							</option>
						))}
					</Select>
					<FormLabel>Emotional Stability</FormLabel>
					<Input
						mb={4}
						value={formData.emotionalStability}
						onChange={(e) => handleChange('emotionalStability', e.target.value)}
						onBlur={() =>
							saveData('emotionalStability', formData.emotionalStability)
						}
						label={'Emotional Stability'}
						placeholder={'Emotionally Stable'}
					/>
					<FormLabel>Employment Status</FormLabel>
					<Select
						mb={4}
						value={formData.employmentStatus}
						onChange={(e) => handleChange('employmentStatus', e.target.value)}
						onBlur={() =>
							saveData('employmentStatus', formData.employmentStatus)
						}
					>
						{statuses.map((range) => (
							<option key={range} value={range}>
								{range}
							</option>
						))}
						
					</Select>
					
					<FormLabel>Civil Status</FormLabel>
					<Select
						mb={4}
						value={formData.civilStatus}
						onChange={(e) => handleChange('civilStatus', e.target.value)}
						onBlur={() =>
							saveData('civilStatus', formData.employmentStatus)
						}
					>
						{civilStatus.map((range) => (
							<option key={range} value={range}>
								{range}
							</option>
						))}

					</Select>
					
					
					<FormLabel>Financial Worry</FormLabel>
					<Input
						mb={4}
						value={formData.financialWorry}
						onChange={(e) => handleChange('financialWorry', e.target.value)}
						onBlur={() => saveData('financialWorry', formData.financialWorry)}
						label={
							'How often do you worry about meeting your financial obligations, such as rent, utility bills, or loan repayments?'
						}
						placeholder={
							'How often do you worry about meeting your financial obligations, such as rent, utility bills, or loan repayments?'
						}
					/>
					<FormLabel>Income Satisfaction</FormLabel>
					<Input
						mb={4}
						value={formData.incomeSatisfaction}
						onChange={(e) => handleChange('incomeSatisfaction', e.target.value)}
						onBlur={() =>
							saveData('incomeSatisfaction', formData.incomeSatisfaction)
						}
						label={'How satisfied are you with your current level of income?'}
						placeholder={
							'How satisfied are you with your current level of income?'
						}
					/>

					<FormLabel>Chronic Conditions ( Yes or No, and condition-optional)</FormLabel>
					<Input
						mb={4}
						value={formData.chronicConditions}
						onChange={(e) => handleChange('chronicConditions', e.target.value)}
						onBlur={() =>
							saveData('chronicConditions', formData.chronicConditions)
						}
						//label={'How satisfied are you with your current level of income?'}
						placeholder={
							'Do you have any chronic conditions?, if yes, do you mind sharing?'
						}
					/>

					<FormLabel>Health Service Satisfaction</FormLabel>
					<Input
						mb={4}
						value={formData.healthServiceSatisfaction}
						onChange={(e) =>
							handleChange('healthServiceSatisfaction', e.target.value)
						}
						onBlur={() =>
							saveData(
								'healthServiceSatisfaction',
								formData.healthServiceSatisfaction
							)
						}
						label={'How satisfied are you with the health service'}
						placeholder={'How satisfied are you with the health service'}
					/>
					<FormLabel>How often do you laugh?</FormLabel>
					<Input
						mb={4}
						value={formData.laughterFrequency}
						onChange={(e) => handleChange('laughterFrequency', e.target.value)}
						onBlur={() =>
							saveData('laughterFrequency', formData.laughterFrequency)
						}
						label={'How often do you laugh?'}
						placeholder={'How often do you laugh?'}
					/>
					<FormLabel>How are you laughing?</FormLabel>
					<Input
						mb={4}
						value={formData.meansLaughter}
						onChange={(e) => handleChange('meansLaughter', e.target.value)}
						onBlur={() => saveData('meansLaughter', formData.meansLaughter)}
						label={'How are you laughing?'}
						placeholder={'How are you laughing?'}
					/>
					<FormLabel>Are you visiting the doctor?</FormLabel>
					<Input
						mb={4}
						value={formData.visitingDoctor}
						onChange={(e) => handleChange('visitingDoctor', e.target.value)}
						onBlur={() => saveData('visitingDoctor', formData.visitingDoctor)}
						label={'Are you visiting the doctor?'}
						placeholder={'Are you visiting the doctor?'}
					/>
					<FormLabel>What is the purpose of visiting the doctor?</FormLabel>
					<Input
						mb={4}
						value={formData.reasonDoctor}
						onChange={(e) => handleChange('reasonDoctor', e.target.value)}
						onBlur={() => saveData('reasonDoctor', formData.reasonDoctor)}
						label={'What is the purpose of visiting doctor?'}
						placeholder={'What is the purpose of visiting doctor?'}
					/>
					<FormLabel>How would you rate your current health status?</FormLabel>
					<Input
						mb={4}
						value={formData.healthStatus}
						onChange={(e) => handleChange('healthStatus', e.target.value)}
						onBlur={() => saveData('healthStatus', formData.healthStatus)}
						label={'How would you rate your current health status?'}
						placeholder={'How would you rate your current health status?'}
					/>
					<FormLabel>
						How would you rate your current socio-economic health?
					</FormLabel>
					<Input
						mb={4}
						value={formData.socioEconomicHealth}
						onChange={(e) =>
							handleChange('socioEconomicHealth', e.target.value)
						}
						onBlur={() =>
							saveData('socioEconomicHealth', formData.socioEconomicHealth)
						}
						label={'How would you rate your current socio-economic health?'}
						placeholder={
							'How would you rate your current socio-economic health?'
						}
					/>
				</FormControl>
				<Box style={{ marginTop: 20 }}>
					<Text color={'#4894FE'} cursor={'pointer'} onClick={handleLogout}>
						Log out
					</Text>
					<Text color={'red'}>Delete Account</Text>
				</Box>
			</Box>
		</>
	);
};

export default Profile;
