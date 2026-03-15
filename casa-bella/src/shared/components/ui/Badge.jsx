export const Badge = ({ 
  children, 
  variant = 'primary', 
  pill = false,
  className = '',
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    light: 'badge-light',
    dark: 'badge-dark',
  };

  return (
    <span
      className={`badge ${variantClasses[variant]} ${pill ? 'rounded-pill' : ''} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { variant: 'warning', label: 'Pendiente' },
    confirmed: { variant: 'success', label: 'Confirmada' },
    cancelled: { variant: 'danger', label: 'Cancelada' },
    completed: { variant: 'info', label: 'Completada' },
    active: { variant: 'success', label: 'Activo' },
    inactive: { variant: 'secondary', label: 'Inactivo' },
  };

  const config = statusConfig[status] || { variant: 'secondary', label: status };

  return (
    <Badge variant={config.variant} pill>
      {config.label}
    </Badge>
  );
};
