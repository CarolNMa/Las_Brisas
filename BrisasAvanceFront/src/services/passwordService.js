import api from './api.js';

export const forgotPassword = async (email) => {
  try {
    const response = await api.forgotPassword(email);
    return response.message || "Código enviado a tu email";
  } catch (error) {
    throw new Error(error.message || "Error al enviar código");
  }
};

export const verifyCode = async (email, code) => {
  try {
    const response = await api.verifyCode(email, code);
    return response.message || "Código verificado correctamente";
  } catch (error) {
    throw new Error(error.message || "Error en la verificación");
  }
};

export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await api.resetPassword(email, code, newPassword);
    return response.message || "Contraseña cambiada exitosamente";
  } catch (error) {
    throw new Error(error.message || "Error al cambiar contraseña");
  }
};