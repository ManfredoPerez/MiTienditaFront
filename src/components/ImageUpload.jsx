import React, { useEffect } from 'react';
import { 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  TextField, 
  Button, 
  Box, 
  Typography,
  InputAdornment,
} from '@mui/material';
import { Controller } from 'react-hook-form';

const ImageUpload = ({ control, watch, errors, setValue, setPreviewUrl, setImage }) => {
  const uploadMethod = watch('uploadMethod');
  const imagenUrl = watch('imagenUrl');
  const image = watch('image');

  useEffect(() => {
    if (uploadMethod === 'url' && imagenUrl) {
      setPreviewUrl(imagenUrl);
    } else if (uploadMethod === 'file' && image && image.length > 0) {
      const file = image[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (uploadMethod === 'drop' && image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setPreviewUrl(null);
    }
  }, [uploadMethod, imagenUrl, image, setPreviewUrl]);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setImage(droppedFile);
    setValue('uploadMethod', 'drop');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(droppedFile);
  };

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend">Imagen del Producto</FormLabel>
      <Controller
        name="uploadMethod"
        control={control}
        render={({ field }) => (
          <RadioGroup {...field} row>
            <FormControlLabel value="url" control={<Radio />} label="Subir por URL" />
            <FormControlLabel value="file" control={<Radio />} label="Subir archivo" />
          </RadioGroup>
        )}
      />

      {uploadMethod === 'url' && (
        <Controller
          name="imagenUrl"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Ingrese la URL de la imagen"
              error={!!errors.imagenUrl}
              helperText={errors.imagenUrl?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => setValue('imagenUrl', '')}>
                      Limpiar
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      )}

      {uploadMethod === 'file' && (
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <TextField
              {...field}
              type="file"
              fullWidth
              InputProps={{
                inputProps: { accept: "image/*" },
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => {
                        setValue('image', null);
                        setPreviewUrl(null);
                      }}
                    >
                      Limpiar
                    </Button>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                onChange(e.target.files);
              }}
              error={!!errors.image}
              helperText={errors.image?.message}
            />
          )}
        />
      )}

      <Box
        sx={{
          border: '1px dashed grey',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          mt: 2,
          cursor: 'pointer'
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Typography>
          {uploadMethod === 'drop' && image
            ? `Imagen seleccionada: ${image.name}`
            : 'Arrastra y suelta una imagen aquí o selecciona un método arriba'}
        </Typography>
      </Box>

      {errors.image && (
        <Typography color="error" variant="caption">
          {errors.image.message}
        </Typography>
      )}
    </FormControl>
  );
};

export default ImageUpload;

