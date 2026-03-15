import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from '../shared/contexts/AuthContext';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import './styles/theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
