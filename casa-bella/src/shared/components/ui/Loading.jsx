export const Loading = ({ message = 'Cargando...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', zIndex: 9999 }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="text-muted">{message}</p>
    </div>
  );
};

export const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Procesando...
        </>
      ) : (
        children
      )}
    </button>
  );
};
