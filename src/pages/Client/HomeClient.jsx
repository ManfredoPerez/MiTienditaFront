import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard";
import {
  Container,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Box,
  TextField,
  InputAdornment,
  Fade,
  Button,
} from "@mui/material";
import { Search } from 'lucide-react';

const HomeClient = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (products.length > 0) {
        const randomIndex = Math.floor(Math.random() * products.length);
        setFeaturedProduct(products[randomIndex]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/productos");
      const activeProducts = response.data.filter(
        (product) => product.estado === "Activo"
      );
      setProducts(activeProducts);
      setFilteredProducts(activeProducts);
      if (activeProducts.length > 0) {
        const randomIndex = Math.floor(Math.random() * activeProducts.length);
        setFeaturedProduct(activeProducts[randomIndex]);
      }
    } catch (err) {
      console.error(err);
      setError("Error al cargar los productos. Verifica tu token de autenticación.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categorias");
      setCategories(response.data);
    } catch (err) {
      console.error("Error al cargar las categorías:", err);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(term, selectedCategory);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    filterProducts(searchTerm, category === selectedCategory ? "" : category);
  };

  const filterProducts = (term, category) => {
    const filtered = products.filter((product) => {
      const matchesCategory = category ? product.categoria === category : true;
      const matchesSearch = term ? product.nombre.toLowerCase().includes(term) : true;
      return matchesCategory && matchesSearch;
    });
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = currentCart.findIndex((item) => item.id === product.id);

    if (existingProductIndex > -1) {
      currentCart[existingProductIndex].quantity =
        (currentCart[existingProductIndex].quantity || 1) + 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("storage"));

    toast.success(`${product.nombre} agregado al carrito`, {
      position: "top-right",
      duration: 2000,
    });
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        align="center"
        color="primary"
        fontWeight="bold"
        gutterBottom
        sx={{ mb: 4 }}
      >
        Descubre Nuestros Productos
      </Typography>

      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

      {/* Categories and Search Container */}
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 2, 
          my: 4,
          position: 'relative',
          width: '100%'
        }}
      >
        {/* Categories */}
        <Box 
          sx={{ 
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              animation: 'scroll 30s linear infinite',
              '&:hover': {
                animationPlayState: 'paused'
              },
              '@keyframes scroll': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' }
              }
            }}
          >
            <Box
              onClick={() => handleCategorySelect("")}
              sx={{
                minWidth: 'auto',
                px: 3,
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: selectedCategory === "" ? 'primary.main' : '#e0e0e0',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: selectedCategory === "" ? 'primary.main' : 'text.secondary',
                fontWeight: selectedCategory === "" ? 'bold' : 'normal',
                bgcolor: selectedCategory === "" ? 'primary.light' : 'transparent',
                boxShadow: selectedCategory === "" ? 3 : 0,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              Todos
            </Box>

            {categories.map((category) => (
              <Box
                key={category.id}
                onClick={() => handleCategorySelect(category.nombre)}
                sx={{
                  minWidth: 'auto',
                  px: 3,
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: selectedCategory === category.nombre ? 'primary.main' : '#e0e0e0',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  color: selectedCategory === category.nombre ? 'primary.main' : 'text.secondary',
                  fontWeight: selectedCategory === category.nombre ? 'bold' : 'normal',
                  bgcolor: selectedCategory === category.nombre ? 'primary.light' : 'transparent',
                  boxShadow: selectedCategory === category.nombre ? 3 : 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {category.nombre}
              </Box>
            ))}

            {/* Duplicate set for infinite scroll */}
            {categories.map((category) => (
              <Box
                key={`${category.id}-duplicate`}
                onClick={() => handleCategorySelect(category.nombre)}
                sx={{
                  minWidth: 'auto',
                  px: 3,
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: selectedCategory === category.nombre ? 'primary.main' : '#e0e0e0',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  color: selectedCategory === category.nombre ? 'primary.main' : 'text.secondary',
                  fontWeight: selectedCategory === category.nombre ? 'bold' : 'normal',
                  bgcolor: selectedCategory === category.nombre ? 'primary.light' : 'transparent',
                  boxShadow: selectedCategory === category.nombre ? 3 : 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {category.nombre}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Search Bar */}
        <TextField
          label="Buscar productos"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '250px',
            '& .MuiOutlinedInput-root': {
              borderRadius: 50,
              height: '40px',
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Box>

      {/* Featured Product Section */}
      {featuredProduct && (
        <Box sx={{ 
          mb: 6,
          // width: '100%',  // Asegura que el contenedor externo tome todo el ancho disponible
          display: 'flex',
          justifyContent: 'center',
          // alignItems: 'center'
          }}>
          <Box
            sx={{
              position: "relative",
              textAlign: "center",
              borderRadius: "16px",
              overflow: "hidden",
              height: "300px",
              width: "80%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${featuredProduct.imagen})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(15px)",
                transform: "scale(1.2)",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${featuredProduct.imagen})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                zIndex: 1,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                textShadow: "2px 2px 6px rgba(0,0,0,0.8)",
                zIndex: 2,
                mb: 1,
              }}
            >
              {featuredProduct.nombre}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#fff",
                textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
                zIndex: 2,
                mb: 2,
              }}
            >
              {featuredProduct.descripcion}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              sx={{ borderRadius: "50px", px: 3, zIndex: 2 }}
              onClick={() => handleViewProduct(featuredProduct.id)}
            >
              Ver Producto
            </Button>
          </Box>
        </Box>
      )}

      {/* Products Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewProduct={handleViewProduct}
                  />
                </Grid>
              </Fade>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity="info">No hay productos disponibles.</Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default HomeClient;