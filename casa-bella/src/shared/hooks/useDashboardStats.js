import { useState, useEffect } from 'react';
import { getAllReservations } from '../services/reservationsService';

export const useDashboardStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    upcomingCheckIns: [],
  });
  const [recentReservations, setRecentReservations] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const reservations = await getAllReservations();

      // Calcular estadísticas
      const totalRequests = reservations.length;
      const pending = reservations.filter(r => r.status === 'pending').length;
      const confirmed = reservations.filter(r => r.status === 'confirmed').length;
      const cancelled = reservations.filter(r => r.status === 'cancelled').length;

      // Próximas entradas (próximos 7 días)
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const upcomingCheckIns = reservations
        .filter(r => {
          const checkIn = r.checkInDate.toDate();
          return checkIn >= today && checkIn <= nextWeek && r.status === 'confirmed';
        })
        .sort((a, b) => a.checkInDate.toDate() - b.checkInDate.toDate())
        .slice(0, 5);

      // Reservas recientes (últimas 5)
      const recent = [...reservations]
        .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
        .slice(0, 5);

      setStats({
        totalRequests,
        pending,
        confirmed,
        cancelled,
        upcomingCheckIns,
      });

      setRecentReservations(recent);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  return {
    loading,
    stats,
    recentReservations,
    refresh: loadDashboardData,
  };
};
