import React from 'react'
import AdminProducts from '../features/Admin/AdminProducts'
import Header from '../features/header/Header'
import Footer from '../features/common/Footer'

function Adminhome() {
  return (
    <div>
        <Header>
      <AdminProducts/>
      </Header>
      <Footer/>
    </div>
  )
}

export default Adminhome
