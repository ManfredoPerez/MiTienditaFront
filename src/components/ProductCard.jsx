import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip,
  Rating
} from "@mui/material";
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onViewProduct }) => {
  return (
    <Card 
      sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        "&:hover": { 
          transform: "translateY(-10px)",
          boxShadow: 6
        },
        borderRadius: 2,
        overflow: "hidden"
      }}
      onClick={() => onViewProduct(product.id)}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={product.imagen}
          alt={product.nombre}
          sx={{ objectFit: "cover" }}
        />
        <Chip
          label={product.categoria}
          color="primary"
          size="small"
          sx={{ 
            position: "absolute", 
            top: 8, 
            right: 8,
            fontWeight: "bold",
            textTransform: "uppercase"
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2 }}>
        <Typography variant="h6" component="h3" noWrap sx={{ mb: 1 }}>
          {product.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.descripcion.length > 100 
            ? `${product.descripcion.substring(0, 100)}...` 
            : product.descripcion}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
          <Box>
            <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
              Q{product.precio.toFixed(2)}
            </Typography>
            <Chip 
              label={`Stock: ${product.stock}`} 
              color={product.stock > 10 ? "success" : "warning"}
              size="small"
            />
            {/* <Rating value={4.5} readOnly size="small" /> */}
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<ShoppingCart size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            sx={{
              borderRadius: 20,
              textTransform: "none",
              fontWeight: "bold"
            }}
          >
            Agregar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

