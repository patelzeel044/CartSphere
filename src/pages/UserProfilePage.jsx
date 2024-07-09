import React from 'react'
import Header from '../features/header/Header'
import UserProfile from '../features/user/userProfile'

function UserProfilePage() {
  return (
    <div>
      <Header>
      <h1 className='mx-auto text-2xl'>My Profile</h1>
        <UserProfile/>
      </Header>
    </div>
  )
}

export default UserProfilePage
