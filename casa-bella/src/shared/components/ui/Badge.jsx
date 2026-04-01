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
    pending: { bg: '#ffc107', color: '#000', label: 'Pendiente' },
    confirmed: { bg: '#28a745', color: '#fff', label: 'Confirmada' },
    cancelled: { bg: '#dc3545', color: '#fff', label: 'Cancelada' },
    completed: { bg: '#17a2b8', color: '#fff', label: 'Completada' },
    active: { bg: '#28a745', color: '#fff', label: 'Activo' },
    inactive: { bg: '#6c757d', color: '#fff', label: 'Inactivo' },
    paid: { bg: '#28a745', color: '#fff', label: 'Pagado' },
    unpaid: { bg: '#dc3545', color: '#fff', label: 'No Pagado' },
  };

  const config = statusConfig[status] || { bg: '#6c757d', color: '#fff', label: status };

  return (
    <span
      className="badge rounded-pill"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: '0.35em 0.65em',
        fontSize: '0.75rem',
        fontWeight: '500',
      }}
    >
      {config.label}
    </span>
  );
};
