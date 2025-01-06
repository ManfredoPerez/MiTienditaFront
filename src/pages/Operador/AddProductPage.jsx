import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { useState, useEffect } from "react";
import ImageUpload from "../../components/ImageUpload";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  InputAdornment,
  Box,
} from "@mui/material";

const schema = yup.object({
  codigo: yup.string().required("Código requerido"),
  nombre: yup.string().required("Nombre requerido"),
  descripcion: yup.string(),
  precio: yup.number().required("Precio requerido").positive("El precio debe ser positivo"),
  stock: yup.number().required("Stock requerido").min(0, "El stock no puede ser negativo"),
  categoria_id: yup.string().required("Categoría requerida"),
  estado_id: yup.string().required("Estado requerido"),
  imagenUrl: yup.string().when('uploadMethod', {
    is: 'url',
    then: (schema) => schema.required("URL de imagen requerida").url("URL inválida"),
    otherwise: (schema) => schema.nullable()
  }),
  image: yup.mixed().when('uploadMethod', {
    is: (val) => val === 'file' || val === 'drop',
    then: (schema) => schema.required("Debes seleccionar una imagen"),
    otherwise: (schema) => schema.nullable()
  }),
});

const AddProductPage = ({ onSubmit, defaultValues }) => {
  const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...defaultValues,
      uploadMethod: 'url'
    },
  });

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const uploadMethod = watch('uploadMethod');

  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("/categorias");
        setCategorias(response.data);
      } catch (err) {
        console.error("Error al obtener categorías:", err);
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

    fetchCategorias();
    fetchEstados();
  }, []);

  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key !== 'image' && key !== 'imagenUrl' && key !== 'uploadMethod') {
          formData.append(key, data[key]);
        }
      });

      if (data.uploadMethod === 'url' && data.imagenUrl) {
        formData.append("imagen", data.imagenUrl);
      } else if (data.uploadMethod === 'drop' && image) {
        formData.append("imagen", image);
      } else if (data.uploadMethod === 'file' && data.image && data.image.length > 0) {
        formData.append("imagen", data.image[0]);
      } else {
        throw new Error('Debes seleccionar una imagen');
      }

      const response = await api.post("/productos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Producto guardado correctamente");
        reset();
        setImage(null);
        setPreviewUrl(null);
      } else {
        throw new Error('Error al guardar el producto');
      }
    } catch (err) {
      alert(err.message || "Error al guardar el producto");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Agregar Producto
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="codigo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Código"
                    error={!!errors.codigo}
                    helperText={errors.codigo?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre"
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Descripción"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="precio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Precio"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    error={!!errors.precio}
                    helperText={errors.precio?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Stock"
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="categoria_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Categoría"
                    error={!!errors.categoria_id}
                    helperText={errors.categoria_id?.message}
                  >
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="estado_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Estado"
                    error={!!errors.estado_id}
                    helperText={errors.estado_id?.message}
                  >
                    {estados.map((estado) => (
                      <MenuItem key={estado.id} value={estado.id}>
                        {estado.descripcion}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <ImageUpload 
                control={control}
                watch={watch}
                errors={errors}
                setValue={setValue}
                setPreviewUrl={setPreviewUrl}
                setImage={setImage}
              />
            </Grid>
            {previewUrl && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <img src={previewUrl} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%' }} />
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                Guardar Producto
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProductPage;


