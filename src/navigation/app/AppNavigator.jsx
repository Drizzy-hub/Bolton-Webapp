import { Dashboard, Profile } from '../../pages/app';
import Record from '../../pages/app/Record';
import Reminder from '../../pages/app/Reminder';
import View from '../../pages/app/View';

const AppNavigator = [
	{ path: '/', name: 'Home', Component: Dashboard },
	{ path: '/record', name: 'Record', Component: Record },
	{ path: '/view', name: 'View', Component: View },
	{ path: '/reminder', name: 'Reminder', Component: Reminder },
	{ path: '/profile', name: 'Profile', Component: Profile },
];

export default AppNavigator;
