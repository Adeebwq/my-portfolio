import React from 'react'

const Button = ({ text, className, id, onClick }) => {
    const handleScroll = (e) => {
    if (targetId) {
      e.preventDefault()
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    if (onClick) onClick(e)
  }
  return (
    <button 
      className={`underline-button ${className || ''}`}
      id={id}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button