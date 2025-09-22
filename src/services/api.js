import axios from 'axios';

const BASE_URL = 'https://api.restful-api.dev';

// Configuración de axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Servicio para manejar objetos
export const objectService = {
  // Obtener todos los objetos
  getAllObjects: async () => {
    const response = await api.get('/objects');
    return response.data;
  },

  // Obtener un objeto por ID
  getObjectById: async (id) => {
    const response = await api.get(`/objects/${id}`);
    return response.data;
  },

  // Obtener múltiples objetos por IDs
  getObjectsByIds: async (ids) => {
    const idsString = ids.join(',');
    const response = await api.get(`/objects?id=${idsString}`);
    return response.data;
  },

  // Crear un nuevo objeto
  createObject: async (objectData) => {
    const response = await api.post('/objects', objectData);
    return response.data;
  },

  // Actualizar un objeto
  updateObject: async (id, objectData) => {
    const response = await api.put(`/objects/${id}`, objectData);
    return response.data;
  },

  // Actualizar parcialmente un objeto
  patchObject: async (id, partialData) => {
    const response = await api.patch(`/objects/${id}`, partialData);
    return response.data;
  },

  // Eliminar un objeto
  deleteObject: async (id) => {
    await api.delete(`/objects/${id}`);
    return true;
  },
};

export default api;