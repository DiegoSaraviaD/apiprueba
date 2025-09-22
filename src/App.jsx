import React, { useState, useMemo, useEffect } from 'react';
import { Search, Package } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import DeviceCard from './components/DeviceCard';
import DeviceForm from './components/DeviceForm';
import Modal from './components/Modal';
import LoadingSpinner from './components/LoadingSpinner';

// Hooks and Utils
import { useObjects } from './hooks/useObjects';
import { filterObjects, sortObjects, debounce } from './utils/helpers';

// Styles
import './index.css';

function App() {
  const {
    objects,
    loading,
    error,
    createObject,
    updateObject,
    deleteObject,
    refetch
  } = useObjects();


  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Función debounced para búsqueda
  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.custom-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Filtrar y ordenar objetos
  const processedObjects = useMemo(() => {
    let result = filterObjects(objects, searchTerm);
    result = sortObjects(result, sortBy, sortOrder);
    return result;
  }, [objects, searchTerm, sortBy, sortOrder]);

  // Handlers para modal
  const handleOpenModal = (object = null) => {
    console.log('🔍 [APP] Abriendo modal con objeto:', object);
    setSelectedObject(object);
    setIsModalOpen(true);
    console.log('✅ [APP] Modal abierto, isModalOpen:', true);
  };

  const handleCloseModal = () => {
    console.log('🔍 [APP] Cerrando modal');
    setIsModalOpen(false);
    setSelectedObject(null);
    setIsSubmitting(false);
    console.log('✅ [APP] Modal cerrado');
  };

  // Handler para crear/editar objeto
  const handleSubmitObject = async (objectData) => {
    setIsSubmitting(true);
    
    try {
      if (selectedObject) {
        // Editar objeto existente
        await updateObject(selectedObject.id, objectData);
      } else {
        // Crear nuevo objeto
        await createObject(objectData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar objeto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para eliminar objeto
  const handleDeleteObject = async (objectId) => {
    try {
      await deleteObject(objectId);
    } catch (error) {
      console.error('Error al eliminar objeto:', error);
    }
  };

  // Handler para buscar
  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Handler para cambiar ordenamiento
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  return (
    <div className="app">
      <Navbar
        onAddDevice={() => handleOpenModal()}
        onRefresh={refetch}
        isLoading={loading}
      />

      <main className="main-content">
        {/* Header de la página */}
        <div className="page-header">
        <h1 className="page-title">Prueba API</h1>
        <p className="page-subtitle">
          Aplicación de prueba para consumir la API RESTful
        </p>
        {error && error.includes('API limitada') && (
          <div style={{
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '16px',
            color: '#ffc107',
            fontSize: '0.9rem'
          }}>
            ⚠️ <strong>API Limitada:</strong> Has alcanzado el límite de 100 requests por día. 
            La API se reseteará mañana. Mientras tanto, puedes explorar los datos ya cargados.
          </div>
        )}
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="controls">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar productos..."
              onChange={handleSearchChange}
            />
          </div>

          <div className="sort-controls">
            <div className="custom-dropdown">
              <button 
                className="dropdown-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>
                  {sortBy === 'name' && 'Ordenar por Nombre'}
                  {sortBy === 'price' && 'Ordenar por Precio'}
                  {sortBy === 'id' && 'Ordenar por ID'}
                </span>
                <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button 
                    className={`dropdown-item ${sortBy === 'name' ? 'active' : ''}`}
                    onClick={() => {
                      handleSortChange('name');
                      setIsDropdownOpen(false);
                    }}
                  >
                    Ordenar por Nombre
                  </button>
                  <button 
                    className={`dropdown-item ${sortBy === 'price' ? 'active' : ''}`}
                    onClick={() => {
                      handleSortChange('price');
                      setIsDropdownOpen(false);
                    }}
                  >
                    Ordenar por Precio
                  </button>
                  <button 
                    className={`dropdown-item ${sortBy === 'id' ? 'active' : ''}`}
                    onClick={() => {
                      handleSortChange('id');
                      setIsDropdownOpen(false);
                    }}
                  >
                    Ordenar por ID
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estados de la aplicación */}
        {loading && !objects.length ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3 className="empty-state-title">Error al cargar objetos</h3>
            <p className="empty-state-description">{error}</p>
            <button onClick={refetch} className="btn btn-primary">
              Reintentar
            </button>
          </div>
        ) : processedObjects.length === 0 ? (
          searchTerm ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No se encontraron objetos</h3>
            <p className="empty-state-description">
              No hay objetos que coincidan con "{searchTerm}"
            </p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="btn btn-secondary"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Package size={64} />
              </div>
              <h3 className="empty-state-title">No hay objetos</h3>
              <p className="empty-state-description">
                Comienza agregando tu primer objeto para probar la API
              </p>
              <button 
                onClick={() => handleOpenModal()} 
                className="btn btn-primary"
              >
                Agregar Primer Objeto
              </button>
            </div>
          )
        ) : (
          // Grid de objetos
          <div className="devices-grid">
            {processedObjects.map((object) => (
              <DeviceCard
                key={object.id}
                device={object}
                onEdit={() => handleOpenModal(object)}
                onDelete={handleDeleteObject}
                isLoading={loading}
              />
            ))}
          </div>
        )}

        {/* Información adicional */}
        {processedObjects.length > 0 && (
          <div className="stats" style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
            marginTop: '2rem',
            fontSize: '0.875rem'
          }}>
            Mostrando {processedObjects.length} de {objects.length} objetos de la API
          </div>
        )}
      </main>

      {/* Modal para agregar/editar objeto */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedObject ? 'Editar Objeto' : 'Nuevo Objeto'}
        size="lg"
      >
        <DeviceForm
          device={selectedObject}
          onSubmit={handleSubmitObject}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}

export default App;