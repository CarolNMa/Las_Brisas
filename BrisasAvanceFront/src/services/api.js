const API_URL = "http://192.168.80.42:8085/api/v1";

class ApiService {
  constructor() {
    console.log("ApiService inicializado");
  }

  setToken(token) {
    localStorage.setItem("brisas:token", token);
  }

  getAuthHeaders() {
    const token = localStorage.getItem("brisas:token");
    console.log("🔑 Token usado en request:", token);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
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

  // SOLICITUDES (Applications)

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
    return this.request("/attendance/", {
      method: "POST",
      body: JSON.stringify({ ...attendanceData, id: id }),
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

  // ==================================================
  // 📚 INDUCCIONES
  // ==================================================

  // ---- Induction (general) ----
  async getAllInductions() {
    return this.request("/induction/");
  }

  async getInductionById(id) {
    return this.request(`/induction/${id}`);
  }

  async createInduction(data) {
    return this.request("/induction/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateInduction(id, data) {
    return this.request(`/induction/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteInduction(id) {
    return this.request(`/induction/${id}`, { method: "DELETE" });
  }

  // ---- Módulos de inducción ----
  async getModulesByInduction(inductionId) {
    return this.request(`/module-induction/induction/${inductionId}`);
  }


  async createModule(data) {
    return this.request("/module-induction", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateModule(id, data) {
    return this.request(`/module-induction/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteModule(id) {
    return this.request(`/module-induction/${id}`, { method: "DELETE" });
  }

  // ---- Preguntas ----
  async getQuestionsByModule(moduleId) {
    return this.request(`/question/${moduleId}`);
  }

  async createQuestion(data) {
    return this.request("/question/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateQuestion(id, data) {
    return this.request(`/question/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteQuestion(id) {
    return this.request(`/question/${id}`, { method: "DELETE" });
  }

  // ---- Respuestas ----
  async getAnswersByQuestion(questionId) {
    return this.request(`/answers/${questionId}`);
  }

  async createAnswer(data) {
    return this.request("/answers/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAnswer(id, data) {
    return this.request(`/answers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAnswer(id) {
    return this.request(`/answers/${id}`, { method: "DELETE" });
  }

  // ---- Asignación de inducciones a empleados ----
  async getAllInductionAssignments() {
    return this.request("/induction-employee/");
  }

  async assignInduction(data) {
    return this.request("/induction-employee/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteInductionAssignment(id) {
    return this.request(`/induction-employee/${id}`, { method: "DELETE" });
  }

  // EMPLEADO: ver mis inducciones asignadas
  async getMyInductions() {
    return this.request("/induction-employee/me");
  }



  //  CAPACITACIONES

  async getAllTrainings() {
    return this.request("/training/all");
  }

  async createTraining(data) {
    return this.request("/training/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTraining(id, data) {
    return this.request(`/training/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTraining(id) {
    return this.request(`/training/${id}`, { method: "DELETE" });
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
    return this.request("/employees/", {
      method: "POST",
      body: JSON.stringify({ ...employeeData, id: id }),
    });
  }

  async deleteEmployee(id) {
    return this.request(`/employees/${id}`, { method: "DELETE" });
  }
}

export default new ApiService();
