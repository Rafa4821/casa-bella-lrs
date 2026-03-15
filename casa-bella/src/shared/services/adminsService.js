import { COLLECTIONS } from '../constants/collections';
import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  findDocumentByField,
  where,
  orderBy,
} from '../utils/firestore';

/**
 * @typedef {Object} Admin
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} role - superadmin, admin, staff
 * @property {boolean} active
 * @property {string} [phone]
 */

/**
 * @param {string} id
 * @returns {Promise<Admin|null>}
 */
export const getAdmin = async (id) => {
  return await getDocument(COLLECTIONS.ADMINS, id);
};

/**
 * @param {string} email
 * @returns {Promise<Admin|null>}
 */
export const getAdminByEmail = async (email) => {
  return await findDocumentByField(COLLECTIONS.ADMINS, 'email', email);
};

/**
 * @param {boolean} [activeOnly=false]
 * @returns {Promise<Array<Admin>>}
 */
export const getAdmins = async (activeOnly = false) => {
  const constraints = [orderBy('name', 'asc')];
  
  if (activeOnly) {
    constraints.unshift(where('active', '==', true));
  }
  
  return await getDocuments(COLLECTIONS.ADMINS, constraints);
};

/**
 * @param {Omit<Admin, 'id'>} data
 * @returns {Promise<string>}
 */
export const createAdmin = async (data) => {
  const existingAdmin = await getAdminByEmail(data.email);
  
  if (existingAdmin) {
    throw new Error('Un administrador con este correo ya existe');
  }
  
  const adminData = {
    email: data.email,
    name: data.name,
    role: data.role || 'admin',
    active: data.active !== undefined ? data.active : true,
    phone: data.phone || '',
  };
  
  return await createDocument(COLLECTIONS.ADMINS, adminData);
};

/**
 * @param {string} id
 * @param {Partial<Admin>} data
 * @returns {Promise<void>}
 */
export const updateAdmin = async (id, data) => {
  if (data.email) {
    const existingAdmin = await getAdminByEmail(data.email);
    if (existingAdmin && existingAdmin.id !== id) {
      throw new Error('Un administrador con este correo ya existe');
    }
  }
  
  await updateDocument(COLLECTIONS.ADMINS, id, data);
};

/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteAdmin = async (id) => {
  await deleteDocument(COLLECTIONS.ADMINS, id);
};

/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export const toggleAdminStatus = async (id) => {
  const admin = await getAdmin(id);
  if (admin) {
    await updateAdmin(id, { active: !admin.active });
  }
};

/**
 * @param {string} role
 * @returns {Promise<Array<Admin>>}
 */
export const getAdminsByRole = async (role) => {
  const constraints = [
    where('role', '==', role),
    where('active', '==', true),
    orderBy('name', 'asc'),
  ];
  
  return await getDocuments(COLLECTIONS.ADMINS, constraints);
};
