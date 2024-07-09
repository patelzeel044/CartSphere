import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import toast from 'react-hot-toast'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { Link } from 'react-router-dom';
import { selectItems ,selectCartStatus,deleteItemFromCartAsync,updateCartAsync} from './cartSlice';
import { discountedPrice } from '../common/constants';
import { Grid } from 'react-loader-spinner';
import Modal from '../common/Modal'; 


function Cart() {

  const [open, setOpen] = useState(true)

  const dispatch = useDispatch();
  const items = useSelector(selectItems)

  const status = useSelector(selectCartStatus);
  const [openModal, setOpenModal] = useState(null);

  
  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ ...item, quantity: + e.target.value }));
  };

  const handleRemove =(e, id)=>{
    dispatch(deleteItemFromCartAsync(id))
  }


const totalAmount= items.reduce((amount,item)=> item.quantity * discountedPrice(item) + amount,0);

const totalItems=items.reduce((total,item)=> item.quantity  + total,0);

  return (
    <>

      <div className="mx-auto m-5 mt-12 p-5 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-8 m-3 p-3 bg-slate-50">
          <h2 className='text-3xl font-semibold m-2 p-2'>Cart</h2>
          <div className="flow-root">
          {status === 'loading' ? (
                <Grid
                  height="80"
                  width="80"
                  color="rgb(79, 70, 229) "
                  ariaLabel="grid-loading"
                  radius="12.5"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              ) : null}
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
                      <Modal
                            title={`Delete ${item.title}`}
                            message="Are you sure you want to delete this Cart item ?"
                            dangerOption="Delete"
                            cancelOption="Cancel"
                            dangerAction={(e) => handleRemove(e, item.id)}
                            cancelAction={()=>setOpenModal(null)}
                            showModal={openModal === item.id}
                          ></Modal>
                        <button
                  onClick={e=>{setOpenModal(item.id)}}
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
            <Link
              to="/checkout"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Checkout
            </Link>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              or{' '}
              <Link to="/">
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => setOpen(false)}
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart;
