export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline-primary',
    danger: 'btn-danger',
    success: 'btn-success',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-100' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
