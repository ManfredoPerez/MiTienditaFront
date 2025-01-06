import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit, Delete, Search } from "@mui/icons-material";
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
  IconButton,
  Box,
  InputAdornment,
} from "@mui/material";
import api from "../../services/api";
import toast from "react-hot-toast";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [estados, setEstados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [image, setImage] = useState(null); // State to store selected image
  const productsPerPage = 7;

  useEffect(() => {
    fetchProducts();
    fetchEstados();
    fetchCategorias();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => 
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedProducts(filtered.slice(0, page * productsPerPage));
  }, [products, searchTerm, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/productos");
      setProducts(response.data);
      setDisplayedProducts(response.data.slice(0, productsPerPage));
    } catch (err) {
      console.error("Error al obtener productos:", err);
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

  const fetchCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await api.delete(`/productos/${id}`);
        toast.success("Producto eliminado correctamente");
        fetchProducts();
      } catch (err) {
        toast.error("Error al eliminar el producto");
        console.error(err);
      }
    }
  };

  const handleEditModal = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
    setImage(null); // Reset image when opening the edit modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setImage(null); // Reset image on close
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    // Verificar si se ha seleccionado una nueva imagen
    if (image) {
      data.append("imagen", image); // Agregar imagen seleccionada
    } else {
      // Si no se seleccionó una imagen, mantener la imagen original
      data.append("imagen", currentProduct?.imagen);
    }

    try {
      const response = await api.put(`/productos/${currentProduct.id}`, data); // Enviar FormData
      console.log("Respuesta de la actualización: ", response.data); // Verificar la respuesta
      toast.success("Producto actualizado correctamente");
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      console.error("Error al actualizar producto: ", err.response ? err.response.data : err.message);
      toast.error("Error al actualizar producto");
    }
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected image
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}> 
        Productos 
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          component={Link}
          to="/add-product"
          variant="contained"
          color="primary"
        >
          Agregar Nuevo Producto
        </Button>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Buscar productos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.codigo}</TableCell>
                    <TableCell>{product.nombre}</TableCell>
                    <TableCell>
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    </TableCell>
                    <TableCell>Q{product.precio.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.estado}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditModal(product)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteProduct(product.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {displayedProducts.length < products.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="outlined" onClick={handleLoadMore}>
                Cargar Más
              </Button>
            </Box>
          )}
        </>
      )}

      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdateProduct}>
            <TextField
              fullWidth
              margin="normal"
              label="Código"
              name="codigo"
              defaultValue={currentProduct?.codigo}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Nombre"
              name="nombre"
              defaultValue={currentProduct?.nombre}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Descripción"
              name="descripcion"
              multiline
              rows={3}
              defaultValue={currentProduct?.descripcion}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Precio"
              name="precio"
              type="number"
              inputProps={{ step: "0.01" }}
              defaultValue={currentProduct?.precio}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Stock"
              name="stock"
              type="number"
              defaultValue={currentProduct?.stock}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Categoría</InputLabel>
              <Select
                name="categoria_id"
                defaultValue={currentProduct?.categoria_id}
                required
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado_id"
                defaultValue={currentProduct?.estado_id}
                required
              >
                {estados.map((estado) => (
                  <MenuItem key={estado.id} value={estado.id}>
                    {estado.descripcion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Imagen */}
            <TextField
              fullWidth
              margin="normal"
              label="Imagen"
              type="file"
              onChange={handleImageChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <DialogActions>
              <Button onClick={handleCloseModal}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                Guardar Cambios
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ProductsPage;
