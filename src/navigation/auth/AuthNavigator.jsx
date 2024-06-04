
import { Login, Signup } from '../../pages';

const AuthNavigator =  [
  { path: '/', name: 'Login', Component: Login },
  { path: '/signup', name: 'Signup', Component: Signup },
]
  
export default AuthNavigator;