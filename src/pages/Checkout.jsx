import React, { useState } from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { Link ,Navigate} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { Fragment} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { selectItems ,deleteItemFromCartAsync,updateCartAsync} from '../features/cart/cartSlice';
import {
  
  updateUserAsync,
} from '../features/auth/authSlice';
import { selectUserInfo } from '../features/user/userSlice';
import { createOrderAsync ,selectCurrentOrder} from '../features/order/orderSlice';
import { discountedPrice } from '../features/common/constants';


function Checkout() {

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const user = useSelector(selectUserInfo);
  const items = useSelector(selectItems)
 const currentOrder=useSelector(selectCurrentOrder);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ ...item, quantity: + e.target.value }));
  };

  const handleRemove =(e, id)=>{
    dispatch(deleteItemFromCartAsync(id))
  }

const totalAmount= items.reduce((amount,item)=> item.quantity * discountedPrice(item)  + amount,0);

const totalItems=items.reduce((total,item)=> item.quantity  + total,0);

const handlePayment = (e) => {
  console.log(e.target.value);
  setPaymentMethod(e.target.value);
};

 const handleAddress = (e) => {
  console.log(e.target.value);
  setSelectedAddress(user.addresses[e.target.value]);
};

const handleOrder = (e) => {
  if (selectedAddress && paymentMethod) {
    const order = {
      items,
      totalAmount,
      totalItems,
      user,
      paymentMethod,
      selectedAddress,
    };
    dispatch(createOrderAsync(order));
    // need to redirect from here to a new page of order success.
  } 
  else{
    alert('Enter Address and Payment method')
  }
};


  return (
    <>
    {!items.length && <Navigate to="/" replace={true}></Navigate>}
    {currentOrder && <Navigate to={`/order-success/${currentOrder.id}`} replace={true}></Navigate>}
    <div className="mx-auto m-5 p-5 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
        <div className=' lg:col-span-3'>
          <form
           noValidate
           onSubmit={handleSubmit((data) => {
             dispatch(
               updateUserAsync({...user, addresses:[...user.addresses, data] })
             );
             reset()
           })}
          className='bg-white px-5 mt-12'>
            <div className="space-y-12">

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className=" font-semibold m-4 p-3 pt-12 text-2xl leading-7 text-gray-900">
                  Personal Information
                  </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600"></p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                      Full Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="name"
                        {...register('name', {
                          required: 'name is required',
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                       {errors.name && (
                          <p className="text-red-500">{errors.name.message}</p>
                        )}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        {...register('email', {
                          required: 'email is required',
                        })}
                        type="email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                       {errors.email && (
                          <p className="text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                      Phone
                    </label>
                    <div className="mt-2">
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone', {
                          required: 'phone is required',
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                       {errors.phone && (
                          <p className="text-red-500">{errors.phone.message}</p>
                        )}
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                      Street address
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register('street', {
                          required: 'street is required',
                        })}
                        id="street-address"
                        autoComplete="street-address"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                       {errors.street && (
                          <p className="text-red-500">{errors.street.message}</p>
                        )}
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register('city', {
                          required: 'city is required',
                        })}
                        id="city"
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                       {errors.city && (
                          <p className="text-red-500">{errors.city.message}</p>
                        )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                      State / Province
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register('state', {
                          required: 'state is required',
                        })}
                        id="state"
                        autoComplete="address-level1"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                       {errors.state && (
                          <p className="text-red-500">{errors.state.message}</p>
                        )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="pinCode" className="block text-sm font-medium leading-6 text-gray-900">
                      ZIP / Postal code
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register('pinCode', {
                          required: 'pinCode is required',
                        })}
                        id="pinCode"
                        autoComplete="postal-code"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                       {errors.pinCode && (
                          <p className="text-red-500">{errors.pinCode.message}</p>
                        )}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button 
                  onClick={e=>reset()}
                  type="button" className="text-sm font-semibold leading-6 text-gray-900">
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add Address
                  </button>
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Address</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Choose From existing Adress
                </p>

                <div>
                  <ul role="list" className="divide-y divide-gray-100">
                    {user.addresses.map((address,index) => (
                      <li key={index} className="flex justify-between border-2 border-solid p-5 m-2 border-gray-200 gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                          <input
                                onChange={handleAddress}
                            name="address"
                            type="radio"
                            value={index}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />

                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">{address.name}</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{address.street}</p>
                          </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900">{address.city}</p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">{address.pincode} </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                </div>
                <div className="mt-10 space-y-10">

                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">Payment Methods</legend>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Choose One</p>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id="card"
                          value="card"
                          name="payments"
                          type="radio"
                          onChange={handlePayment}
                          checked={paymentMethod === "card"}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="card" className="block text-sm font-medium leading-6 text-gray-900">
                          Card
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="cash"
                          value="cash"
                          name="payments"
                          type="radio"
                          onClick={handlePayment}
                          checked={paymentMethod === "cash"}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="cash" className="block text-sm font-medium leading-6 text-gray-900">
                          Cash
                        </label>
                      </div>

                    </div>
                  </fieldset>
                </div>
              </div>
            </div>


          </form>
        </div>


        <div className='lg:col-span-2'>
        <div className="mx-auto m-5 mt-12 p-5 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-8 m-3 p-3 bg-slate-50">
          <h2 className='text-3xl font-semibold m-2 p-2'>Cart</h2>
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href={item.href}>{item.title}</a>
                        </h3>
                        <p className="ml-4">${discountedPrice(item)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex text-gray-500">Qty
                        <select onChange={(e) => handleQuantity(e, item)}
                        className="mx-2 px-2 h-9 w-14" id="">
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>

                      <div className="flex">
                        <button
                        onClick={(e)=>handleRemove(e, item.id)}
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>


        <div className="border-t m-3 p-3 bg-slate-50 border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>$ {totalAmount}</p>
          </div>
          <div className="flex justify-between my-2 text-base font-medium text-gray-900">
              <p>Total Items in Cart</p>
              <p>{totalItems} items</p>
            </div>
          <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
          <div className="mt-6">
            <div
            onClick={handleOrder}
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Order Now
            </div>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              or{' '}
              <Link to="/">
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>

        </div>
      </div>
    </div>
    </>
  )
}

export default Checkout
