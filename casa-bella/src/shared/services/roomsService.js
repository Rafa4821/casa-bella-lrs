import { COLLECTIONS } from '../constants/collections';
import {
  getDocument,
  getDocuments,
  setDocument,
  updateDocument,
  deleteDocument,
  createDocument,
} from '../utils/firestore';

const ROOMS_COLLECTION = 'rooms';

/**
 * Get all rooms
 * @returns {Promise<Array>}
 */
export const getRooms = async () => {
  try {
    const rooms = await getDocuments(COLLECTIONS.ROOMS);
    return rooms.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error getting rooms:', error);
    throw error;
  }
};

/**
 * Get a single room by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getRoom = async (id) => {
  try {
    return await getDocument(COLLECTIONS.ROOMS, id);
  } catch (error) {
    console.error('Error getting room:', error);
    throw error;
  }
};

/**
 * Create a new room
 * @param {Object} roomData
 * @returns {Promise<string>} - Room ID
 */
export const createRoom = async (roomData) => {
  try {
    const id = await createDocument(COLLECTIONS.ROOMS, roomData);
    return id;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

/**
 * Update a room
 * @param {string} id
 * @param {Object} roomData
 * @returns {Promise<void>}
 */
export const updateRoom = async (id, roomData) => {
  try {
    await updateDocument(COLLECTIONS.ROOMS, id, roomData);
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

/**
 * Delete a room
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteRoom = async (id) => {
  try {
    await deleteDocument(COLLECTIONS.ROOMS, id);
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

/**
 * Create default rooms if none exist
 * @returns {Promise<void>}
 */
export const createDefaultRooms = async () => {
  const existingRooms = await getRooms();
  
  if (existingRooms.length > 0) {
    return; // Already have rooms
  }

  const defaultRooms = [
    {
      name: 'Habitación Vista al Mar',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      capacity: '2 personas',
      beds: 'Cama matrimonial',
      size: '18 m²',
      amenities: [
        'Aire acondicionado',
        'Baño privado',
        'Vista al mar',
        'Closet amplio',
        'Ventilador de techo',
      ],
      order: 1,
    },
    {
      name: 'Habitación Garden View',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      capacity: '2 personas',
      beds: 'Cama matrimonial',
      size: '16 m²',
      amenities: [
        'Aire acondicionado',
        'Baño privado',
        'Vista al jardín',
        'Closet',
        'Ventilador',
      ],
      order: 2,
    },
    {
      name: 'Habitación Superior',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
      capacity: '2 personas',
      beds: 'Cama matrimonial',
      size: '20 m²',
      amenities: [
        'Aire acondicionado',
        'Baño privado premium',
        'Balcón privado',
        'Closet amplio',
        'Smart TV',
      ],
      order: 3,
    },
    {
      name: 'Habitación Deluxe',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      capacity: '2 personas',
      beds: 'Cama king size',
      size: '25 m²',
      amenities: [
        'Aire acondicionado',
        'Baño privado de lujo',
        'Terraza con vista panorámica',
        'Walking closet',
        'Smart TV',
        'Mini bar',
      ],
      order: 4,
    },
  ];

  for (const room of defaultRooms) {
    await createRoom(room);
  }
};
