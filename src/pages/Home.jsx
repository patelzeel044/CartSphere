import React from 'react'
import Products from '../features/product/Products'
import Header from '../features/header/Header'
import Footer from '../features/common/Footer'

function home() {
  return (
    <div>
        <Header>
      <Products/>
      </Header>
      <Footer/>
    </div>
  )
}

export default home
