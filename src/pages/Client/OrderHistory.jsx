import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/pedidos/historial");
        setOrders(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los pedidos. Intente nuevamente.");
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderOrderCard = (order) => {
    return (
      <Card 
        key={order.pedido_id} 
        sx={{ 
          mb: 3, 
          boxShadow: 1,
          '&:hover': {
            boxShadow: 3,
            transition: 'box-shadow 0.3s ease-in-out'
          }
        }}
      >
        <CardHeader
          sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
          title={`Pedido #${order.pedido_id}`}
          action={
            <Chip 
              label={order.estado}
              color={getStatusColor(order.estado)}
              size="small"
            />
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                <strong>Fecha:</strong> {new Date(order.fecha).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Productos:</strong> {order.productos}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="h6" color="primary">
                Total: Q{order.total.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Cargando historial de pedidos...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Historial de Compras
      </Typography>
      
      {orders.length > 0 ? (
        orders.map(renderOrderCard)
      ) : (
        <Alert severity="info">
          Aún no tienes pedidos realizados.
        </Alert>
      )}
    </Container>
  );
};

export default OrderHistory;

