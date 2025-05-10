import React from 'react'
import './Styles/Banner.css'

function Banner() {
  return (
    <div className='custom-banner'>
      <div className='banner-content'>
        <div className='banner-text-container'>
          <h1 className='banner-title'>Welcome to <span className='highlight'>Galaxy Auction</span></h1>
          <p className='banner-subtitle'>Discover Extraordinary Vehicles at Exceptional Prices</p>
          
         
          <div className='banner-features'>
            <div className='feature'>
              <i className='bi bi-shield-check'></i>
              <span>Verified Sellers</span>
            </div>
            <div className='feature'>
              <i className='bi bi-cash-coin'></i>
              <span>Competitive Prices</span>
            </div>
            <div className='feature'>
              <i className='bi bi-trophy'></i>
              <span>Premium Selection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner