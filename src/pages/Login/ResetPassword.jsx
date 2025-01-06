import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api"
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import toast from "react-hot-toast";

const schema = yup.object({
  contrasena: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("Contraseña requerida"),
});

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post(`/auth/reset-password/${token}`, data);
      toast.success("Contraseña restablecida correctamente.");
      navigate("/");
    } catch (err) {
      toast.error("Error al restablecer la contraseña.");
      console.error(err);
    }
  };

  return (
    <div className="auth-container-recuperar">
      <div className="auth-card-recuperar">
        <div className="auth-form-container">
          <h2 className="h3 mb-4">Restablecer Contraseña</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Nueva Contraseña"
                {...register("contrasena")}
              />
              {errors.contrasena && <p className="text-danger small">{errors.contrasena.message}</p>}
            </div>
            <button type="submit" className="btn btn-auth">
              Restablecer Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
