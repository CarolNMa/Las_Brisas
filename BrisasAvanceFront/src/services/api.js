const API_URL = "http://192.168.100.114:8085/api/v1";

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
      headers: { Authorization: `Bearer ${token}` }
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

  async getMyApplications() {
    return this.request("/applications/me");
  }

  async createApplication(applicationData) {
    return this.request("/applications", {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
  }

  async getMyAttendance() {
    return this.request("/attendance/me");
  }

  async registerAttendance(type) {
    return this.request("/attendance/register", {
      method: "POST",
      body: JSON.stringify({ type }),
    });
  }

  async getMyInductions() {
    return this.request("/induction-employee/");
  }

  // Admin
  async getAllEmployees() {
    return this.request("/employees/all");
  }

  async getAllAreas() {
    return this.request("/areas/all");
  }

  async getAllContracts() {
    return this.request("/contracts/all");
  }

  // Asistencias
  async getAllAttendance() {
    return this.request("/attendance/all");
  }

  // Solicitudes
  async getAllApplications() {
    return this.request("/applications/all");
  }

  // Tipos de solicitud
  async getAllApplicationTypes() {
    return this.request("/application-type/all");
  }

  // Usuarios
  async getAllUsers() {
    return this.request("/user/all");
  }

  async registerUser(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        rol: userData.rol,
      }),
    });
  }



  async updateUser(id, userData) {
    return this.request("/user/", {
      method: "POST",
      body: JSON.stringify({ ...userData, idUser: id }),
    });
  }

  async deleteUser(id) {
    return this.request(`/user/${id}`, {
      method: "DELETE",
    });
  }

  // Roles
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
    return this.request(`/role/${id}`, {
      method: "DELETE",
    });
  }

  // Posiciones
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
    return this.request(`/positions/${id}`, {
      method: "DELETE",
    });
  }

  // Ubicaciones
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
    return this.request(`/location/${id}`, {
      method: "DELETE",
    });
  }

  // Áreas
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
    return this.request(`/areas/${id}`, {
      method: "DELETE",
    });
  }

  // Solicitudes
  async createApplication(applicationData) {
    return this.request("/applications/", {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
  }

  async updateApplication(id, applicationData) {
    return this.request("/applications/", {
      method: "POST",
      body: JSON.stringify({ ...applicationData, id: id }),
    });
  }

  async deleteApplication(id) {
    return this.request(`/applications/${id}`, {
      method: "DELETE",
    });
  }

  // Tipos de solicitud
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

  // Contratos
  async createContract(contractData) {
    return this.request("/contracts/", {
      method: "POST",
      body: JSON.stringify(contractData),
    });
  }

  async updateContract(id, contractData) {
    return this.request("/contracts/", {
      method: "POST",
      body: JSON.stringify({ ...contractData, id: id }),
    });
  }

  async deleteContract(id) {
    return this.request(`/contracts/${id}`, {
      method: "DELETE",
    });
  }

  // Asistencias
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
    return this.request(`/attendance/${id}`, {
      method: "DELETE",
    });
  }

  async getAllEmployeePosts() {
    return this.request("/employee-post/");
  }

  async createEmployeePost(dto) {
    return this.request("/employee-post/", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  async deleteEmployeePost(id) {
    return this.request(`/employee-post/${id}`, {
      method: "DELETE",
    });
  }



  // Entrenamientos (Inductions)
  async getAllTrainings() {
    return this.request("/induction/all");
  }

  async createTraining(trainingData) {
    return this.request("/induction/", {
      method: "POST",
      body: JSON.stringify(trainingData),
    });
  }

  async updateTraining(id, trainingData) {
    return this.request("/induction/", {
      method: "POST",
      body: JSON.stringify({ ...trainingData, id: id }),
    });
  }

  async deleteTraining(id) {
    return this.request(`/induction/${id}`, {
      method: "DELETE",
    });
  }

  // Empleados
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
    return this.request(`/employees/${id}`, {
      method: "DELETE",
    });
  }


}

export default new ApiService();
