import React, { useEffect, useState } from 'react'
import './styles/Home.css'
import Header from '../components/Header';

const Home = () => {
  return (
    <>
      <Header />
      <div className='home-container'>
          <div className='div-container1'>
              <h2>Welcome to SPAC Library Printing Services System</h2>
          </div>
      </div>
    </>
  )
}

export default Home