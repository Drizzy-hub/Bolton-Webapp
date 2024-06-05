import { Dashboard, Profile } from '../../pages/app';

const AppNavigator =  [
  { path: '/', name: 'Home', Component: Dashboard },
  { path: '/profile', name: 'Profile', Component: Profile },
]


export default AppNavigator;