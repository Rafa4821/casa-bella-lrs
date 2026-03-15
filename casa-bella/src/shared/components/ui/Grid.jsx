export const Grid = ({ children, cols = 3, gap = 4, className = '' }) => {
  const colsClass = {
    1: 'row-cols-1',
    2: 'row-cols-1 row-cols-md-2',
    3: 'row-cols-1 row-cols-md-2 row-cols-lg-3',
    4: 'row-cols-1 row-cols-md-2 row-cols-lg-4',
  };

  return (
    <div className={`row ${colsClass[cols]} g-${gap} ${className}`}>
      {children}
    </div>
  );
};

export const GridItem = ({ children, className = '' }) => {
  return <div className={`col ${className}`}>{children}</div>;
};

export const ImageGrid = ({ images = [], cols = 3, gap = 4, className = '' }) => {
  return (
    <Grid cols={cols} gap={gap} className={className}>
      {images.map((image, index) => (
        <GridItem key={index}>
          <div className="position-relative overflow-hidden rounded shadow-hover" style={{ paddingTop: '75%' }}>
            <img
              src={image.src}
              alt={image.alt || `Imagen ${index + 1}`}
              className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </GridItem>
      ))}
    </Grid>
  );
};

export const FeatureGrid = ({ features = [], cols = 3, className = '' }) => {
  return (
    <Grid cols={cols} gap={4} className={className}>
      {features.map((feature, index) => (
        <GridItem key={index}>
          <div className="text-center p-4">
            {feature.icon && (
              <div className="mb-3">
                <span className="text-primary" style={{ fontSize: '3rem' }}>
                  {feature.icon}
                </span>
              </div>
            )}
            {feature.title && <h4 className="mb-3">{feature.title}</h4>}
            {feature.description && (
              <p className="text-secondary mb-0">{feature.description}</p>
            )}
          </div>
        </GridItem>
      ))}
    </Grid>
  );
};
