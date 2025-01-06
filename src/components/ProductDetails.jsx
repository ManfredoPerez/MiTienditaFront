import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  CardMedia,
} from "@mui/material";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/productos/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error al obtener el producto:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : product ? (
        <Grid container spacing={4}>
          {/* Columna de la imagen */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 2,
                "&:hover img": {
                  transform: "scale(1.1)", // Zoom al pasar el ratón
                },
              }}
            >
              <CardMedia
                component="img"
                image={product.imagen}
                alt={product.nombre}
                sx={{
                  transition: "transform 0.3s ease-in-out", // Animación suave
                  objectFit: "cover",
                  maxHeight: "500px",
                }}
              />
            </Box>
            {/* Galería de miniaturas */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                overflowX: "auto",
              }}
            >
              {/* Aquí podrías cargar imágenes adicionales si las tuvieras */}
              <img
                src={product.imagen}
                alt={product.nombre}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "2px solid #ccc",
                }}
              />
            </Box>
          </Grid>

          {/* Columna de información */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h1" gutterBottom>
              Por {product.categoria}
            </Typography>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {product.nombre}
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              sx={{ textDecoration: "line-through", mr: 2 }}
            >
              Q{(product.precio * 1.5).toFixed(2)} {/* Precio original */}
            </Typography>
            <Typography variant="h6" color="error" fontWeight="bold">
              Q{product.precio.toFixed(2)} {/* Precio con descuento */}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              {product.descripcion}
            </Typography>

            {/* Controles de cantidad y botones */}
            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                size="large"
                sx={{
                  textTransform: "none",
                  px: 4,
                  borderRadius: 2,
                }}
                onClick={() => navigate("/home-client")}
              >
                Regresar
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{
                  textTransform: "none",
                  px: 4,
                  borderRadius: 2,
                }}
              >
                Comprar ahora
              </Button>
            </Box>

            {/* Botón adicional */}
            <Button
              variant="text"
              color="warning"
              sx={{ mt: 2, textTransform: "none" }}
            >
              Agregar a la lista de deseos
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6" color="error">
          Producto no encontrado.
        </Typography>
      )}
    </Container>
  );
};

export default ProductDetails;
