import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import { LocalShipping, Cancel, Refresh, Info } from "@mui/icons-material";
import OrdersModal from "../../components/OrdersModal";
import { toast, Toaster } from 'react-hot-toast';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openOrdersModal, setOpenOrdersModal] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/pedidos/pendientes");
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Error al cargar los pedidos", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (actionType === "deliver") {
      await updateOrderStatus(selectedOrder.pedido_id, 4);
      toast.success("Pedido entregado.");
    } else if (actionType === "reject") {
      await updateOrderStatus(selectedOrder.pedido_id, 5);
      toast.error("Pedido rechazado.");
    }
    setConfirmDialogOpen(false);
  };

  const updateOrderStatus = async (id, statusId) => {
    try {
      await api.put(`/pedidos/${id}/estado`, { estado_id: statusId });
      setSnackbar({ open: true, message: "Estado del pedido actualizado", severity: "success" });
      setOrders(orders.filter(order => order.pedido_id !== id));
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Error al actualizar el estado del pedido", severity: "error" });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenModal = () => {
    setOpenOrdersModal(true);
  };

  const handleCloseModal = () => {
    setOpenOrdersModal(false);
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenConfirmDialog = (order, type) => {
    setSelectedOrder(order);
    setActionType(type);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Toaster />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Órdenes Pendientes 🛍️
        </Typography>

        <Box>
          <Tooltip title="Ver todas las órdenes">
            <Button variant="outlined" onClick={handleOpenModal} color="primary">
              Ver todas las Órdenes
            </Button>
          </Tooltip>
          <Tooltip title="Actualizar">
            <IconButton color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
        <OrdersModal open={openOrdersModal} onClose={handleCloseModal} />
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Alert severity="info">No hay órdenes pendientes.</Alert>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.pedido_id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pedido #{order.pedido_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cliente: {order.cliente}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    Producto/s: {order.productos}
                  </Typography>
                  <Box mt={2}>
                    <Chip
                      label={`Total: Q${order.total.toFixed(2)}`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<LocalShipping />}
                    onClick={() => handleOpenConfirmDialog(order, "deliver")}
                    color="success"
                  >
                    Entregar
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Cancel />}
                    onClick={() => handleOpenConfirmDialog(order, "reject")}
                    color="error"
                  >
                    Rechazar
                  </Button>
                  <IconButton size="small" onClick={() => handleOpenDialog(order)}>
                    <Info />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Detalles del Pedido #{selectedOrder?.pedido_id}</DialogTitle>
        <DialogContent>
          <Typography><strong>Cliente:</strong> {selectedOrder?.cliente}</Typography>
          <Typography><strong>Productos:</strong> {selectedOrder?.productos}</Typography>
          <Typography><strong>Total:</strong> Q{selectedOrder?.total.toFixed(2)}</Typography>
          {/* Add more order details here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        sx={{
          '& .MuiDialog-paper': {
            padding: 2,
            borderRadius: 4,
            boxShadow: 24,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>Confirmar Acción</DialogTitle>
        <DialogContent>
          <Typography align="center" variant="body1">
            ¿Está seguro de que desea {actionType === "deliver" ? "entregar" : "rechazar"} el pedido #{selectedOrder?.pedido_id}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseConfirmDialog} color="error" variant="outlined">Cancelar</Button>
          <Button onClick={handleConfirmAction} color="primary" variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersList;