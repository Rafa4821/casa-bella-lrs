export const Input = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  className = '',
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
      {helpText && !error && <div className="form-text">{helpText}</div>}
    </div>
  );
};

export const TextArea = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  error,
  helpText,
  className = '',
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
      {helpText && !error && <div className="form-text">{helpText}</div>}
    </div>
  );
};

export const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  error,
  helpText,
  placeholder = 'Seleccionar...',
  className = '',
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
      {helpText && !error && <div className="form-text">{helpText}</div>}
    </div>
  );
};
