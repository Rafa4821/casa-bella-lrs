import { Component } from 'react';
import { logger } from '../utils/logger';
import { Button } from './ui';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('ErrorBoundary caught an error', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-5 text-center">
                    <div className="mb-4">
                      <span style={{ fontSize: '4rem' }}>⚠️</span>
                    </div>
                    <h2 className="mb-3">Algo salió mal</h2>
                    <p className="text-muted mb-4">
                      Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
                    </p>
                    
                    {import.meta.env.MODE === 'development' && this.state.error && (
                      <div className="alert alert-danger text-start mb-4">
                        <strong>Error:</strong>
                        <pre className="small mt-2 mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                          {this.state.error.toString()}
                        </pre>
                      </div>
                    )}

                    <div className="d-flex gap-2 justify-content-center">
                      <Button onClick={this.handleReset}>
                        Intentar de Nuevo
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.href = '/'}
                      >
                        Ir al Inicio
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
