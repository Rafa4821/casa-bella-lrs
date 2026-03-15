import { Outlet } from 'react-router-dom';
import { AdminHeader } from '../components/AdminHeader';
import { AdminSidebar } from '../components/AdminSidebar';

export const AdminLayout = () => {
  return (
    <div className="d-flex min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <AdminHeader />
        <main className="flex-grow-1 p-4 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
