import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { BarChart, PieChart, SparkLineChart } from "@mui/x-charts";
import { ShoppingBag, Person, ShoppingCart, Message } from "@mui/icons-material";
import OrdersModal from "../../components/OrdersModal";
import { useNavigate } from "react-router-dom";

const HomeOperator = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalUsuarios: 0,
    totalProductos: 0,
    usuarioConMasPedidos: null,
    ordenesPendientes: 0,
    totalOrdenes: 0,
    categorias: [],
    operadores: [],
  });
  const [loading, setLoading] = useState(true);
  const [openOrdersModal, setOpenOrdersModal] = useState(false);

  const handleOpenModal = () => setOpenOrdersModal(true);
  const handleCloseModal = () => setOpenOrdersModal(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usuariosRes, productosRes, pedidosRes, ordenesRes, categoriasRes] = await Promise.all([
        api.get("/usuarios"),
        api.get("/productos"),
        api.get("/pedidos/pendientes"),
        api.get("/pedidos/pedidos"),
        api.get("/categorias"),
      ]);

      const pedidos = pedidosRes.data;
      const pendientes = pedidos.filter((pedido) => pedido.estado === "Pendiente").length;

      const pedidosPorUsuario = pedidos.reduce((acc, pedido) => {
        acc[pedido.cliente] = (acc[pedido.cliente] || 0) + 1;
        return acc;
      }, {});

      const maxPedidosUsuario = Object.entries(pedidosPorUsuario).reduce(
        (max, current) => (current[1] > max[1] ? current : max),
        ["N/A", 0]
      );

      setDashboardData({
        totalUsuarios: usuariosRes.data.length,
        // nombreUsuario: usuariosRes.data.
        totalProductos: productosRes.data.length,
        totalOrdenes: ordenesRes.data.length,
        usuarioConMasPedidos: { nombre: maxPedidosUsuario[0], total: maxPedidosUsuario[1] },
        ordenesPendientes: pendientes,
        categorias: categoriasRes.data,
        categoriasTotal: categoriasRes.data.length,
        operadores: usuariosRes.data.filter((user) => user.rol === "Operador"),
      });
    } catch (err) {
      console.error("Error al obtener datos del dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalOrdenesCompletadas = dashboardData.totalOrdenes - dashboardData.ordenesPendientes; 


  const StatCard = ({ title, value, icon, color, sparkData, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: '1px solid',
        borderColor: `${color}25`,
        borderRadius: 4,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: `${color}15`,
              display: 'flex',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          {value}
        </Typography>
        <Box sx={{ height: 40 }}>
          <SparkLineChart
            data={sparkData}
            height={40}
            showTooltip={false}
            colors={[color]}
          />
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Datos simulados para los sparklines
  const sparklineData = Array(10).fill(0).map(() => Math.random() * 100);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
        Hola, bienvenido de nuevo 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Órdenes Pendientes"
            value={dashboardData.ordenesPendientes}
            onClick={() => navigate("/orders")}
            icon={<ShoppingCart sx={{ color: '#ff9800' }} />}
            color="#ff2545"
            sparkData={sparklineData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Órdenes"
            value={dashboardData.totalOrdenes}
            onClick={handleOpenModal} 
            icon={<ShoppingCart sx={{ color: '#ff9800' }} />}
            color="#ff9800"
            sparkData={sparklineData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Productos"
            value={dashboardData.totalProductos}
            onClick={() => navigate("/products")}
            icon={<ShoppingBag sx={{ color: '#2196f3' }} />}
            color="#2196f3"
            sparkData={sparklineData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Usuarios"
            value={dashboardData.totalUsuarios}
            onClick={() => navigate("/users")}
            icon={<Person sx={{ color: '#9c27b0' }} />}
            color="#9c27b0"
            sparkData={sparklineData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Categorias"
            value={dashboardData.categoriasTotal}
            onClick={() => navigate("/categories")}
            icon={<Person sx={{ color: '#9c27b0' }} />}
            color="#9c27b0"
            sparkData={sparklineData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuario con Más Pedidos"
            value={dashboardData.usuarioConMasPedidos?.nombre || 0}
            
            icon={<Message sx={{ color: '#f44336' }} />}
            color="#f44336"
            sparkData={sparklineData}
          />
        </Grid>

        {/* <Grid item xs={12} md={6}>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Categorías
            </Typography>
            <Box sx={{ height: 400 }}>
              <PieChart
                series={[
                  {
                    data: dashboardData.categorias.map((cat, index) => ({
                      id: index,
                      value: cat.totalProductos || 1,
                      label: cat.nombre,
                    })),
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30 },
                  },
                ]}
                height={400}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Órdenes
            </Typography>
            <Box sx={{ height: 400 }}>
              <PieChart
                series={[
                  {
                    data: [
                      {id: 0, value: dashboardData.ordenesPendientes, label: "Pendiente"},
                      {id: 1, value: totalOrdenesCompletadas, label: "Completados"},

                    ],
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30 },
                  },
                ]}
                height={400}
              />
            </Box>
          </Paper>
        </Grid> */}

        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Lista de Operadores
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell>Teléfono</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.operadores.map((op) => (
                    <TableRow key={op.id}>
                      <TableCell>{op.id}</TableCell>
                      <TableCell>{`${op.nombre} ${op.apellido}`}</TableCell>
                      <TableCell>{op.correo}</TableCell>
                      <TableCell>{op.telefono}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <OrdersModal open={openOrdersModal} onClose={handleCloseModal} />
    </Container>
  );
};

export default HomeOperator;



