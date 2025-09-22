// Función para mostrar notificaciones
export const showNotification = (message, type = 'info', duration = 3000) => {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
  
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
  
    // Estilos de la notificación
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      fontSize: '14px',
      zIndex: '10000',
      animation: 'slideIn 0.3s ease-out',
      maxWidth: '400px',
      wordWrap: 'break-word',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    });
  
    // Colores según el tipo
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };
  
    notification.style.backgroundColor = colors[type] || colors.info;
  
    // Agregar al DOM
    document.body.appendChild(notification);
  
    // Remover después del tiempo especificado
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  };
  
  // Función para formatear fecha
  export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Función para formatear precio
  export const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Función para validar datos del dispositivo
  export const validateDeviceData = (data) => {
    const errors = {};
  
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'El nombre es requerido';
    }
  
    if (data.name && data.name.length > 100) {
      errors.name = 'El nombre no puede exceder 100 caracteres';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  
  // Función para obtener el color del objeto
  export const getObjectColor = (objectName) => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
      '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
      '#ec4899', '#6366f1', '#14b8a6', '#f59e0b',
    ];
    
    let hash = 0;
    for (let i = 0; i < objectName.length; i++) {
      hash = objectName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Función para obtener la imagen del objeto
  export const getObjectImage = (objectName) => {
    const name = objectName.toLowerCase();
    
    // URLs de imágenes específicas y variadas para cada dispositivo
    if (name.includes('google pixel')) {
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('iphone 12 mini')) {
      return 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('iphone 12 pro max')) {
      return 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('iphone 11')) {
      return 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('samsung galaxy z fold')) {
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('airpods')) {
      return 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('macbook pro')) {
      return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('apple watch')) {
      return 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('beats studio')) {
      return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('ipad mini')) {
      return 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('ipad air')) {
      return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop&crop=center';
    }
    
    // Fallback para otros dispositivos
    if (name.includes('iphone')) {
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('ipad')) {
      return 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('macbook')) {
      return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('watch')) {
      return 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('airpods')) {
      return 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('beats')) {
      return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('pixel')) {
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center';
    }
    if (name.includes('samsung')) {
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center';
    }
    
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center'; // Imagen por defecto
  };

  // Función para obtener el icono del objeto (mantener para compatibilidad)
  export const getObjectIcon = (objectName) => {
    const name = objectName.toLowerCase();
    
    if (name.includes('iphone') || name.includes('phone') || name.includes('pixel')) return '📱';
    if (name.includes('ipad') || name.includes('tablet')) return '📱';
    if (name.includes('macbook') || name.includes('laptop')) return '💻';
    if (name.includes('watch')) return '⌚';
    if (name.includes('airpods') || name.includes('headphones') || name.includes('beats')) return '🎧';
    if (name.includes('samsung')) return '📱';
    if (name.includes('google')) return '📱';
    
    return '📦'; // Icono por defecto
  };
  
  // Función para truncar texto
  export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Función para capitalizar texto
  export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  // Función para debounce (útil para búsquedas)
  export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };
  
  // Función para filtrar objetos
  export const filterObjects = (objects, searchTerm) => {
    if (!searchTerm.trim()) return objects;
    
    const term = searchTerm.toLowerCase();
    return objects.filter(object => 
      object.name.toLowerCase().includes(term) ||
      (object.data && JSON.stringify(object.data).toLowerCase().includes(term))
    );
  };
  
  // Función para ordenar objetos
  export const sortObjects = (objects, sortBy = 'name', order = 'asc') => {
    return [...objects].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.data?.price || a.data?.['Price'] || 0);
          bValue = parseFloat(b.data?.price || b.data?.['Price'] || 0);
          break;
        case 'id':
          aValue = parseInt(a.id);
          bValue = parseInt(b.id);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (order === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });
  };