import React from 'react'
import Header from '../features/header/Header'
import UserOrder from '../features/user/userOrder'

function UserOrdersPage() {
  return (
    <div>
      <Header>
      <h1 className='mx-auto text-2xl'>My Orders</h1>
        <UserOrder/>
      </Header>
    </div>
  )
}

export default UserOrdersPage

