import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ClipboardList, LogOut } from 'lucide-react';
import logo from '../img/LogoMiTiendita.png';
import { AuthContext } from "../context/AuthContext";
import { 
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Badge,
  styled
} from '@mui/material';
import toast from "react-hot-toast";

// Styled components
const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
});

const LogoImage = styled('img')({
  height: '40px',
  marginRight: '10px',
});

const NavbarClient = () => {
  const { logout } = useContext(AuthContext);
  const [cartItemCount, setCartItemCount] = useState(0);

  const updateCartItemCount = () => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItemCount(currentCart.length);
  };

  useEffect(() => {
    updateCartItemCount();
    const handleStorageChange = () => updateCartItemCount();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    toast.success("Adiós, vuelva pronto!");
    logout();
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <StyledLink to="/home-client">
          <LogoImage src={logo} alt="Mi Tiendita Online" />
          <Typography variant="h5" component="div" sx={{ color: 'success.main', fontStyle: 'italic', fontWeight: 'bold' }}>
            Mi Tiendita Online
          </Typography>
        </StyledLink>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/cart"
            variant="outlined"
            color="success"
            startIcon={
              <Badge badgeContent={cartItemCount} color="error" sx={{ '& .MuiBadge-badge': { top: -5, right: -5 } }}>
                <ShoppingCart />
              </Badge>
            }
          >
            Carrito
          </Button>

          <Button
            component={Link}
            to="/order-history"
            variant="outlined"
            color="success"
            startIcon={<ClipboardList />}
          >
            Historial
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<LogOut />}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarClient;