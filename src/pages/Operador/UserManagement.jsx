import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Pagination,
  Box,
} from "@mui/material";
import { Edit, Delete, PersonAdd } from "@mui/icons-material";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles] = useState([
    { id: 1, descripcion: "Cliente" },
    { id: 2, descripcion: "Operador" },
  ]);
  const [estados, setEstados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Nuevo modal para agregar usuarios
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
    rol_id: "",
    estado_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
    fetchEstados();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/usuarios");
      setUsers(response.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstados = async () => {
    try {
      const response = await api.get("/estados");
      setEstados(response.data);
    } catch (err) {
      console.error("Error al obtener estados:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await api.delete(`/usuarios/${userId}`);
        toast.success("Usuario eliminado correctamente");
        fetchUsers();
      } catch (err) {
        toast.error("Error al eliminar el usuario");
        console.error(err);
      }
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleSaveChanges = async () => {
    try {
      await api.put(`/usuarios/${currentUser.id}`, {
        nombre: currentUser.nombre,
        apellido: currentUser.apellido,
        telefono: currentUser.telefono,
        rol_id: currentUser.rol_id,
        estado_id: currentUser.estado_id,
      });
      toast.success("Usuario actualizado correctamente");
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      toast.error("Error al actualizar el usuario");
      console.error(err);
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewUser({
      nombre: "",
      apellido: "",
      correo: "",
      contrasena: "",
      telefono: "",
      rol_id: "",
      estado_id: "",
    });
  };

  const handleAddUser = async () => {
    try {
      await api.post("/usuarios", newUser);
      toast.success("Usuario agregado correctamente");
      handleCloseAddModal();
      fetchUsers();
    } catch (err) {
      toast.error("Error al agregar el usuario");
      console.error(err);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.nombre} ${user.apellido} ${user.correo}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        Gestión de Usuarios 🙋🏻‍♂️
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          fullWidth
          margin="normal"
          label="Buscar por nombre o correo"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAdd />}
          onClick={handleOpenAddModal}
        >
          Agregar Usuario
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" m={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{`${user.nombre} ${user.apellido}`}</TableCell>
                    <TableCell>{user.correo}</TableCell>
                    <TableCell>{user.telefono}</TableCell>
                    <TableCell>{user.rol}</TableCell>
                    <TableCell>{user.estado}</TableCell>
                    <TableCell>
                      <Button
                        startIcon={<Edit />}
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditUser(user)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        startIcon={<Delete />}
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={Math.ceil(filteredUsers.length / usersPerPage)}
              page={currentPage}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Modal para Editar Usuario */}
      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            value={currentUser?.nombre || ""}
            onChange={(e) => setCurrentUser({ ...currentUser, nombre: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Apellido"
            fullWidth
            value={currentUser?.apellido || ""}
            onChange={(e) => setCurrentUser({ ...currentUser, apellido: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            value={currentUser?.telefono || ""}
            onChange={(e) => setCurrentUser({ ...currentUser, telefono: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Rol</InputLabel>
            <Select
              value={currentUser?.rol_id || ""}
              onChange={(e) => setCurrentUser({ ...currentUser, rol_id: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Estado</InputLabel>
            <Select
              value={currentUser?.estado_id || ""}
              onChange={(e) => setCurrentUser({ ...currentUser, estado_id: e.target.value })}
            >
              {estados.map((estado) => (
                <MenuItem key={estado.id} value={estado.id}>
                  {estado.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges} color="primary" variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Agregar Usuario */}
      <Dialog open={showAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>Agregar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            value={newUser.nombre}
            onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Apellido"
            fullWidth
            value={newUser.apellido}
            onChange={(e) => setNewUser({ ...newUser, apellido: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Correo"
            fullWidth
            value={newUser.correo}
            onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            value={newUser.contrasena}
            onChange={(e) => setNewUser({ ...newUser, contrasena: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            value={newUser.telefono}
            onChange={(e) => setNewUser({ ...newUser, telefono: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Rol</InputLabel>
            <Select
              value={newUser.rol_id}
              onChange={(e) => setNewUser({ ...newUser, rol_id: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Estado</InputLabel>
            <Select
              value={newUser.estado_id}
              onChange={(e) => setNewUser({ ...newUser, estado_id: e.target.value })}
            >
              {estados.map((estado) => (
                <MenuItem key={estado.id} value={estado.id}>
                  {estado.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddUser} color="primary" variant="contained">
            Agregar Usuario
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
