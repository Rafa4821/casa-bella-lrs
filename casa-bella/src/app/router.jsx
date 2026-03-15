import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../shared/layouts/PublicLayout';
import { AdminLayout } from '../shared/layouts/AdminLayout';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { HomePage } from '../pages/public/HomePage';
import { LaPosadaPage } from '../pages/public/LaPosadaPage';
import { HabitacionesPage } from '../pages/public/HabitacionesPage';
import { ServiciosPage } from '../pages/public/ServiciosPage';
import { GaleriaPage } from '../pages/public/GaleriaPage';
import { ContactoPage } from '../pages/public/ContactoPage';
import { ReservarPage } from '../pages/public/ReservarPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { ReservationsPage } from '../pages/admin/ReservationsPage';
import { ReservationDetailPage } from '../pages/admin/ReservationDetailPage';
import { RatesPage } from '../pages/admin/RatesPage';
import { BlockedDatesPage } from '../pages/admin/BlockedDatesPage';
import { SettingsPage } from '../pages/admin/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'la-posada',
        element: <LaPosadaPage />,
      },
      {
        path: 'habitaciones',
        element: <HabitacionesPage />,
      },
      {
        path: 'servicios',
        element: <ServiciosPage />,
      },
      {
        path: 'galeria',
        element: <GaleriaPage />,
      },
      {
        path: 'contacto',
        element: <ContactoPage />,
      },
      {
        path: 'reservar',
        element: <ReservarPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'reservas',
        element: <ReservationsPage />,
      },
      {
        path: 'reservas/:id',
        element: <ReservationDetailPage />,
      },
      {
        path: 'tarifas',
        element: <RatesPage />,
      },
      {
        path: 'fechas-bloqueadas',
        element: <BlockedDatesPage />,
      },
      {
        path: 'configuracion',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
