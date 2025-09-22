import React from 'react';
import { Package, Plus, RefreshCw } from 'lucide-react';

const Navbar = ({ onAddDevice, onRefresh, isLoading }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Package size={32} />
          Tienda
        </div>
        
        <div className="nav-actions">
          <button
            onClick={onRefresh}
            className="btn btn-secondary btn-icon"
            disabled={isLoading}
            title="Actualizar objetos"
          >
            <RefreshCw 
              size={18} 
              style={{
                animation: isLoading ? 'spin 1s linear infinite' : 'none'
              }}
            />
          </button>
          
          <button
            onClick={onAddDevice}
            className="btn btn-primary"
            disabled={isLoading}
          >
            <Plus size={18} />
            Nuevo Producto
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;