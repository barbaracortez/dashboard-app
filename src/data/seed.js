// Genera datos de demostración realistas y deterministas.
// Las fechas se calculan relativas a "hoy" para que los KPIs del mes
// y los gráficos de los últimos 12 meses siempre tengan contenido.

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PERSONAS = [
  "Sofía Martínez", "Mateo Fernández", "Valentina López", "Santiago Gómez",
  "Camila Rodríguez", "Benjamín Díaz", "Lucía Romero", "Joaquín Álvarez",
  "Martina Torres", "Tomás Ruiz", "Emilia Sánchez", "Facundo Herrera",
  "Julieta Castro", "Nicolás Molina", "Agustina Vega", "Lautaro Ortiz",
  "Catalina Silva", "Thiago Navarro", "Florencia Ríos", "Ignacio Medina",
  "Renata Suárez", "Franco Aguirre", "Abril Peralta", "Bruno Giménez",
];

const EMPRESAS = [
  "Andes Logística", "Nexo Retail", "Pampa Agro", "Brisa Turismo",
  "Cumbre Software", "Delta Salud", "Faro Seguros", "Grupo Litoral",
  "Horizonte Energía", "Ícaro Media", "Júpiter Foods", "Kora Textil",
  "Lumen Educación", "Mosaico Diseño", "Norte Construcciones", "Óptica Visión",
  "Prisma Finanzas", "Quanta Labs", "Raíz Orgánica", "Sur Automotores",
  "Terra Inmobiliaria", "Umbral Consultores", "Vértice Industrial", "Zenit Telecom",
];

const CIUDADES = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "Montevideo", "Santiago", "La Plata", "Neuquén"];

export const PRODUCTOS = [
  { nombre: "Plan CRM Starter", precio: 490 },
  { nombre: "Plan CRM Business", precio: 1290 },
  { nombre: "Plan CRM Enterprise", precio: 3900 },
  { nombre: "Módulo de Analítica", precio: 750 },
  { nombre: "Integración ERP", precio: 2200 },
  { nombre: "Capacitación del equipo", precio: 600 },
  { nombre: "Soporte Premium (anual)", precio: 1800 },
];

export const ESTADOS = {
  clientes: ["Activo", "Prospecto", "Inactivo"],
  ventas: ["Completada", "Pendiente", "Cancelada"],
  leads: ["Nuevo", "Contactado", "Calificado", "Descartado"],
  oportunidades: ["Prospección", "Propuesta", "Negociación", "Ganada", "Perdida"],
  reportes: ["Generado", "En revisión", "Pendiente"],
};

export const FUENTES = ["Sitio web", "LinkedIn", "Referido", "Evento", "Email", "Google Ads"];

const PROBABILIDAD = { Prospección: 20, Propuesta: 45, Negociación: 70, Ganada: 100, Perdida: 0 };

function iso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function slug(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function generateSeed(today = new Date()) {
  const rand = mulberry32(20251118);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const int = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
  const daysAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d;
  };
  const daysAhead = (n) => daysAgo(-n);

  // Clientes
  const clientes = EMPRESAS.map((empresa, i) => {
    const nombre = PERSONAS[i];
    const [first, last] = nombre.split(" ");
    const estado = i < 17 ? "Activo" : i < 21 ? "Prospecto" : "Inactivo";
    return {
      id: String(i + 1),
      nombre,
      empresa,
      email: `${slug(first)}.${slug(last)}@${slug(empresa)}.com`,
      telefono: `+54 11 ${int(4000, 6999)}-${int(1000, 9999)}`,
      ciudad: pick(CIUDADES),
      estado,
      fechaAlta: iso(daysAgo(int(5, 540))),
    };
  });

  const activos = clientes.filter((c) => c.estado !== "Prospecto");

  // Ventas: ~12 meses, con tendencia creciente
  const ventas = [];
  let ventaId = 1;
  for (let month = 12; month >= 0; month--) {
    // Mes calendario: en el mes actual, solo hasta hoy
    const first = new Date(today.getFullYear(), today.getMonth() - month, 1);
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const lastDay = month === 0 ? today.getDate() : daysInMonth;
    // Objetivo de facturación con crecimiento sostenido (~5% mensual) y algo de variación
    const objetivo = (17000 * Math.pow(1.05, 12 - month) + int(-2500, 2500)) * (lastDay / daysInMonth);
    let facturado = 0;
    while (facturado < objetivo) {
      // Reparte la facturación de forma pareja a lo largo del mes
      const dia = Math.round(lastDay * (facturado / objetivo)) + int(-1, 1);
      const fecha = new Date(first.getFullYear(), first.getMonth(), Math.min(lastDay, Math.max(1, dia)));
      const producto = pick(PRODUCTOS);
      const cantidad = producto.precio > 2000 ? 1 : int(1, 3);
      const r = rand();
      const estado = month === 0 && r < 0.25 ? "Pendiente" : r < 0.92 ? "Completada" : r < 0.96 ? "Pendiente" : "Cancelada";
      if (estado === "Completada") facturado += cantidad * producto.precio;
      ventas.push({
        id: String(ventaId++),
        fecha: iso(fecha),
        cliente: pick(activos).empresa,
        producto: producto.nombre,
        cantidad,
        precioUnitario: producto.precio,
        total: cantidad * producto.precio,
        estado,
      });
    }
  }
  ventas.sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Leads
  const leadNombres = [
    "Paula Benítez", "Diego Acosta", "Mariana Luna", "Gonzalo Paz", "Carolina Ibarra",
    "Esteban Rojas", "Daniela Méndez", "Federico Sosa", "Victoria Cabrera", "Hernán Godoy",
    "Milagros Quiroga", "Rodrigo Ferreyra", "Antonella Ponce", "Maximiliano Arias",
    "Rocío Villalba", "Sebastián Correa", "Ailén Domínguez", "Emiliano Farías",
  ];
  const leadEmpresas = [
    "Bosque Café", "Ciclo Bikes", "Duna Cosmética", "Eco Pack", "Fénix Gym",
    "Galaxia Kids", "Hielo Sur", "Isla Studio", "Jazmín Flores", "Kiwi Apps",
    "Lago Hoteles", "Molino Pastas", "Nube Cloud", "Oasis Spa", "Puerto Pesca",
    "Rayo Envíos", "Sol Solar", "Trigo Panificados",
  ];
  const leads = leadNombres.map((nombre, i) => {
    const [first] = nombre.split(" ");
    const r = rand();
    return {
      id: String(i + 1),
      nombre,
      empresa: leadEmpresas[i],
      email: `${slug(first)}@${slug(leadEmpresas[i])}.com`,
      fuente: pick(FUENTES),
      estado: r < 0.3 ? "Nuevo" : r < 0.6 ? "Contactado" : r < 0.85 ? "Calificado" : "Descartado",
      fecha: iso(daysAgo(int(0, 75))),
    };
  });
  leads.sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Oportunidades
  const titulos = [
    "Migración a CRM Business", "Licencias Enterprise", "Implementación ERP",
    "Renovación soporte anual", "Expansión regional", "Analítica avanzada",
    "Capacitación comercial", "Integración e-commerce", "Upgrade de plan",
    "Piloto de automatización", "Rollout sucursales", "Tablero ejecutivo",
    "Centralización de datos", "Portal de clientes",
  ];
  const etapas = ESTADOS.oportunidades;
  const oportunidades = titulos.map((titulo, i) => {
    const etapa = etapas[i % etapas.length];
    const cerrada = etapa === "Ganada" || etapa === "Perdida";
    return {
      id: String(i + 1),
      titulo,
      cliente: clientes[int(0, clientes.length - 1)].empresa,
      monto: int(8, 90) * 250,
      etapa,
      probabilidad: PROBABILIDAD[etapa],
      fechaCierre: iso(cerrada ? daysAgo(int(3, 60)) : daysAhead(int(7, 90))),
    };
  });

  // Reportes
  const responsables = ["Sofía Martínez", "Mateo Fernández", "Lucía Romero", "Tomás Ruiz"];
  const tiposReporte = [
    ["Ventas mensuales", "Ventas"], ["Embudo comercial", "Pipeline"],
    ["Altas de clientes", "Clientes"], ["Rendimiento por canal", "Marketing"],
    ["Proyección trimestral", "Finanzas"], ["Churn y retención", "Clientes"],
    ["Ticket promedio", "Ventas"], ["Leads por fuente", "Marketing"],
  ];
  const reportes = tiposReporte.map(([nombre, tipo], i) => ({
    id: String(i + 1),
    nombre,
    tipo,
    responsable: responsables[i % responsables.length],
    fecha: iso(daysAgo(i * 6 + int(0, 4))),
    estado: i < 5 ? "Generado" : i < 7 ? "En revisión" : "Pendiente",
  }));

  return { clientes, ventas, leads, oportunidades, reportes };
}

export { PROBABILIDAD };
