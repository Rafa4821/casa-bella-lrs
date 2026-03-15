export const Card = ({ children, hover = true, className = '', ...props }) => {
  return (
    <div className={`card ${hover ? 'shadow-hover' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardImage = ({ src, alt, className = '', ...props }) => {
  return (
    <img src={src} alt={alt} className={`card-img-top ${className}`} {...props} />
  );
};
