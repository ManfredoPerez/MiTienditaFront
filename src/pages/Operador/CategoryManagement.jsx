import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [estados, setEstados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchEstados();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/categorias");
      setCategories(response.data);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const categoryData = {
      nombre: data.get("nombre"),
      estado_id: parseInt(data.get("estado_id")),
    };

    try {
      await api.post("/categorias", categoryData);
      alert("Categoría agregada correctamente");
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      alert("Error al agregar categoría");
      console.error(err);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const categoryData = {
      nombre: data.get("nombre"),
      estado_id: parseInt(data.get("estado_id")),
    };

    try {
      await api.put(`/categorias/${currentCategory.id}`, categoryData);
      alert("Categoría actualizada correctamente");
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      alert("Error al actualizar categoría");
      console.error(err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      try {
        await api.delete(`/categorias/${categoryId}`);
        alert("Categoría eliminada correctamente");
        fetchCategories();
      } catch (err) {
        alert("Error al eliminar categoría");
        console.error(err);
      }
    }
  };

  const handleAddModal = () => {
    setCurrentCategory(null);
    setShowModal(true);
  };

  const handleEditModal = (category) => {
    setCurrentCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Gestión de Categorías 🔠
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddModal}
            sx={{ mb: 3 }}
          >
            Agregar Categoría
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.nombre}</TableCell>
                    <TableCell>{category.estado}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditModal(category)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle>
          {currentCategory ? "Editar Categoría" : "Agregar Categoría"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={currentCategory ? handleUpdateCategory : handleAddCategory}>
            <TextField
              fullWidth
              margin="normal"
              label="Nombre"
              name="nombre"
              defaultValue={currentCategory ? currentCategory.nombre : ""}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado_id"
                defaultValue={currentCategory ? currentCategory.estado_id : ""}
                required
              >
                {estados.map((estado) => (
                  <MenuItem key={estado.id} value={estado.id}>
                    {estado.descripcion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                {currentCategory ? "Guardar Cambios" : "Agregar Categoría"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CategoryManagement;

