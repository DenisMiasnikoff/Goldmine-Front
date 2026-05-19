import React from 'react';
import styles from './Button.module.scss';


interface ButtonProps {
  children: React.ReactNode;
  variant?: 'orange' | 'white'; 
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string; 
}

export default function Button({ 
  children, 
  variant = 'orange', 
  type = 'button',
  onClick,
  className = ''
}: ButtonProps) {
  // Combine styles safely
  const variantClass = styles[variant] || styles.gold;
  const combinedClasses = `${styles.btn} ${variantClass} ${className}`.trim();

  return (
    <button 
      type={type} 
      className={combinedClasses}
      onClick={onClick}
    >
      {children}
    </button>
  );
}