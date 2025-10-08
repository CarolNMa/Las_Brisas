const API_URL = "http://localhost:8085/api/v1";

class ApiService {
  constructor() {
    console.log("ApiService inicializado");
  }

  setToken(token) {
    localStorage.setItem("brisas:token", token);
  }

  getAuthHeaders() {
    const token = localStorage.getItem("brisas:token");
    console.log("Token usado en request:", token);
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    console.log("Request:", url, config);

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        console.error("Error HTTP:", response.status);
        const errorText = await response.text().catch(() => "Error desconocido");
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          return await response.json();
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          throw new Error("La respuesta del servidor no es un JSON válido");
        }
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // AUTENTICACIÓN Y RESET DE CONTRASEÑA
  async forgotPassword(email) {
    return this.request("/password/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyCode(email, code) {
    return this.request("/password/verify", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  }

  async resetPassword(email, code, newPassword) {
    return this.request("/password/reset", {
      method: "POST",
      body: JSON.stringify({ email, code, newPassword }),
    });
  }

  // PERFIL DEL EMPLEADO
  async getMyProfile() {
    return this.request("/employees/me");
  }

  async updateMyProfile(data) {
    return this.request("/employees/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getMyContract() {
    return this.request("/contracts/me");
  }

  async getMyResumeFile() {
    const url = `${API_URL}/resumes/me/download`;
    const token = localStorage.getItem("brisas:token");

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al obtener archivo");
    return await response.blob();
  }

  async downloadMyResume() {
    const blob = await this.getMyResumeFile();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "hoja_de_vida.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  // SOLICITUDES

  // Empleado
  async getMyApplications() {
    return this.request("/applications/me");
  }

  async createApplication(applicationData, isFormData = false) {
    const token = localStorage.getItem("brisas:token");

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: applicationData,
    };

    if (!isFormData) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(applicationData);
    }

    const response = await fetch(`${API_URL}/applications/`, options);
    if (!response.ok) {
      let errorMessage = "Error al crear solicitud";
      try {
        const errorData = await response.text();
        if (errorData) errorMessage = errorData;
      } catch (e) {
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Admin
  async getAllApplications() {
    return this.request("/applications/all");
  }

  async approveApplication(id) {
    return this.request(`/applications/${id}/approve?approved=true`, { method: "PUT" });
  }

  async rejectApplication(id) {
    return this.request(`/applications/${id}/approve?approved=false`, { method: "PUT" });
  }


  async deleteApplication(id) {
    return this.request(`/applications/${id}`, { method: "DELETE" });
  }

  async downloadApplicationFile(filename) {
    const token = localStorage.getItem("brisas:token");
    const response = await fetch(`${API_URL}/applications/download/${filename}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("No se pudo descargar el archivo de la solicitud");
    return await response.blob();
  }

  async downloadApplication(filename) {
    const blob = await this.downloadApplicationFile(filename);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  }




  //  TIPOS DE SOLICITUD
  async getAllApplicationTypes() {
    return this.request("/application-type/all");
  }

  async createApplicationType(typeData) {
    return this.request("/application-type/", {
      method: "POST",
      body: JSON.stringify(typeData),
    });
  }

  async updateApplicationType(id, typeData) {
    return this.request("/application-type/", {
      method: "POST",
      body: JSON.stringify({ ...typeData, id: id }),
    });
  }

  async deleteApplicationType(id) {
    return this.request(`/application-type/${id}`, {
      method: "DELETE",
    });
  }

  //  ASISTENCIAS
  async getMyAttendance() {
    return this.request("/attendance/me");
  }

  async registerAttendance(type) {
    return this.request("/attendance/register", {
      method: "POST",
      body: JSON.stringify({ type }),
    });
  }

  async getAllAttendance() {
    return this.request("/attendance/all");
  }

  async createAttendance(attendanceData) {
    return this.request("/attendance/", {
      method: "POST",
      body: JSON.stringify(attendanceData),
    });
  }

  async updateAttendance(id, attendanceData) {
    return this.request(`/attendance/${id}`, {
      method: "PUT",
      body: JSON.stringify(attendanceData),
    });
  }

  async deleteAttendance(id) {
    return this.request(`/attendance/${id}`, { method: "DELETE" });
  }

  // CONTRATOS

  async getAllContracts() {
    return this.request("/contracts/all");
  }

  async createContract(contractData) {
    const token = localStorage.getItem("brisas:token");
    const formData = new FormData();

    formData.append("employeeId", contractData.employee);
    formData.append("dateStart", contractData.dateStart);
    formData.append("dateEnd", contractData.dateEnd);
    formData.append("type", contractData.type);
    formData.append("status", contractData.status);

    if (contractData.document) {
      formData.append("document", contractData.document);
    }

    const response = await fetch(`${API_URL}/contracts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) throw new Error(`Error al crear contrato: ${response.status}`);
    return response.json();
  }

  async downloadContract(filename) {
    const token = localStorage.getItem("brisas:token");
    const response = await fetch(`${API_URL}/contracts/download/${filename}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("No se pudo descargar el contrato");
    return await response.blob();
  }

  async updateContract(id, contractData) {
    const token = localStorage.getItem("brisas:token");
    const formData = new FormData();

    formData.append("employeeId", contractData.employee);
    formData.append("dateStart", contractData.dateStart);
    formData.append("dateEnd", contractData.dateEnd);
    formData.append("type", contractData.type);
    formData.append("status", contractData.status);

    if (contractData.document) {
      formData.append("document", contractData.document);
    }

    const response = await fetch(`${API_URL}/contracts/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) throw new Error(`Error al actualizar contrato: ${response.status}`);
    return response.json();
  }

  async deleteContract(id) {
    return this.request(`/contracts/${id}`, { method: "DELETE" });
  }

  // UBICACIONES
  async getAllLocations() {
    return this.request("/location/all");
  }

  async createLocation(locationData) {
    return this.request("/location/", {
      method: "POST",
      body: JSON.stringify(locationData),
    });
  }

  async updateLocation(id, locationData) {
    return this.request("/location/", {
      method: "POST",
      body: JSON.stringify({ ...locationData, id: id }),
    });
  }

  async deleteLocation(id) {
    return this.request(`/location/${id}`, { method: "DELETE" });
  }

  // ÁREAS
  async getAllAreas() {
    return this.request("/areas/all");
  }

  async createArea(areaData) {
    return this.request("/areas/", {
      method: "POST",
      body: JSON.stringify(areaData),
    });
  }

  async updateArea(id, areaData) {
    return this.request("/areas/", {
      method: "POST",
      body: JSON.stringify({ ...areaData, id: id }),
    });
  }

  async deleteArea(id) {
    return this.request(`/areas/${id}`, { method: "DELETE" });
  }

  // PUESTOS / POSICIONES

  async getAllPositions() {
    return this.request("/positions/all");
  }

  async createPosition(positionData) {
    return this.request("/positions/", {
      method: "POST",
      body: JSON.stringify(positionData),
    });
  }

  async updatePosition(id, positionData) {
    return this.request("/positions/", {
      method: "POST",
      body: JSON.stringify({ ...positionData, id: id }),
    });
  }

  async deletePosition(id) {
    return this.request(`/positions/${id}`, { method: "DELETE" });
  }

  // USUARIOS Y ROLES

  async getAllUsers() {
    return this.request("/user/all");
  }

  async registerUser(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request("/user/", {
      method: "POST",
      body: JSON.stringify({ ...userData, idUser: id }),
    });
  }

  async deleteUser(id) {
    return this.request(`/user/${id}`, { method: "DELETE" });
  }

  async getAllRoles() {
    return this.request("/role/all");
  }

  async createRole(roleData) {
    return this.request("/role/", {
      method: "POST",
      body: JSON.stringify(roleData),
    });
  }

  async updateRole(id, roleData) {
    return this.request("/role/", {
      method: "POST",
      body: JSON.stringify({ ...roleData, id: id }),
    });
  }

  async deleteRole(id) {
    return this.request(`/role/${id}`, { method: "DELETE" });
  }

  // INDUCCIONES
  getAllInductions() {
    return this.request("/inductions", { method: "GET" });
  }

  getInductionById(id) {
    return this.request(`/inductions/${id}`, { method: "GET" });
  }

  saveInduction(data) {
    return this.request("/inductions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  deleteInduction(id) {
    return this.request(`/inductions/${id}`, { method: "DELETE" });
  }

  // MÓDULOS
  getModulesByInduction(inductionId) {
    return this.request(`/modules/induction/${inductionId}`, { method: "GET" });
  }

  getModuleById(id) {
    return this.request(`/modules/${id}`, { method: "GET" });
  }

  async getModuleFull(id) {
    return this.request(`/modules/${id}`, { method: "GET" });
  }


  saveModule(data) {
    return this.request("/modules", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateModule(id, data) {
    return this.request(`/modules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteModule(id) {
    return this.request(`/modules/${id}`, { method: "DELETE" });
  }

  // PREGUNTAS
  getQuestionsByModule(moduleId) {
    return this.request(`/questions/module/${moduleId}`, { method: "GET" });
  }

  saveQuestion(data) {
    return this.request("/questions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  deleteQuestion(id) {
    return this.request(`/questions/${id}`, { method: "DELETE" });
  }

  // RESPUESTAS
  async getAnswersByQuestion(questionId) {
    return this.request(`/answers/question/${questionId}`);
  }

  async saveAnswer(data) {
    return this.request("/answers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteAnswer(id) {
    return this.request(`/answers/${id}`, { method: "DELETE" });
  }

  // ASIGNACIONES

  getAllAssignments() {
    return this.request("/induction-employee", { method: "GET" });
  }

  getMyAssignments() {
    return this.request("/induction-employee/me", { method: "GET" });
  }

  assignInduction(data) {
    return this.request("/induction-employee", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  completeAssignment(id, points) {
    return this.request(`/induction-employee/${id}/complete?points=${points}`, {
      method: "PUT",
    });
  }

  deleteAssignment(id) {
    return this.request(`/induction-employee/${id}`, { method: "DELETE" });
  }

  //  CAPACITACIONES


  async getAllTrainings() {
    return this.request("/inductions/capacitaciones");
  }

  async createTraining(data) {
    return this.request("/inductions/capacitaciones", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTraining(id, data) {
    return this.request("/inductions/capacitaciones", {
      method: "POST",
      body: JSON.stringify({ ...data, id }),
    });
  }

  async deleteTraining(id) {
    return this.request(`/inductions/${id}`, { method: "DELETE" });
  }



  // EMPLEADOS

  async getAllEmployees() {
    return this.request("/employees/all");
  }

  async getEmployeeById(id) {
    return this.request(`/employees/${id}`);
  }

  async createEmployee(employeeData) {
    return this.request("/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
    });
  }

  async updateEmployee(id, employeeData) {
    return this.request(`/employees/${id}`), ({
      method: "POST",
      body: JSON.stringify({ ...employeeData, id: id }),
    });
  }

  async deleteEmployee(id) {
    return this.request(`/employees/${id}`, { method: "DELETE" });
  }

  // HOJAS DE VIDA
  async getAllResumes() {
    return this.request("/resumes");
  }

  async getResumeById(id) {
    return this.request(`/resumes/${id}`);
  }

  async uploadResume(formData) {
    const token = localStorage.getItem("brisas:token");

    const response = await fetch(`${API_URL}/resumes/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error al subir hoja de vida: ${response.status}`);
    }
    return response.json();
  }

  async deleteResume(id) {
    return this.request(`/resumes/${id}`, { method: "DELETE" });
  }

  async updateResume(id, formData) {
    const token = localStorage.getItem("brisas:token");

    const response = await fetch(`${API_URL}/resumes/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar hoja de vida: ${response.status}`);
    }
    return response.json();
  }


  async downloadResumeFile(id) {
    const token = localStorage.getItem("brisas:token");
    const response = await fetch(`${API_URL}/resumes/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("No se pudo descargar la hoja de vida");
    return await response.blob();
  }

  async downloadResume(id) {
    const blob = await this.downloadResumeFile(id);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `resume_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  // CERTIFICADOS LABORALES

  async generateCertificateByEmployee(employeeId) {
    const token = localStorage.getItem("brisas:token");

    const response = await fetch(`${API_URL}/certificates/employee/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("No se pudo generar el certificado");
    return await response.blob();
  }

  async downloadCertificate(blob, filename = "certificado.pdf") {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }


  // EMPLEADO - CARGO
  async getAllEmployeePosts() {
    return this.request("/employee-post");
  }
  async createEmployeePost(data) {
    return this.request("/employee-post", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async updateEmployeePost(id, data) {
    return this.request(`/employee-post/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
  async deleteEmployeePost(id) {
    return this.request(`/employee-post/${id}`, { method: "DELETE" });
  }

  // EMPLEADO - ÁREAS
  async getAllEmployeeAreas() {
    return this.request("/employee-areas");
  }

  async createEmployeeArea(data) {
    return this.request("/employee-areas", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteEmployeeArea(id) {
    return this.request(`/employee-areas/${id}`, { method: "DELETE" });
  }

  // EMPLEADO - UBICACIONES

  async getAllEmployeeLocations() {
    return this.request("/employee-locations");
  }
  async createEmployeeLocation(data) {
    return this.request("/employee-locations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async deleteEmployeeLocation(id) {
    return this.request(`/employee-locations/${id}`, { method: "DELETE" });
  }

  // EMPLEADO - HORAS
  async getAllEmployeeSchedules() {
    return this.request("/employee-schedules");
  }
  async createEmployeeSchedule(data) {
    return this.request("/employee-schedules", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async deleteEmployeeSchedule(id) {
    return this.request(`/employee-schedules/${id}`, { method: "DELETE" });
  }

  // HORARIO
  async getAllSchedules() {
    return this.request(`/schedules`);
  }

  async getScheduleById(id) {
    return this.request(`/schedules/${id}`);
  }

  async createSchedule(data) {
    return this.request(`/schedules`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSchedule(id, data) {
    return this.request(`/schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteSchedule(id) {
    return this.request(`/schedules/${id}`, { method: "DELETE" });
  }

}

export default new ApiService();
