import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import logo from '../../img/LogoMiTiendita.png';
import { Snackbar, Alert } from "@mui/material";
import toast from "react-hot-toast";

const schema = yup.object({
  correo: yup.string().email("Correo inválido").required("Correo requerido"),
  contrasena: yup.string().required("Contraseña requerida"),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Estados para manejar las alertas
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  // Función para mostrar alertas
  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenAlert(true);
  };

  // Función para cerrar la alerta
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      localStorage.setItem("token", response.data.token);
      const userRole = response.data.rol === 1 ? "client" : "operator";
      localStorage.setItem("role", userRole);

      login(userRole);

      // Mostrar alerta de éxito
      // showAlert(`¡Inicio de sesión exitoso! Eres un ${userRole}.`, "success");
      toast.success(`¡Inicio de sesión exitoso! Eres un ${userRole}.`);

      // Esperar un momento antes de redirigir
      setTimeout(() => {
        if (response.data.rol === 1) {
          navigate("/home-client");
        } else if (response.data.rol === 2) {
          navigate("/home-operator");
        } else {
          // showAlert("Rol de usuario no reconocido", "error");
          toast.error("Rol de usuario no reconocido");
        }
      }, 1500);

    } catch (err) {
      // Mostrar alerta de error
      // showAlert(
      //   err.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales.",
      //   "error"
      // );
      toast.error(
        err.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="aut-left-title">
              <h1 className="lead">MiTiendita productos extraordinarios</h1>
              <p className="lead">¡Una manera diferente de comprar!</p>
            </div>
            <div className="mt-auto">
              <p className="mb-2">¿No tienes una cuenta?</p>
              <button 
                className="btn btn-outline-light px-4"
                onClick={() => navigate("/register")}
              >
                Registrate
              </button>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-container">
            <img src={logo} alt="Logo" className="auth-logo" />
            <h2 className="h3 mb-4">¡Bienvenido de nuevo!</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <input 
                  className="form-control" 
                  placeholder="Correo"
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
              <button type="submit" className="btn btn-auth">
                Iniciar Sesión →
              </button>
              <p className="text-center mt-3">
                <button
                  className="btn btn-link auth-link"
                  onClick={() => navigate("/forgot-password")}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Snackbar para mostrar alertas */}
      <Snackbar 
        open={openAlert} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;