import { Outlet } from 'react-router-dom';
import { PublicHeader } from '../components/PublicHeader';
import { PublicFooter } from '../components/PublicFooter';

export const PublicLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicHeader />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
