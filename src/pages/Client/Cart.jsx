import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box,
  Paper,
  Grid,
  ButtonGroup,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { pink } from '@mui/material/colors';
import toast from "react-hot-toast";

const Cart = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const navigate = useNavigate();

  const confirmPurchase = async () => {
    try {
      const detalles = cart.map((item) => ({
        producto_id: item.id,
        cantidad: item.quantity || 1,
        subtotal: item.precio * (item.quantity || 1),
      }));

      const total = detalles.reduce((sum, item) => sum + item.subtotal, 0);

      await api.post("/pedidos/confirmar", { usuario_id: 1, total, detalles });

      
      toast.success("Compra confirmada.");
      // alert("Compra confirmada");
      setCart([]);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage")); // Sincroniza con otros componentes
      navigate("/home-client");
    } catch (err) {
      console.error("Error al confirmar la compra:", err);
    }
  };

  const cancelPurchase = () => {
    setCart([]);
    localStorage.removeItem("cart");
    // alert("Compra cancelada");
    window.dispatchEvent(new Event("storage")); // Sincroniza con otros componentes
    toast.success("Compra Cancelada.");
  };

  const handleRemoveProduct = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage")); // Sincroniza con otros componentes
    toast.success("Producto eliminado del carrito.");
  };

  // const handleRemoveProduct = (index) => {
  //   const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
  //   currentCart.splice(index, 1); // Elimina el producto del carrito
  //   localStorage.setItem("cart", JSON.stringify(currentCart));
  //   window.dispatchEvent(new Event("storage")); // Sincroniza con otros componentes
  //   toast.success("Producto eliminado del carrito.");
  // };

  const handleQuantityChange = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity = (newCart[index].quantity || 1) + delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Carrito de Compras
      </Typography>
      {cart.length > 0 ? (
        <Paper elevation={3}>
          <List>
            {cart.map((item, index) => (
              <ListItem key={index} divider>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  </Grid>
                  <Grid item xs>
                    <ListItemText
                      primary={<Typography variant="subtitle1">{item.nombre}</Typography>}
                      secondary={<Typography variant="body2">Q{item.precio}</Typography>}
                    />
                    <ButtonGroup size="small" sx={{ mt: 1 }}>
                      <Button onClick={() => handleQuantityChange(index, -1)}>
                        <Remove fontSize="small" />
                      </Button>
                      <Button disabled>{item.quantity || 1}</Button>
                      <Button onClick={() => handleQuantityChange(index, 1)}>
                        <Add fontSize="small" />
                      </Button>
                    </ButtonGroup>
                  </Grid>
                  <Grid item>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemoveProduct(index)}>
                        <Delete sx={{ color: pink[500] }} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Total: Q{cart.reduce((sum, item) => sum + item.precio * (item.quantity || 1), 0)}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="contained" color="primary" onClick={confirmPurchase}>
                Confirmar Compra
              </Button>
              <Button variant="outlined" color="error" onClick={cancelPurchase}>
                Cancelar Compra
              </Button>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Typography variant="body1">No hay productos en el carrito.</Typography>
      )}
    </Container>
  );
};

export default Cart;
