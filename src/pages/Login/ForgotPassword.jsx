import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import toast from "react-hot-toast";

const schema = yup.object({
  correo: yup.string().email("Correo inválido").required("Correo requerido"),
});

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/recuperar", data);
      toast.success("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
      navigate("/");
    } catch (err) {
      toast.error("Error al enviar el correo de recuperación.");
      console.error(err);
    }
  };

  return (
    <div className="auth-container-recuperar">
      <div className="auth-card-recuperar">
        <div className="auth-form-container">
          <h2 className="h3 mb-4">Recuperar Contraseña</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Correo Electrónico"
                {...register("correo")}
              />
              {errors.correo && <p className="text-danger small">{errors.correo.message}</p>}
            </div>
            <button type="submit" className="btn btn-auth">
              Enviar Correo de Recuperación
            </button>
          </form>
          <p className="text-center mt-3">
            <button className="btn btn-link auth-link" onClick={() => navigate("/")}>
              Volver al Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
