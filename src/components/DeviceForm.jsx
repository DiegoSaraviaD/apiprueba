import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { validateDeviceData } from '../utils/helpers';
import { ModalFooter } from './Modal';

const DeviceForm = ({ device = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    data: {}
  });
  const [errors, setErrors] = useState({});
  const [dataFields, setDataFields] = useState([]);

  // Inicializar formulario con datos del dispositivo (para edición)
  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name || '',
        data: device.data || {}
      });
      
      // Convertir data object a array de campos para el formulario
      if (device.data) {
        const fields = Object.entries(device.data).map(([key, value]) => ({
          key,
          value: value?.toString() || '',
          type: detectFieldType(value)
        }));
        setDataFields(fields);
      }
    }
  }, [device]);

  // Detectar el tipo de campo basado en el valor
  const detectFieldType = (value) => {
    if (typeof value === 'number') {
      return 'number';
    }
    if (typeof value === 'boolean') {
      return 'boolean';
    }
    // Detectar si parece un precio
    if (typeof value === 'string' && value.includes('$')) {
      return 'price';
    }
    return 'text';
  };

  // Manejar cambios en el nombre del dispositivo
  const handleNameChange = (e) => {
    setFormData(prev => ({
      ...prev,
      name: e.target.value
    }));
    
    // Limpiar error del nombre si existe
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  // Agregar nuevo campo de datos
  const addDataField = () => {
    setDataFields(prev => [
      ...prev,
      { key: '', value: '', type: 'text' }
    ]);
  };

  // Eliminar campo de datos
  const removeDataField = (index) => {
    setDataFields(prev => prev.filter((_, i) => i !== index));
  };

  // Manejar cambios en los campos de datos
  const handleDataFieldChange = (index, field, value) => {
    setDataFields(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // Procesar datos del formulario antes del envío
  const processFormData = () => {
    const data = {};
    
    dataFields.forEach(field => {
      if (field.key.trim()) {
        let processedValue = field.value;
        
        // Convertir valores según el tipo
        switch (field.type) {
          case 'number':
          case 'price': {
            const numValue = parseFloat(field.value);
            processedValue = !isNaN(numValue) ? numValue : field.value;
            break;
          }
          case 'boolean':
            processedValue = field.value.toLowerCase() === 'true';
            break;
          default:
            processedValue = field.value;
        }
        
        data[field.key.trim()] = processedValue;
      }
    });
    
    return {
      name: formData.name.trim(),
      data: Object.keys(data).length > 0 ? data : null
    };
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const processedData = processFormData();
    const validation = validateDeviceData(processedData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    try {
      await onSubmit(processedData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  const isEditing = !!device;

  return (
    <form onSubmit={handleSubmit} className="device-form">
      {/* Campo de nombre */}
      <div className="form-group">
        <label htmlFor="device-name" className="form-label">
          Nombre del Dispositivo *
        </label>
        <input
          id="device-name"
          type="text"
          className="form-input"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Ej: iPhone 14 Pro Max"
          disabled={isLoading}
          required
        />
        {errors.name && <div className="form-error">{errors.name}</div>}
        <div className="form-help">
          Ingresa un nombre descriptivo para el dispositivo
        </div>
      </div>

      {/* Campos de datos adicionales */}
      <div className="form-group">
        <div className="flex items-center justify-between mb-4">
          <label className="form-label">Datos Adicionales</label>
          <button
            type="button"
            onClick={addDataField}
            className="btn btn-secondary btn-sm"
            disabled={isLoading}
          >
            <Plus size={16} />
            Agregar Campo
          </button>
        </div>
        
        {dataFields.length === 0 ? (
          <div className="text-center p-4" style={{ color: '#6b7280' }}>
            No hay campos adicionales. Haz clic en "Agregar Campo" para añadir datos.
          </div>
        ) : (
          <div className="space-y-4">
            {dataFields.map((field, index) => (
              <div key={index} className="data-field-row" style={{ 
                display: 'flex', 
                gap: '12px', 
                alignItems: 'flex-start',
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: '#f9fafb'
              }}>
                <div style={{ flex: '1' }}>
                  <input
                    type="text"
                    placeholder="Nombre del campo"
                    className="form-input"
                    value={field.key}
                    onChange={(e) => handleDataFieldChange(index, 'key', e.target.value)}
                    disabled={isLoading}
                    style={{ marginBottom: '8px' }}
                  />
                </div>
                
                <div style={{ flex: '1' }}>
                  <select
                    className="form-select"
                    value={field.type}
                    onChange={(e) => handleDataFieldChange(index, 'type', e.target.value)}
                    disabled={isLoading}
                    style={{ marginBottom: '8px' }}
                  >
                    <option value="text">Texto</option>
                    <option value="number">Número</option>
                    <option value="price">Precio</option>
                    <option value="boolean">Verdadero/Falso</option>
                  </select>
                </div>
                
                <div style={{ flex: '1' }}>
                  {field.type === 'boolean' ? (
                    <select
                      className="form-select"
                      value={field.value}
                      onChange={(e) => handleDataFieldChange(index, 'value', e.target.value)}
                      disabled={isLoading}
                      style={{ marginBottom: '8px' }}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="true">Verdadero</option>
                      <option value="false">Falso</option>
                    </select>
                  ) : (
                    <input
                      type={field.type === 'number' || field.type === 'price' ? 'number' : 'text'}
                      placeholder="Valor"
                      className="form-input"
                      value={field.value}
                      onChange={(e) => handleDataFieldChange(index, 'value', e.target.value)}
                      disabled={isLoading}
                      step={field.type === 'price' ? '0.01' : undefined}
                      style={{ marginBottom: '8px' }}
                    />
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => removeDataField(index)}
                  className="btn btn-danger btn-icon btn-sm"
                  disabled={isLoading}
                  title="Eliminar campo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="form-help">
          Los campos adicionales te permiten agregar información específica como color, precio, capacidad, etc.
        </div>
      </div>

      {/* Footer con botones */}
      <ModalFooter>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          <X size={16} />
          Cancelar
        </button>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          <Save size={16} />
          {isLoading 
            ? 'Guardando...' 
            : isEditing 
              ? 'Actualizar Dispositivo' 
              : 'Crear Dispositivo'
          }
        </button>
      </ModalFooter>
    </form>
  );
};

export default DeviceForm;