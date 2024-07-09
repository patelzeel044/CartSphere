import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export function addToCart(item) {
  return new Promise(async (resolve) =>{
   //TODO: we will not hard-code server URL here
   const response = await fetch('http://localhost:3000/cart',{
      method:'POST',
      body:JSON.stringify(item),
      headers:{"content-type": "application/json"},
   }) 
   const data = await response.json()
   resolve({data})
 }
 );
}

export function updateCart(update) {
  return new Promise(async (resolve) =>{
   //TODO: we will not hard-code server URL here
   const response = await fetch('http://localhost:3000/cart/'+update.id,{
      method:'PATCH',
      body:JSON.stringify(update),
      headers:{"content-type": "application/json"},
   }) 
   
   const data = await response.json()
   console.log(data)
   resolve({data})
 }
 );
}

export function deleteItemFromCart(itemId) {
  return new Promise(async (resolve) =>{
   //TODO: we will not hard-code server URL here
   const response = await fetch('http://localhost:3000/cart/'+itemId,{
      method:'DELETE',
      body:JSON.stringify(itemId),
      headers:{"content-type": "application/json"},
   }) 
   const data = await response.json()
   console.log(data)
   console.log({data:{id:itemId}})
   resolve({data:{id:itemId}})
 }
 );
}


export function fetchItemsByUserId(userId) {
  return new Promise(async (resolve) =>{
    //TODO: we will not hard-code server URL here
    const response = await fetch(`http://localhost:3000/cart?user=${userId}`) 
    const data = await response.json()
    resolve({data})
  }
  );
}

export function resetCart(userId) {
  // get all items of user's cart - and then delete each
  return new Promise(async (resolve) => {
    const response = await fetchItemsByUserId(userId);
    const items = response.data;
    for (let item of items) {
      await deleteItemFromCart(item.id);
    }
    resolve({status:'success'})
  });
}




const initialState = {
    items: [],
    status:'idle',
    totalitem: 0,
    amount: 0,
    shipping:0,
    tax: 0,
    total: 0,
}


export const fetchItemsByUserIdAsync = createAsyncThunk(
    'cart/fetchItemsByUserId',
    async (userId) => {
      const response = await fetchItemsByUserId(userId);
      console.log(response.data)
      return response.data;
    }
  );

  export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async (item) => {
        
      const response = await addToCart(item);
      console.log(response.data)
      return response.data;
    }
  );

  export const updateCartAsync = createAsyncThunk(
    'cart/updateCart',
    async (update) => {
      const response = await updateCart(update);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
  );
  
  export const deleteItemFromCartAsync = createAsyncThunk(
    'cart/deleteItemFromCart',
    async (itemId) => {
      const response = await deleteItemFromCart(itemId);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
  );

  export const resetCartAsync = createAsyncThunk(
    'cart/resetCart',
    async (userId) => {
      const response = await resetCart(userId);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
  );




const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
  
         calculateitem: (state) => {
            let sum=0
            let q=0;
           state.items.forEach((i)=>(q=q+(i.quantity)))
          state.items.forEach((i)=>(sum=sum+(i.price*i.quantity)))
          state.totalitem=q;
          state.amount=sum;
          state.shipping=(state.amount>1000 || state.amount==0)?0:200;
          state.tax=+(state.amount*0.18).toFixed();
          state.total=state.amount + state.tax + state.shipping;
          console.log(state.totalitem)
          console.log(q)
         }, 
    },
    extraReducers: (builder) => {
        builder
        .addCase(addToCartAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(addToCartAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.items.push(action.payload);
        })
        .addCase(fetchItemsByUserIdAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchItemsByUserIdAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.items = action.payload;  
        })
        .addCase(updateCartAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(updateCartAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          const index =  state.items.findIndex(item=>item.id===action.payload.id)
          state.items[index] = action.payload;
        })
        .addCase(deleteItemFromCartAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(deleteItemFromCartAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          const index =  state.items.findIndex(item=>item.id===action.payload.id)
          state.items.splice(index,1);
        })
        .addCase(resetCartAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(resetCartAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.items = [];
        });
        }
})


export const selectItems = (state) => state.cart.items;
export const selectCartStatus = (state) => state.cart.status;

export default cartSlice.reducer;