<template class="w-screen">
  <header class="text-white py-4">
    <div class="wrapper" >

      <nav class="">
        <RouterLink to="/" class="mr-4">Home</RouterLink>
        <RouterLink to="/about" class="mr-4">About</RouterLink>
        <RouterLink to="/products" class="mr-4">Products</RouterLink>
        <RouterLink to="/auth" class="mr-4">Auth</RouterLink>
        <RouterLink v-if="isLoggedIn" to="/admin" class="mr-4">Admin</RouterLink>


        <button class="mr-4" v-if="isLoggedIn" @click="logout">Logout</button>
        <!-- RouterLink to products, Auth, Admin & and logout button -->


        <!-- toggle cart button -->
        <button class="mr-4" @click="toggleCart">Cart</button>

        <!-- Routerlink to orders -->


      </nav>
    </div>
  </header>

  <RouterView />



  <!-- CartBasket component -->
  <CartBasket v-if="isCartVisible" :isVisible="isCartVisible" />

</template>

<script setup lang="ts">
import {computed} from 'vue'
import { useUsers } from './modules/auth/user'
import { RouterLink, RouterView } from 'vue-router'
import {state} from './modules/globalStates/state'

import { ref } from 'vue'
import CartBasket  from './components/cart/CartBasketView.vue'


const isCartVisible = ref(false)

const toggleCart = () => {
  // Like a if else statement.
  isCartVisible.value = !isCartVisible.value
  console.log(isCartVisible.value)
}

const {logout} = useUsers()
const isLoggedIn = computed(() => state.isLoggedIn)

</script>


<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
./modules/globalStates/state./modules/golbalStates/state