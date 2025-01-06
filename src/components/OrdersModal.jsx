import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Paper,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import api from "../services/api";

const OrdersModal = ({ open, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'PedidoID', direction: 'asc' });
//   const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/pedidos/pedidos");
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'Pendiente': { color: 'warning', label: 'Pendiente' },
      'Confirmado': { color: 'success', label: 'Confirmado' },
      'Cancelado': { color: 'error', label: 'Cancelado' },
      'En Envío': { color: 'info', label: 'En Envío' },
    };

    const config = statusConfig[status] || statusConfig.Pendiente;

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{
          borderRadius: '16px',
          fontSize: '0.75rem',
          fontWeight: 500,
        }}
      />
    );
  };

  const filteredOrders = orders
    .filter(order => 
      order.ClienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.PedidoID.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ px: 3, py: 2 }}>
        <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
                Lista de Órdenes
            </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} >
            <Table sx={{ minWidth: 800 }} aria-label="simple table" >
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Productos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order) => {
                  const isSelected = selected.indexOf(order.PedidoID) !== -1;
                  return (
                    <TableRow
                      hover
                      key={order.PedidoID}
                      selected={isSelected}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {/* <Avatar
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              mr: 2,
                              bgcolor: `primary.light`,
                            }}
                          >
                            {order.ClienteNombre.charAt(0)}
                          </Avatar> */}
                          <Typography variant="body2">
                            {order.ClienteNombre}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getStatusChip(order.Estado)}</TableCell>
                      <TableCell>
                        {new Date(order.FechaHoraPedido).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {order.Productos}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            borderTop: 1,
            borderColor: 'divider',
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OrdersModal;

