const API_URL = "http://localhost:5000";

async function request(endpoint, options = {}){
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers:{"Content-Type": "application/json"},
            ...options,
        });
        if(!response.ok) throw new Error("Error en la API");
        return await response.json();
    } catch(error){
        console.error("API error:", error);
        throw error;
    }
}


export const getVentas = () => request("ventas");
export const getVenta = (id) => request(`ventas/${id}`);
export const createVentas = (data) => 
    request("ventas", { method: "POST", body: JSON.stringify(data)});
export const updateVenta = (id, data) => 
    request(`ventas/${id}`,{method:"PUT", body: JSON.stringify(data)});
export const deleteVenta = (id) => 
    request(`ventas/${id}`, {method: "DELETE"});

export const getClientes = () => request("clientes");
export const getCliente = (id) => request(`clientes/${id}`);
export const createCliente = (data) =>
  request("clientes", { method: "POST", body: JSON.stringify(data) });
export const updateCliente = (id, data) =>
  request(`clientes/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteCliente = (id) =>
  request(`clientes/${id}`, { method: "DELETE" });

export const getReportes = () => request("reportes");
export const getReporte = (id) => request(`reportes/${id}`);
export const createReporte = (data) =>
  request("reportes", { method: "POST", body: JSON.stringify(data) });
export const updateReporte = (id, data) =>
  request(`reportes/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteReporte = (id) =>
  request(`reportes/${id}`, { method: "DELETE" });

export const getLeads = () => request("leads");
export const getLead = (id) => request(`leads/${id}`);
export const createLead = (data) =>
  request("leads", { method: "POST", body: JSON.stringify(data) });
export const updateLead = (id, data) =>
  request(`leads/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteLead = (id) => request(`leads/${id}`, { method: "DELETE" });

export const getOportunidades = () => request("oportunidades");
export const getOportunidad = (id) => request(`oportunidades/${id}`);
export const createOportunidad = (data) =>
  request("oportunidades", { method: "POST", body: JSON.stringify(data) });
export const updateOportunidad = (id, data) =>
  request(`oportunidades/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteOportunidad = (id) =>
  request(`oportunidades/${id}`, { method: "DELETE" });