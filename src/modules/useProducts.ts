import {ref} from 'vue';
import type {newProduct, Product} from '../interfaces/interfaces'




export const useProducts = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const products = ref<Product[]>([]);


  const fecthProducts = async (): Promise<void> => {
    loading.value = true;
    try {
const response = await fetch('http://localhost:4000/api/products')
if (!response.ok) {
  throw new Error('No data available')
}

const data: Product[] = await response.json()

products.value = data
console.log("products fetched", products.value)
    }
    catch (err) {
      error.value = (err as Error).message;
    }
    finally{
      loading.value = false;
    }
  }

  const getTokenAndUserId = (): {token: string, userId: string} => {
    const token = localStorage.getItem('lsToken')
    const userId = localStorage.getItem('userIDToken')

    if (!token) {
      throw new Error('No token available')
    }
    if (!userId) {
      throw new Error('No user id available')
    }
    return {token, userId}
  }


const validateProdcut = (product: newProduct):void => {
if (!product.name) {
  throw new Error ('please provide a product name')
}
}

const setDefaultValues = (product: newProduct, userId: string) => {
  return {
    name: product.name,
    description: product.description || 'New product description default value',
    imageURL: product.imageURL || 'https://random-d.uk/api/v2/randomimg',
    price: product.price || 2,
    stock: product.stock || 45,
    isOnDiscount: product.isOnDiscount || false, 
    discountPct: product.discountPct || 0,
    isHidden: product.isHidden || false,
    _createdBy: userId
  }
}


  const addProduct = async (product: newProduct): Promise<void> => {
    try {
    const {token, userId} = getTokenAndUserId()
    validateProdcut(product)
    const productWithDefaults = setDefaultValues(product, userId)

      const response = await fetch('http://localhost:4000/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token        
        },
        body: JSON.stringify(productWithDefaults)
        
      })
      if (!response.ok) {
        throw new Error('No data available')
      }

      const newProduct: Product = await response.json()
      products.value.push(newProduct)
      console.log("prodcuts added", newProduct)

    }
    catch (err) {
      error.value = (err as Error).message
    }
  } 


  const deletedProductFromServer = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`http://localhost:4000/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'auth-token': token
      }
    })
  
  if (!response.ok) {
throw new Error('No data available')
console.log('product not deleted')
  }
  }

  const removeProductFromState = (id:String): void => {
    products.value = products.value.filter(product => product._id !== id)
    console.log("product deleted", id)
  }

  

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      
     
      const { token } = getTokenAndUserId()
      await deletedProductFromServer(id, token)
      removeProductFromState(id)
      
      console.log("id test", id)
      

 
    }
    catch (err) {
      error.value = (err as Error).message
    }
  }


const updateProductOnServer = async (id: string, updatedProduct: Partial<Product>, token: string): Promise<Product> => {
const response = await fetch(`http://localhost:4000/api/products/${id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'auth-token': token
  },

    body: JSON.stringify(updatedProduct)
}) 

    if (!response.ok) {
    throw new Error('No data availble')
}
  
const responseText = await response.text()
try {
  return JSON.parse(responseText)
}
catch {
  return { message: responseText } as unknown as Product
}
}


const updateProductInState = (id:string, updatedProduct: Product) => {
const index = products.value.findIndex(product => product._id === id)
if (index !== -1) {
  products.value[index] = updatedProduct
}
}

const updateProduct = async (id: string, updatedProduct: Partial<Product>): Promise<void> => {
  try {
    const {token} = getTokenAndUserId()
    const updatedProductResponse = await updateProductOnServer(id, updatedProduct, token )
    updateProductInState(id, updatedProductResponse)
    await fecthProducts()
  }

  catch (err) {
    error.value = (err as Error).message
  }
}


  return {error, loading, products, updateProduct, fecthProducts, deleteProduct, addProduct, getTokenAndUserId}
}