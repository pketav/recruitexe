'use client'
import React from 'react'
import Lottie from 'lottie-react'
import animationData from './setup.json'

const ConfigSetup = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(to right,rgb(58, 46, 222),rgb(65, 217, 222))',
      color: '#ffffff',
      fontFamily: `'Poppins', 'Inter', sans-serif`,
      textAlign: 'center',
      padding: '2rem',
      letterSpacing: '0.5px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '40vw',   
        height: '40vw',  
        maxWidth: 400,    
        maxHeight: 400,   
        marginTop: '-10vh', 
      }}>
        <Lottie animationData={animationData} loop={true} />
      </div>

      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: 600,
        marginTop: '1rem',
        fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
      }}>
        Just a Moment...
      </h1>

      <p style={{
        fontSize: '1.1rem',
        maxWidth: '600px',
        lineHeight: '1.6',
        fontWeight: 300,
        fontSize: 'clamp(1rem, 3vw, 1.1rem)',
      }}>
        We’re setting up your account and preparing your workspace. <br />
        You’ll be redirected to the Candidate Portal in a few seconds.
      </p>
    </div>
  )
}

export default ConfigSetup
