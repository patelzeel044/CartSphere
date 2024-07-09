import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


export function fetchAllProducts() {
     return new Promise(async (resolve) =>{
      //TODO: we will not hard-code server URL here
      const response = await fetch('http://localhost:3000/products') 
      const data = await response.json()
      resolve({data})
    }
    );
  }
  
  export function fetchProductById(id) {
    return new Promise(async (resolve) =>{
      //TODO: we will not hard-code server URL here
      const response = await fetch(`http://localhost:3000/products?id=${id}`) 
      const data = await response.json()
      console.log(data)
      resolve({data})
    }
    );
  }


  export function fetchProductsByFilters(filter,sort,pagination) {
    // filter = {"category":["smartphone","laptops"]}
    // sort = {_sort:"price",_order="desc"}
    // pagination = {_page:1,_limit=10} 
    // TODO : on server we will support multi values in filter
    let queryString = '';
    for(let key in filter){
      const categoryValues = filter[key];
      if(categoryValues.length){
        const lastCategoryValue = categoryValues[categoryValues.length-1]
        queryString += `${key}=${lastCategoryValue}&`
      }
    }
    for(let key in sort){
      queryString += `${key}=${sort[key]}&`
    }
    console.log(pagination)
    for(let key in pagination){
      queryString += `${key}=${pagination[key]}&`
    }
  console.log(queryString)
    return new Promise(async (resolve) =>{
      //TODO: we will not hard-code server URL here
      const response = await fetch('http://localhost:3000/products?'+queryString) 
      const data = await response.json()
      const totalItems = data.items
      console.log(data.length)
    /*   const totalItems = await response.headers.get('X-Total-Count') */
      resolve({data:{products:data.data,totalItems:+totalItems}})
     
  
    }
    );
  }

  export function fetchCategories() {
    return new Promise(async (resolve) =>{
      const response = await fetch('http://localhost:3000/categories') 
      const data = await response.json()
      resolve({data})
    }
    );
  }
  
  export function fetchBrands() {
    return new Promise(async (resolve) =>{
      const response = await fetch('http://localhost:3000/brands') 
      const data = await response.json()
      resolve({data})
    }
    );
  }

  export function createProduct(product) {
    return new Promise(async (resolve) => {
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        body: JSON.stringify(product),
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json();
      resolve({ data });
    });
  }
  
  export function updateProduct(update) {
    return new Promise(async (resolve) => {
      const response = await fetch(
        'http://localhost:3000/products/' + update.id,
        {
          method: 'PATCH',
          body: JSON.stringify(update),
          headers: { 'content-type': 'application/json' },
        }
      );
      const data = await response.json();
      // TODO: on server it will only return some info of user (not password)
      resolve({ data });
    });
  }


const initialState = {
    products: [],
    brands:[],
    categories:[],
    status: 'idle',
    totalItems:0,
    selectedProduct:null
};


export const fetchAllProductsAsync = createAsyncThunk(
  'product/fetchAllProducts',
  async () => {
    const response = await fetchAllProducts();
    // The value we return becomes the `fulfilled` action payload
    console.log(response)
    return response.data;
  }
);

export const fetchProductByIdAsync = createAsyncThunk(
    'product/fetchProductById',
    async (id) => {
      const response = await fetchProductById(id);
      console.log(response.data[0])
      return response.data[0];
    }
  );



export const fetchProductsByFiltersAsync = createAsyncThunk(
  'product/fetchProductsByFilters',
  async ({filter,sort,pagination}) => {
    const response = await fetchProductsByFilters(filter,sort,pagination);
    
    console.log(response)
    return response.data;
  }
);

export const fetchBrandsAsync = createAsyncThunk(
    'product/fetchBrands',
    async () => {
      const response = await fetchBrands();
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
  );
  export const fetchCategoriesAsync = createAsyncThunk(
    'product/fetchCategories',
    async () => {
      const response = await fetchCategories();
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
  );

  export const createProductAsync = createAsyncThunk(
    'product/create',
    async (product) => {
      const response = await createProduct(product);
      return response.data;
    }
  );
  
  export const updateProductAsync = createAsyncThunk(
    'product/update',
    async (update) => {
      const response = await updateProduct(update);
      return response.data;
    }
  );

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct:(state)=>{
      state.selectedProduct = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload;
      })
      .addCase(fetchProductsByFiltersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByFiltersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchBrandsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.brands = action.payload;
      })
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.categories = action.payload;
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedProduct = action.payload;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products.push(action.payload);
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        state.products[index] = action.payload;
        state.selectedProduct = action.payload;

      })
  },
});

export const { clearSelectedProduct } = productSlice.actions;

export const selectAllProducts = (state) => state.product.products;
export const selectBrands = (state) => state.product.brands;
export const selectCategories = (state) => state.product.categories;
export const selectProductById = (state) => state.product.selectedProduct;
export const selectProductListStatus = (state) => state.product.status;
export const selectTotalItems = (state) => state.product.totalItems;

export default productSlice.reducer;