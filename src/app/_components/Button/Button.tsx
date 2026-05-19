import React from 'react';
import styles from './Button.module.scss';


interface ButtonProps {
  children: React.ReactNode;
  variant?: 'orange' | 'white'; 
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string; 
  disabled?: boolean; 
}

export default function Button({ 
  children, 
  variant = 'orange', 
  type = 'button',
  onClick,
  className = '',
  disabled=false
}: ButtonProps) {
  // Combine styles safely
  const variantClass = styles[variant] || styles.orange;
  const combinedClasses = `${styles.btn} ${variantClass} ${className}`.trim();

  return (
    <button 
      type={type} 
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}