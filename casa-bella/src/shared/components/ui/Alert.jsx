export const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  className = '' 
}) => {
  const types = {
    success: {
      bg: 'rgba(16, 185, 129, 0.1)',
      border: '#10b981',
      icon: '✓',
      iconBg: '#10b981',
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.1)',
      border: '#ef4444',
      icon: '✕',
      iconBg: '#ef4444',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.1)',
      border: '#f59e0b',
      icon: '⚠',
      iconBg: '#f59e0b',
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.1)',
      border: '#3b82f6',
      icon: 'ℹ',
      iconBg: '#3b82f6',
    },
  };

  const config = types[type] || types.info;

  return (
    <div
      className={`alert d-flex align-items-start p-3 rounded mb-3 ${className}`}
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0 me-3"
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: config.iconBg,
          fontSize: '1.125rem',
        }}
      >
        {config.icon}
      </div>
      <div className="flex-grow-1">
        {title && <div className="fw-semibold mb-1">{title}</div>}
        {message && <div className="small">{message}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="btn-close btn-close-sm"
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

export const SuccessAlert = ({ title, message, onClose, className }) => (
  <Alert type="success" title={title} message={message} onClose={onClose} className={className} />
);

export const ErrorAlert = ({ title, message, onClose, className }) => (
  <Alert type="error" title={title} message={message} onClose={onClose} className={className} />
);

export const WarningAlert = ({ title, message, onClose, className }) => (
  <Alert type="warning" title={title} message={message} onClose={onClose} className={className} />
);

export const InfoAlert = ({ title, message, onClose, className }) => (
  <Alert type="info" title={title} message={message} onClose={onClose} className={className} />
);
