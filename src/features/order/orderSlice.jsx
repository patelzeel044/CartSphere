import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


export function createOrder(order) {
  return new Promise(async (resolve) =>{
   //TODO: we will not hard-code server URL here
   const response = await fetch('http://localhost:3000/orders',{
      method:'POST',
      body:JSON.stringify(order),
      headers:{"content-type": "application/json"},
   }) 
   const data = await response.json()
   resolve({data})
 }
 );
}

export function updateOrder(order) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:3000/orders/'+order.id, {
      method: 'PATCH',
      body: JSON.stringify(order),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchAllOrders(sort, pagination) {
 let queryString = '';

 for (let key in sort) {
  queryString += `${key}=${sort[key]}&`;
}
  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  return new Promise(async (resolve) => {
    
    const response = await fetch(
      'http://localhost:3000/orders?' + queryString
    );
    const data = await response.json();
    
    const totalOrders=data.items
    
   
   
    resolve({ data: { orders: data.data, totalOrders: +totalOrders } });
  });
}

const initialState = {
    orders: [],
    status: 'idle',
    currentOrder: null,
    totalOrders: 0
};

export const createOrderAsync = createAsyncThunk(
  'order/createOrder',
  async (order) => {
    const response = await createOrder(order);
    
    console.log(response)
    return response.data;
  }
);

export const updateOrderAsync = createAsyncThunk(
  'order/updateOrder',
  async (order) => {
    const response = await updateOrder(order);
    
    return response.data;
  }
);

export const fetchAllOrdersAsync = createAsyncThunk(
  'order/fetchAllOrders',
  async ({sort, pagination}) => {
    const response = await fetchAllOrders(sort,pagination);
   
    return response.data;
  }
);



export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: { 
    resetOrder:(state,)=>{
      state.currentOrder=null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders.push(action.payload);
        state.currentOrder= action.payload
      })
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index =  state.orders.findIndex(order=>order.id===action.payload.id)
        state.orders[index] = action.payload;
      })
  },
});

export const { resetOrder } = orderSlice.actions;

export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrders = (state) => state.order.orders;
export const selectTotalOrders = (state) => state.order.totalOrders;


export default orderSlice.reducer;