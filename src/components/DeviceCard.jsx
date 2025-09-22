import React, { useState } from 'react';
import { 
  Edit2, 
  Trash2
} from 'lucide-react';
import { 
  getObjectColor, 
  getObjectImage, 
  formatPrice, 
  formatDate, 
  capitalize 
} from '../utils/helpers';

// Los iconos ahora se manejan con emojis desde getObjectIcon

const DeviceCard = ({ device, onEdit, onDelete, isLoading = false }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este objeto?')) {
      setIsDeleting(true);
      try {
        await onDelete(device.id);
      } catch (error) {
        console.error('Error al eliminar objeto:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const objectImage = getObjectImage(device.name);
  const objectColor = getObjectColor(device.name);

  // Formatear los datos del dispositivo
  const formatDeviceData = (data) => {
    if (!data || typeof data !== 'object') return [];
    
    return Object.entries(data).map(([key, value]) => {
      let formattedValue = value;
      
      // Formatear valores especiales
      if (key.toLowerCase().includes('price') && typeof value === 'number') {
        formattedValue = formatPrice(value);
      } else if (typeof value === 'number') {
        formattedValue = value.toLocaleString();
      } else if (typeof value === 'string') {
        formattedValue = value;
      } else {
        formattedValue = String(value);
      }
      
      return {
        key: capitalize(key.replace(/([A-Z])/g, ' $1').trim()),
        value: formattedValue,
        originalKey: key
      };
    });
  };

  const deviceData = formatDeviceData(device.data);
  const hasData = deviceData.length > 0;

  return (
    <div className="device-card">
      <div className="device-header">
        <div>
          <div 
            className="device-icon" 
            style={{ backgroundColor: objectColor }}
          >
            <img 
              src={objectImage} 
              alt={device.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: '20px'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div 
              style={{ 
                display: 'none',
                width: '100%', 
                height: '100%', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '2rem'
              }}
            >
              📦
            </div>
          </div>
          <h3 className="device-name" title={device.name}>
            {device.name}
          </h3>
          <div className="device-id">
            ID: {device.id}
          </div>
        </div>
      </div>

      {hasData && (
        <div className="device-data">
          {deviceData.map(({ key, value, originalKey }) => (
            <div key={originalKey} className="data-item">
              <span className="data-key">{key}:</span>
              <span className="data-value">{value}</span>
            </div>
          ))}
        </div>
      )}

      {!hasData && (
        <div className="device-data">
          <div className="data-item">
            <span className="data-key">Estado:</span>
            <span className="data-value" style={{ color: '#6b7280' }}>
              Sin datos adicionales
            </span>
          </div>
        </div>
      )}

      <div className="device-actions">
        <button
          onClick={() => onEdit(device)}
          className="btn btn-secondary btn-sm"
          disabled={isLoading || isDeleting}
          title="Editar objeto"
        >
          <Edit2 size={16} />
          Editar
        </button>
        
        <button
          onClick={handleDelete}
          className="btn btn-danger btn-sm"
          disabled={isLoading || isDeleting}
          title="Eliminar objeto"
        >
          <Trash2 size={16} />
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>

      {(device.createdAt || device.updatedAt) && (
        <div className="device-meta">
          {device.createdAt && (
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={12} />
              <span>Creado: {formatDate(device.createdAt)}</span>
            </div>
          )}
          {device.updatedAt && (
            <div className="flex items-center gap-2">
              <Clock size={12} />
              <span>Actualizado: {formatDate(device.updatedAt)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceCard;