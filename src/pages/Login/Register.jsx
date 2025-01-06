import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import logo from '../../img/LogoMiTiendita.png';
import { toast } from 'react-hot-toast';

const schema = yup.object({
  nombre: yup.string().required("Nombre requerido"),
  apellido: yup.string().required("Apellido requerido"),
  correo: yup.string().email("Correo inválido").required("Correo requerido"),
  contrasena: yup.string().required("Contraseña requerida"),
  telefono: yup.string().matches(/^\d{8}$/, "Teléfono inválido"),
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const userData = {
      ...data,
      rol_id: 1,      // rol_id 1 para Cliente
      estado_id: 1,   // estado_id 1 para Activo
    };
  
    console.log("Datos enviados:", userData);
  
    try {
      const response = await api.post("/usuarios", userData);
      toast.success("Usuario registrado exitosamente!");
      navigate("/");
    } catch (err) {
      console.error("Error al registrarse:", err.response ? err.response.data : err.message);
      // alert(err.response ? err.response.data.error : "Error al registrarse");
      toast.error(err.response ? err.response.data.error : "No se pudo registrar, ocurrió un error.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-left-content">
            <div>
              <h1>Crompra productos extraordinarios</h1>
              <p className="lead">¡Adopta la paz de la naturaleza!</p>
            </div>
            <div className="mt-auto">
              <p className="mb-2">¿Ya tienes una cuenta?</p>
              <button 
                className="btn btn-outline-light px-4"
                onClick={() => navigate("/")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-container">
            <img src={logo} alt="Logo" className="auth-logo" />
            <h2 className="h3 mb-4">Registrate Ahora</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <input 
                  className="form-control" 
                  placeholder="Nombre"
                  {...register("nombre")} 
                />
                {errors.nombre && <p className="text-danger small">{errors.nombre.message}</p>}
              </div>
              <div className="mb-3">
                <input 
                  className="form-control" 
                  placeholder="Apellido"
                  {...register("apellido")} 
                />
                {errors.apellido && <p className="text-danger small">{errors.apellido.message}</p>}
              </div>
              <div className="mb-3">
                <input 
                  className="form-control" 
                  placeholder="Correo Electrónico"
                  {...register("correo")} 
                />
                {errors.correo && <p className="text-danger small">{errors.correo.message}</p>}
              </div>
              <div className="mb-3">
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Contraseña"
                  {...register("contrasena")} 
                />
                {errors.contrasena && <p className="text-danger small">{errors.contrasena.message}</p>}
              </div>
              <div className="mb-3">
                <input 
                  className="form-control" 
                  placeholder="Teléfono"
                  {...register("telefono")} 
                />
                {errors.telefono && <p className="text-danger small">{errors.telefono.message}</p>}
              </div>
              <button type="submit" className="btn btn-auth">
                Registrarse →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

