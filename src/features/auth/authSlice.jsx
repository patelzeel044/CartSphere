import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateUser } from "../user/userSlice";

export function createUser(userData) {
    return new Promise(async (resolve) =>{
     //TODO: we will not hard-code server URL here
     const response = await fetch('http://localhost:3000/users',{
        method:'POST',
        body:JSON.stringify(userData),
        headers:{"content-type": "application/json"},
     }) 
     const data = await response.json()
     resolve({data})
   }
   );
 }


 


 export function checkUser(loginInfo) {
    return new Promise(async (resolve,reject) =>{
     //TODO: we will not hard-code server URL here
     const email = loginInfo.email
     const password=loginInfo.password
     const response = await fetch(`http://localhost:3000/users?email=${email}`)
      
     const data = await response.json()
     console.log({data})

     if(data.length){
        if(password === data[0].password){
            resolve({data:data[0]})
        }
        else{
            reject({message:"invalid credentials"})
        }
    }
        else{
            reject({message:"user not found"})
        }
        }
   );
 }

 export function signOut(userId) {
  return new Promise(async (resolve) => {
    // TODO: on server we will remove user session info
    resolve({ data: 'success' });
  });
}


const initialState = {
    loggedInUser: null,
    status: 'idle',
    error:null
}




export const createUserAsync = createAsyncThunk(
    'user/createUser',
    async (userData) => {
      const response = await createUser(userData);
     
      console.log(response)
      return response.data;
    }
  );
  
  export const updateUserAsync = createAsyncThunk(
    'user/updateUser',
    async (update) => {
      const response = await updateUser(update);
     
      console.log(response)
      return response.data;
    }
  );


  export const checkUserAsync = createAsyncThunk(
    'user/checkUser',
    async (loginInfo) => {
      const response = await checkUser(loginInfo);
     
      console.log(response)
      return response.data;
    }
  );
  

  export const signOutAsync = createAsyncThunk(
    'user/signOut',
    async (loginInfo) => {
      const response = await signOut(loginInfo);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
  );
  
  


const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
    },
    extraReducers:(builder)=>{
        builder
        .addCase(createUserAsync.pending, (state)=>{
            state.status='loading';
        })
        .addCase(createUserAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.loggedInUser  = action.payload;
           
          })
          .addCase(checkUserAsync.pending, (state)=>{
            state.status='loading';
        })
        .addCase(checkUserAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.loggedInUser  = action.payload;
           
          })
          .addCase(checkUserAsync.rejected, (state, action) => {
            state.status = 'idle';
            state.error  = action.error;
           
          })
          .addCase(updateUserAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(updateUserAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.loggedInUser = action.payload;
          })
          .addCase(signOutAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(signOutAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.loggedInUser = null;
          })
    }
})


export const selectLoggedInUser = (state)=>state.auth.loggedInUser;
export const selectError = (state)=>state.auth.error;

/* export const {  } = productSlice.actions */
export default authSlice.reducer;