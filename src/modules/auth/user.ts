import {ref} from 'vue';
import type {User} from '../../interfaces/interfaces'
import { useRouter } from 'vue-router';
import {state} from '../globalStates/state'

export const useUsers = () => {
  
  const token = ref<string | null>(null);
 /* const isLoggedIn = ref<boolean>(false); */
  const error = ref<string | null>(null);
  const user = ref<User | null>(null);

  const name = ref<string>('');
  const email = ref<string>('');
  const password = ref<string>('');
  const router = useRouter()

const fetchToken = async (email: string, password: string): Promise<void> => {
try {
  const response = await fetch('http://localhost:4000/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('lsToken') || ''  
    },
    body: JSON.stringify({email, password})
  })

  if (!response.ok) {
    const errorRespone = await response.json()
    console.log(errorRespone.error || 'An error occured')
    throw new Error('Invaliod email or password')
  }

  const authResponse = await response.json()
  const { token: authToken, userId } = authResponse.data
  
  token.value = authResponse.data.token
  user.value = authResponse.data.user

  state.isLoggedIn = true
  localStorage.setItem('lsToken', authToken)
  localStorage.setItem('userIDToken', userId)
  console.log('user is logged in:', authResponse)
  console.log('token:', token.value)
}

catch (err) {
  error.value = (err as Error).message || 'An error occured'
  state.isLoggedIn = false
}
}


const logout = () => {
  token.value = null
  user.value = null
  state.isLoggedIn = false
  localStorage.removeItem('lsToken')
  console.log("user is logged out")
}





// register user
const registerUser = async (name: string, email:string, password:string): Promise<void> => {

  try {
    const response = await fetch('http://localhost:4000/api/user/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({name, email, password})
    })
    if (!response.ok) {
    
      throw new Error('Invaliod email or password')
    }
  
    const authResponse = await response.json()
    token.value = authResponse.data.token
    user.value = authResponse.data.user
    state.isLoggedIn = true
  
    localStorage.setItem('lsToken', authResponse.data.token)
    localStorage.setItem('userIDToken', authResponse.data.userID)
    console.log('user is created:', authResponse)
    console.log('token:', token.value)
    
  }
  
  catch (err) {
    error.value = (err as Error).message || 'An error occured'
    state.isLoggedIn = false
  }
  }

return {
  token,
  isLoggedIn: state.isLoggedIn,
  error,
  user,
  name,
  email,
  password,
  fetchToken,
  registerUser,
  logout
}
}