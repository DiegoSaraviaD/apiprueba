import { useState, useEffect, useCallback } from 'react';
import { objectService } from '../services/api';
import { showNotification } from '../utils/helpers';

export const useObjects = () => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los objetos
  const fetchObjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await objectService.getAllObjects();
      setObjects(Array.isArray(data) ? data : []);
    } catch (err) {
      let errorMessage = err.message;
      
      // Manejar errores específicos de la API
      if (err.response?.status === 405 || err.response?.status === 429) {
        errorMessage = 'API limitada: Has alcanzado el límite de 100 requests por día. Intenta mañana.';
      } else if (err.response?.status === 404) {
        errorMessage = 'No se encontraron objetos en la API';
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      }
      
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear un nuevo objeto
  const createObject = useCallback(async (objectData) => {
    try {
      setError(null);
      console.log('🔍 [HOOK] Creando objeto:', objectData);
      const newObject = await objectService.createObject(objectData);
      console.log('✅ [HOOK] Objeto creado:', newObject);
      setObjects(prev => [...prev, newObject]);
      showNotification('Objeto creado exitosamente', 'success');
      return newObject;
    } catch (err) {
      console.error('❌ [HOOK] Error al crear objeto:', err);
      setError(err.message);
      showNotification(err.message, 'error');
      throw err;
    }
  }, []);

  // Actualizar un objeto
  const updateObject = useCallback(async (id, objectData) => {
    try {
      setError(null);
      console.log('🔍 [HOOK] Actualizando objeto:', id, objectData);
      const updatedObject = await objectService.updateObject(id, objectData);
      console.log('✅ [HOOK] Objeto actualizado:', updatedObject);
      setObjects(prev => 
        prev.map(object => 
          object.id === id ? updatedObject : object
        )
      );
      showNotification('Objeto actualizado exitosamente', 'success');
      return updatedObject;
    } catch (err) {
      console.error('❌ [HOOK] Error al actualizar objeto:', err);
      setError(err.message);
      showNotification(err.message, 'error');
      throw err;
    }
  }, []);

  // Eliminar un objeto
  const deleteObject = useCallback(async (id) => {
    try {
      setError(null);
      await objectService.deleteObject(id);
      setObjects(prev => prev.filter(object => object.id !== id));
      showNotification('Objeto eliminado exitosamente', 'success');
      return true;
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
      throw err;
    }
  }, []);

  // Obtener un objeto por ID
  const getObjectById = useCallback(async (id) => {
    try {
      setError(null);
      return await objectService.getObjectById(id);
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
      throw err;
    }
  }, []);

  // Cargar objetos al montar el componente
  useEffect(() => {
    fetchObjects();
  }, [fetchObjects]);

  return {
    objects,
    loading,
    error,
    createObject,
    updateObject,
    deleteObject,
    getObjectById,
    refetch: fetchObjects,
  };
};
