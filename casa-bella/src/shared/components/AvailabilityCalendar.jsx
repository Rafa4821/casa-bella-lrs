import { useState, useEffect } from 'react';
import { Card, CardBody, Button, Loading } from './ui';
import { getAvailabilityMap } from '../services/availabilityService';

export const AvailabilityCalendar = ({ selectedCheckIn, selectedCheckOut, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilityMap, setAvailabilityMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailability();
  }, [currentMonth]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      
      // Get first and last day of current month
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const availability = await getAvailabilityMap(firstDay, lastDay);
      setAvailabilityMap(availability);
      setLoading(false);
    } catch (error) {
      console.error('Error loading availability:', error);
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startPadding = firstDay.getDay(); // 0 = Sunday
    
    // Add padding for days before month starts
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    if (!date || isPastDate(date)) return;
    
    const dateStr = date.toISOString().split('T')[0];
    const availability = availabilityMap.get(dateStr);
    
    // Don't allow selecting unavailable dates
    if (availability && !availability.available) return;
    
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelected = (date) => {
    if (!date) return false;
    
    const dateStr = date.toISOString().split('T')[0];
    const checkInStr = selectedCheckIn ? new Date(selectedCheckIn).toISOString().split('T')[0] : null;
    const checkOutStr = selectedCheckOut ? new Date(selectedCheckOut).toISOString().split('T')[0] : null;
    
    return dateStr === checkInStr || dateStr === checkOutStr;
  };

  const isInRange = (date) => {
    if (!date || !selectedCheckIn || !selectedCheckOut) return false;
    
    const checkIn = new Date(selectedCheckIn);
    const checkOut = new Date(selectedCheckOut);
    
    return date > checkIn && date < checkOut;
  };

  const getDateClassName = (date) => {
    if (!date) return '';
    
    const classes = ['calendar-day'];
    const dateStr = date.toISOString().split('T')[0];
    const availability = availabilityMap.get(dateStr);
    
    if (isPastDate(date)) {
      classes.push('past');
    } else if (availability && !availability.available) {
      classes.push(availability.reason === 'blocked' ? 'blocked' : 'reserved');
    } else {
      classes.push('available');
    }
    
    if (isSelected(date)) {
      classes.push('selected');
    }
    
    if (isInRange(date)) {
      classes.push('in-range');
    }
    
    return classes.join(' ');
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const days = getDaysInMonth();

  return (
    <Card hover={false}>
      <CardBody>
        <div className="availability-calendar">
          {/* Header */}
          <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
            >
              ◀
            </Button>
            <h5 className="mb-0">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h5>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
            >
              ▶
            </Button>
          </div>

          {loading ? (
            <Loading message="Cargando disponibilidad..." />
          ) : (
            <>
              {/* Day names */}
              <div className="calendar-grid">
                {dayNames.map(day => (
                  <div key={day} className="calendar-day-name">
                    {day}
                  </div>
                ))}
                
                {/* Days */}
                {days.map((date, index) => (
                  <div
                    key={index}
                    className={getDateClassName(date)}
                    onClick={() => handleDateClick(date)}
                    style={{
                      cursor: date && !isPastDate(date) && availabilityMap.get(date.toISOString().split('T')[0])?.available !== false ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {date ? date.getDate() : ''}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="calendar-legend mt-3">
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <div className="legend-item">
                    <span className="legend-color available"></span>
                    <small>Disponible</small>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color reserved"></span>
                    <small>Reservado</small>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color blocked"></span>
                    <small>Bloqueado</small>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color selected"></span>
                    <small>Seleccionado</small>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <style jsx>{`
          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
          }

          .calendar-day-name {
            text-align: center;
            font-weight: 600;
            padding: 8px;
            font-size: 0.85rem;
            color: var(--bs-secondary);
          }

          .calendar-day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            font-size: 0.9rem;
            transition: all 0.2s;
            border: 1px solid #e0e0e0;
          }

          .calendar-day.available {
            background-color: #e8f5e9;
            border-color: #4caf50;
          }

          .calendar-day.available:hover {
            background-color: #c8e6c9;
            transform: scale(1.05);
          }

          .calendar-day.reserved {
            background-color: #ffebee;
            border-color: #f44336;
            color: #999;
          }

          .calendar-day.blocked {
            background-color: #fafafa;
            border-color: #9e9e9e;
            color: #999;
            text-decoration: line-through;
          }

          .calendar-day.past {
            background-color: #fafafa;
            color: #ccc;
          }

          .calendar-day.selected {
            background-color: var(--bs-primary);
            color: white;
            font-weight: bold;
            border-color: var(--bs-primary);
          }

          .calendar-day.in-range {
            background-color: rgba(var(--bs-primary-rgb), 0.1);
            border-color: var(--bs-primary);
          }

          .calendar-legend {
            padding-top: 12px;
            border-top: 1px solid #e0e0e0;
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            border: 1px solid #ddd;
          }

          .legend-color.available {
            background-color: #e8f5e9;
            border-color: #4caf50;
          }

          .legend-color.reserved {
            background-color: #ffebee;
            border-color: #f44336;
          }

          .legend-color.blocked {
            background-color: #fafafa;
            border-color: #9e9e9e;
          }

          .legend-color.selected {
            background-color: var(--bs-primary);
            border-color: var(--bs-primary);
          }

          @media (max-width: 576px) {
            .calendar-day {
              font-size: 0.75rem;
            }
            
            .calendar-day-name {
              font-size: 0.7rem;
              padding: 4px;
            }
          }
        `}</style>
      </CardBody>
    </Card>
  );
};
