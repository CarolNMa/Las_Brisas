import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.3.232.188:8085/api/v1";

async function getToken() {
    return await AsyncStorage.getItem("token");
}

async function authHeaders() {
    const token = await getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

export async function getAllEmployees() {
    const res = await fetch(`${API_URL}/employees/all`, {
        headers: await authHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener empleados");
    const json = await res.json();
    return json; // Returns array directly
}

export async function getEmployeeById(id: string) {
    const res = await fetch(`${API_URL}/employees/${id}`, {
        headers: await authHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener empleado");
    const json = await res.json();
    return json.data; 
}

export async function getContractById(id: string) {
    const res = await fetch(`${API_URL}/contracts/${id}`, {
        headers: await authHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener contrato");
    const json = await res.json();
    return json.data;
}

export async function getEmployeeContract(id: string) {
    const res = await fetch(`${API_URL}/contracts/employee/${id}`, {
        headers: await authHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener contrato");
    const json = await res.json();
    return json.data;
}

export async function getAttendanceById(id: string) {
    const res = await fetch(`${API_URL}/attendance/${id}`, {
        headers: await authHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener asistencia");
    const json = await res.json();
    return json.data;
}

export async function getEmployeeAttendance(id: string) {
    const res = await fetch(`${API_URL}/attendance/employee/${id}`, {
        headers: await authHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener asistencia");
    const json = await res.json();
    return json.data;
}

export async function getEmployeePermissions(id: string) {
    const res = await fetch(`${API_URL}/applications/employee/${id}`, {
        headers: await authHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener permisos");
    const json = await res.json();
    return json.data; 
}
