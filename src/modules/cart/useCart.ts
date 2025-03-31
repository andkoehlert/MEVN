import {ref, watch} from 'vue';
 

import type {CartItem, OrderItems} from '../../interfaces/interfaces'


export const useCart = () => {

    // if we have data we parse into local storge
  const cart = ref<CartItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'));

  const addToCart = (product: Omit<CartItem, 'quanity'>) => {
    const existingItem = cart.value.find(item => item._id === product._id)

    if (existingItem) {
      existingItem.quantity += 1
      console.log("Updated existing item quantity", existingItem)
    }

    else {
      cart.value.push({...product, quantity: 1})
      console.log("Added new item to cart", cart.value)
    }

    localStorage.setItem('cart', JSON.stringify(cart.value))
    console.log("Added to cart:", cart.value)

  }

  const removeFromCart = (productId: string) => {
    const existingItem = cart.value.find(item => item._id === productId)

    if (existingItem) {
      cart.value = cart.value.filter(item => item._id !== productId)
      localStorage.setItem('cart', JSON.stringify(cart.value))
    }

  }

  const updateQuantity = (productId: string, quanity: number) => {
    const item = cart.value.find(item => item._id === productId)
    localStorage.setItem('cart', JSON.stringify(cart.value))
    if (item) {
      item.quantity = quanity
      if(item.quantity <= 0) {
        removeFromCart(productId)
      }
      else {
        localStorage.setItem('cart', JSON.stringify(cart.value))
      }
    }
    console.log(`updatedQuantity: ${productId}, qty ${quanity}`)
  }

  const cartTotal = ():number => {
    return Number(cart.value.reduce((acc, item) => acc + item.price * item.quantity,  0).toFixed(2))
  }

  const cartTotalIndividualProduct = (productId: string) => {
    const item = cart.value.find(item => item._id === productId)
    return item ? item.price * item.quantity : 0
  }

  const salesTax = ():number => {
    const taxRates = 0.25
    return Math.round(cartTotal() * taxRates * 100) / 100
  }

  const code = ref<string>('')

  const couponCodeDiscount = (codes: string) => {
    const couponCodeAccepted = codes === 'DISCOUNT'
    return couponCodeAccepted ? 0.9 : 1
  }

  const grandTotal = ():number => {
    return Number(((cartTotal() + salesTax()) * couponCodeDiscount(code.value)).toFixed(2))
  }


  const orders = ref<OrderItems[]>(JSON.parse(localStorage.getItem('orders') || '[]'))

  watch(orders, (newOrders) => {
    localStorage.setItem('orders', JSON.stringify(newOrders))
  }, {deep: true})

    const checkOutBuy = () => {
      const newOrder: OrderItems = {
        _id: `order${orders.value.length + 1}`,
        orderDate: new Date().toISOString(),
        total: cartTotal(),
        orderStatus: 'Processing',
        orderNumber: orders.value.length +1,
        userName: 'John doe',
        orderLine: cart.value.map(item => ({
          product: {
            _id: item._id,
            name: item.name,
            description: '',
            price: item.price,
            imageURL: item.imageURL,
            stock: 0,
            isOnDiscount: false,
            discountPct: 0,
            isHidden: false,
            _createdBy: ''
          },
          quantity: item.quantity
        }
        ))

      }
      orders.value.push(newOrder)
      cart.value = []
      localStorage.setItem('cart', JSON.stringify(cart.value))
      console.log("Order placed", orders.value)
      localStorage.setItem('orders', JSON.stringify(orders.value))
    }
  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    salesTax,
    cartTotalIndividualProduct,
    grandTotal,
    code,
    orders,
    checkOutBuy
  }
}


