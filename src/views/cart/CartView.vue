<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Checkout Section</h2>
    <p class="text-center pt-5">Items have been order <br> You have no orders currently</p> <!-- If cart is empty -->
    <div v-for="item in cart" :key="item._id"> <!-- If cart is not empty -->
      <div class="flex items-center mb-4 border-b pb-4"> <!-- Loop through the cart items -->
        <!-- First Column: Image -->
        <div class="w-1/6">
          <img :src="item.imageURL"  alt="Product Image" class="w-full h-24 object-cover rounded-lg"> <!-- Product image -->
        </div>
        <!-- Second Column: Title and Description -->
        <div class="w-2/6 px-4">
          <p class="font-semibold">{{ item.name }}</p> <!-- Product name -->
         <!--  <p class="text-gray-500">{{ item.description }}</p> -->
        </div>
        <!-- Third Column: Quantity with + and - -->
        <div class="w-1/6 flex items-center">
          <button @click="updateQuantity(item._id, item.quantity - 1)"  class="bg-orange-600 px-2">-</button> <!-- Decrease quantity -->
          <span class="mx-2">{{ item.quantity }}</span> <!-- Quantity -->
          <button @click="updateQuantity(item._id, item.quantity + 1)" class="bg-teal-600 px-2">+</button> <!-- Increase quantity -->
        </div>
        <!-- Fourth Column: Total Price -->
        <div class="w-1/6 text-right">
          <p class="font-semibold">Total $ {{ cartTotalIndividualProduct(item._id).toFixed(2) }}</p> <!-- Total price of the product with .toFixed() -->
        </div>
      </div>

      <!-- Summary Row -->
      <div class="mt-4 pt-4">
        <div class="flex justify-between mb-2">
          <p class="font-semibold">Subtotal: {{ cartTotal() }}</p>
          <p>$</p> <!-- Total in the cart -->
        </div>
        <div class="flex justify-between mb-2">
          <p class="font-semibold">Sales Tax: {{ salesTax }}</p>
          <p>$</p>  <!-- Salestax in the cart -->
        </div>
        <div class="flex justify-between mb-2">
          <p class="font-semibold">Coupon Code:</p>
          <input type="text" class="border p-1 pr-2 bg-[#181818] text-right w-28" placeholder="Enter code" v-model="code"> <!-- Coupon code -->
           </div>
        <div class="flex justify-between mb-4">
          <p class="font-semibold">Grand Total:</p>
          <p>$ {{ grandTotal() }}</p>  <!-- Grand total in the cart -->
        </div>
        <div class="flex justify-end">
          <button @click="checkOutBuy" class="bg-orange-600 text-white p-2 rounded hover:bg-orange-700" >Buy Now</button> <!-- Checkout button on click -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '@/modules/cart/useCart';


const {cart, updateQuantity, checkOutBuy, cartTotal, salesTax, grandTotal, code, cartTotalIndividualProduct} = useCart()


</script>

<style scoped>
/* Add your styles here */
</style>
