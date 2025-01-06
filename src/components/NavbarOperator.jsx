import { useContext } from 'react';
import { Link } from "react-router-dom";
import { LogOut, Home, BarChart2, Package, FileText, Users, Menu } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import logo from '../img/LogoMiTiendita.png';
import { toast } from 'react-hot-toast';

const NavbarOperator = ({ collapsed, setCollapsed }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    toast.success("Adiós, vuelva pronto!");
    logout();
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <img src={logo} alt="Logo" className="logo" />}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <Menu />
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link to="/home-operator" className="nav-item">
          <Home className="nav-icon" />
          <span>Panel Principal</span>
        </Link>
        
        <Link to="/orders" className="nav-item">
          <BarChart2 className="nav-icon" />
          <span>Historial de Órdenes</span>
        </Link>
        
        <Link to="/products" className="nav-item">
          <Package className="nav-icon" />
          <span>Productos</span>
        </Link>

        <Link to="/add-product" className="nav-item">
          <Package className="nav-icon" />
          <span>Agregar Producto</span>
        </Link>
        
        <Link to="/categories" className="nav-item">
          <FileText className="nav-icon" />
          <span>Categorías</span>
        </Link>
        
        <Link to="/users" className="nav-item">
          <Users className="nav-icon" />
          <span>Usuarios</span>
        </Link>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut className="nav-icon" />
        <span className="logout-text">Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default NavbarOperator;