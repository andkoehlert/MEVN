import {reactive, watch} from 'vue'


// initialize isLoggedIn from localStorage or default to false

const isLoggedInFromStorage = localStorage.getItem('isLoggedIn') === 'true'

export const state = reactive({
  isLoggedIn: isLoggedInFromStorage
})


// watch for changes in isloggedin and update localstorage
watch(() => state.isLoggedIn, (newValue) => {
  localStorage.setItem('isLoggedIn', String(newValue))
})