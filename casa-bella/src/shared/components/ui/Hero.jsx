export const Hero = ({
  title,
  subtitle,
  backgroundImage,
  height = '500px',
  overlay = true,
  centered = true,
  children,
  className = '',
}) => {
  const style = {
    minHeight: height,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'var(--bg-gradient-primary)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section
      className={`hero ${overlay ? 'overlay' : ''} ${className}`}
      style={style}
    >
      <div className={`container h-100 d-flex align-items-center ${centered ? 'justify-content-center text-center' : ''}`}>
        <div className="hero-content">
          {title && (
            <h1 className="display-1 text-white mb-4">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="lead text-white mb-4">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export const HeroMinimal = ({ title, subtitle, breadcrumb, className = '' }) => {
  return (
    <section className={`bg-gradient-primary text-white py-5 ${className}`}>
      <div className="container">
        {breadcrumb && (
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb mb-0">
              {breadcrumb.map((item, index) => (
                <li
                  key={index}
                  className={`breadcrumb-item ${index === breadcrumb.length - 1 ? 'active text-white' : ''}`}
                  aria-current={index === breadcrumb.length - 1 ? 'page' : undefined}
                >
                  {item.link && index !== breadcrumb.length - 1 ? (
                    <a href={item.link} className="text-white">
                      {item.label}
                    </a>
                  ) : (
                    item.label
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {title && <h1 className="mb-2">{title}</h1>}
        {subtitle && <p className="lead mb-0 opacity-90">{subtitle}</p>}
      </div>
    </section>
  );
};
