export const FeatureGrid = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="row g-4">
      {features.map((feature, index) => (
        <div key={index} className="col-md-4">
          <div className="text-center">
            {feature.icon && (
              <div className="feature-icon mb-3" style={{ fontSize: '3rem' }}>
                {feature.icon}
              </div>
            )}
            <h5 className="mb-3">{feature.title}</h5>
            <p className="text-secondary">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
