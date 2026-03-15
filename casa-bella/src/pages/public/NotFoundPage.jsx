import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="container py-5">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <p className="lead mb-4">Página no encontrada</p>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};
