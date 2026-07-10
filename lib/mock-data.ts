// ============================================================
// MOCK DATA — nomenclatura exacta de los modelos Django
// Campos preparados para consumo directo de la API GeneXus
// ============================================================

// ----------------------------------------------------------------
// Geografía
// ----------------------------------------------------------------
export interface Provincia {
  pci_codi: number;
  pci_nomb: string;
}

export interface Zona {
  zon_codi: number;
  zon_nomb: string | null;
}

export interface Localidad {
  loc_codi: number;
  loc_nomb: string;
  loc_cpos: string | null;
  pci_codi: number; // FK → Provincia.pci_codi
}

// ----------------------------------------------------------------
// Catálogo
// ----------------------------------------------------------------
export interface Marca {
  mar_codi: number;
  mar_nomb: string;
}

export interface Rubro {
  rub_codi: number;
  rub_nomb: string;
}

export interface SubRubro {
  sru_codi: number;
  sru_nomb: string;
  rub_codi: number; // FK → Rubro.rub_codi
}

export interface Articulo {
  art_codi: number;
  art_sku:  string | null;
  art_cn:   string | null;
  art_nomb: string;
  art_desc: string | null;
  art_pnet: number | null;
  art_pfin: number;
  art_cost: number | null;
  art_descu: number;
  art_stk:  number;
  art_tiva: number;
  art_acti: boolean;
  art_visw: boolean;
  art_mext: boolean;
  art_xbul: boolean;
  art_ubul: number;
  mar_codi: number; // FK → Marca.mar_codi
  sru_codi: number | null; // FK → SubRubro.sru_codi
  // computed helpers
  mar_nomb?: string;
  sru_nomb?: string;
  rub_nomb?: string;
  rub_codi?: number;
}

// ----------------------------------------------------------------
// Clientes
// ----------------------------------------------------------------
export interface Cliente {
  cli_codi: number;
  cli_nomb: string;
  cli_mail: string;
  cli_tele: string;
  loc_codi: number | null;  // FK → Localidad
  loc_nomb?: string;         // computed
  pci_nomb?: string;         // computed
  cli_falt: string;          // fecha alta
  cli_acti: boolean;
  // computed stats
  totalPedidos: number;
  totalGastado: number;
  totalVentas:  number;
  avatar: string;
}

// ----------------------------------------------------------------
// Pedidos
// ----------------------------------------------------------------
export interface DetallePedido {
  dpe_codi:  number;
  art_codi:  number;
  art_nomb:  string;
  dpe_cant:  number;
  art_pfin:  number;
  subtotal:  number;
}

export interface Pedido {
  ped_codi: number;
  ped_fech: string;
  ped_hora: string;
  cli_codi: number;
  cli_nomb: string;
  ped_tota: number;
  ped_fpag: "CDO" | "CTC" | "CHQ" | "TRF";
  ped_fpag_display: "Contado" | "Cuenta Corriente" | "Cheque" | "Transferencia";
  ped_exp:  boolean;
  ped_fexp: string | null;
  cantidadItems: number;
  detalles: DetallePedido[];
}

// ----------------------------------------------------------------
// Ventas
// ----------------------------------------------------------------
export interface DetalleVenta {
  dva_codi:  number;
  art_codi:  number;
  art_nomb:  string;
  dva_cant:  number;
  art_pfin:  number;
  subtotal:  number;
}

export interface Venta {
  ven_codi: number;
  ven_fech: string;
  ven_hora: string;
  cli_codi: number;
  cli_nomb: string;
  ven_tota: number;
  ven_fpag: "CDO" | "CTC" | "CHQ" | "TRF";
  ven_fpag_display: "Contado" | "Cuenta Corriente" | "Cheque" | "Transferencia";
  ven_ncmp: string;          // número comprobante
  cantidadItems: number;
  detalles: DetalleVenta[];
}

// ================================================================
// DATOS DE PROVINCIAS Y LOCALIDADES
// ================================================================
export const zonas: Zona[] = [
  { zon_codi: 1, zon_nomb: "Zona Norte" },
  { zon_codi: 2, zon_nomb: "Zona Sur" },
  { zon_codi: 3, zon_nomb: "Zona Centro" },
  { zon_codi: 4, zon_nomb: "Zona Cuyo" },
  { zon_codi: 5, zon_nomb: "Zona NEA" },
  { zon_codi: 6, zon_nomb: "Zona Patagonia" },
];

export const provincias: Provincia[] = [
  { pci_codi: 1,  pci_nomb: "Buenos Aires" },
  { pci_codi: 2,  pci_nomb: "Córdoba" },
  { pci_codi: 3,  pci_nomb: "Santa Fe" },
  { pci_codi: 4,  pci_nomb: "Mendoza" },
  { pci_codi: 5,  pci_nomb: "Tucumán" },
  { pci_codi: 6,  pci_nomb: "Neuquén" },
  { pci_codi: 7,  pci_nomb: "Corrientes" },
];

export const localidades: Localidad[] = [
  { loc_codi: 101, loc_nomb: "Buenos Aires",  loc_cpos: "1000", pci_codi: 1 },
  { loc_codi: 102, loc_nomb: "La Plata",       loc_cpos: "1900", pci_codi: 1 },
  { loc_codi: 201, loc_nomb: "Córdoba",         loc_cpos: "5000", pci_codi: 2 },
  { loc_codi: 301, loc_nomb: "Rosario",         loc_cpos: "2000", pci_codi: 3 },
  { loc_codi: 401, loc_nomb: "Mendoza",         loc_cpos: "5500", pci_codi: 4 },
  { loc_codi: 501, loc_nomb: "San Miguel de Tucumán", loc_cpos: "4000", pci_codi: 5 },
  { loc_codi: 601, loc_nomb: "Neuquén",         loc_cpos: "8300", pci_codi: 6 },
  { loc_codi: 701, loc_nomb: "Corrientes",      loc_cpos: "3400", pci_codi: 7 },
];

// ================================================================
// MARCAS, RUBROS, SUBRUBROS
// ================================================================
export const marcas: Marca[] = [
  { mar_codi: 1,  mar_nomb: "LG" },
  { mar_codi: 2,  mar_nomb: "Samsung" },
  { mar_codi: 3,  mar_nomb: "Lenovo" },
  { mar_codi: 4,  mar_nomb: "Logitech" },
  { mar_codi: 5,  mar_nomb: "TP-Link" },
  { mar_codi: 6,  mar_nomb: "HP" },
  { mar_codi: 7,  mar_nomb: "Philco" },
  { mar_codi: 8,  mar_nomb: "Whirlpool" },
  { mar_codi: 9,  mar_nomb: "Ariston" },
  { mar_codi: 10, mar_nomb: "Genérico" },
];

export const rubros: Rubro[] = [
  { rub_codi: 1, rub_nomb: "Tecnología" },
  { rub_codi: 2, rub_nomb: "Hogar" },
  { rub_codi: 3, rub_nomb: "Entretenimiento" },
  { rub_codi: 4, rub_nomb: "Oficina" },
];

export const subrubros: SubRubro[] = [
  { sru_codi: 11, sru_nomb: "Monitores",            rub_codi: 1 },
  { sru_codi: 12, sru_nomb: "Periféricos",           rub_codi: 1 },
  { sru_codi: 13, sru_nomb: "Notebooks",             rub_codi: 1 },
  { sru_codi: 14, sru_nomb: "Redes",                 rub_codi: 1 },
  { sru_codi: 15, sru_nomb: "Impresoras",            rub_codi: 4 },
  { sru_codi: 21, sru_nomb: "Climatización",         rub_codi: 2 },
  { sru_codi: 22, sru_nomb: "Electrodomésticos",     rub_codi: 2 },
  { sru_codi: 23, sru_nomb: "Cocina",                rub_codi: 2 },
  { sru_codi: 31, sru_nomb: "Televisores",           rub_codi: 3 },
  { sru_codi: 32, sru_nomb: "Audio",                 rub_codi: 3 },
];

// ================================================================
// ARTÍCULOS
// ================================================================
export const articulos: Articulo[] = [
  {
    art_codi: 1001, art_sku: "LG-MON-27K4", art_cn: "DD01001",
    art_nomb: 'Monitor LG 27" 4K', art_desc: "Monitor 4K IPS 27 pulgadas, 60Hz, HDR10",
    art_pnet: 15290, art_pfin: 18500, art_cost: 11000, art_descu: 0,
    art_stk: 24, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: false, art_xbul: false, art_ubul: 1,
    mar_codi: 1, sru_codi: 11,
    mar_nomb: "LG", sru_nomb: "Monitores", rub_nomb: "Tecnología", rub_codi: 1,
  },
  {
    art_codi: 1002, art_sku: "LOG-KB-MRG", art_cn: "DD01002",
    art_nomb: "Teclado Mecánico RGB", art_desc: "Teclado mecánico retroiluminado, switches Blue",
    art_pnet: 2645, art_pfin: 3200, art_cost: 1900, art_descu: 0,
    art_stk: 56, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: false, art_xbul: false, art_ubul: 1,
    mar_codi: 4, sru_codi: 12,
    mar_nomb: "Logitech", sru_nomb: "Periféricos", rub_nomb: "Tecnología", rub_codi: 1,
  },
  {
    art_codi: 1003, art_sku: "LOG-MS-G304", art_cn: "DD01003",
    art_nomb: "Mouse Logitech G304", art_desc: "Mouse inalámbrico gaming LIGHTSPEED",
    art_pnet: 3223, art_pfin: 3900, art_cost: 2300, art_descu: 0,
    art_stk: 8, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: false, art_xbul: false, art_ubul: 1,
    mar_codi: 4, sru_codi: 12,
    mar_nomb: "Logitech", sru_nomb: "Periféricos", rub_nomb: "Tecnología", rub_codi: 1,
  },
  {
    art_codi: 1004, art_sku: "LEN-NB-14I5", art_cn: "DD01004",
    art_nomb: 'Notebook Lenovo 14" i5', art_desc: "Notebook IdeaPad, Intel i5 12th, 8GB RAM, 512GB SSD",
    art_pnet: 26446, art_pfin: 32000, art_cost: 22000, art_descu: 0,
    art_stk: 12, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: true, art_xbul: false, art_ubul: 1,
    mar_codi: 3, sru_codi: 13,
    mar_nomb: "Lenovo", sru_nomb: "Notebooks", rub_nomb: "Tecnología", rub_codi: 1,
  },
  {
    art_codi: 1005, art_sku: "TPL-RT-AX55", art_cn: "DD01005",
    art_nomb: "Router TP-Link WiFi 6 AX1800", art_desc: "Router Wi-Fi 6 AX1800 Dual Band",
    art_pnet: 5620, art_pfin: 6800, art_cost: 4200, art_descu: 0,
    art_stk: 22, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: false, art_xbul: false, art_ubul: 1,
    mar_codi: 5, sru_codi: 14,
    mar_nomb: "TP-Link", sru_nomb: "Redes", rub_nomb: "Tecnología", rub_codi: 1,
  },
  {
    art_codi: 2001, art_sku: "WHP-AC-12K", art_cn: "DD02001",
    art_nomb: "Aire Acondicionado Whirlpool 12000 BTU", art_desc: "Split inverter frío/calor 12000 BTU",
    art_pnet: 34711, art_pfin: 42000, art_cost: 28000, art_descu: 0,
    art_stk: 15, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: false, art_xbul: false, art_ubul: 1,
    mar_codi: 8, sru_codi: 21,
    mar_nomb: "Whirlpool", sru_nomb: "Climatización", rub_nomb: "Hogar", rub_codi: 2,
  },
  {
    art_codi: 2002, art_sku: "WHP-HEL-SBS", art_cn: "DD02002",
    art_nomb: "Heladera Side by Side 540L", art_desc: "Heladera frost free no frost 540 litros",
    art_pnet: 70248, art_pfin: 85000, art_cost: 58000, art_descu: 0,
    art_stk: 6, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: false, art_xbul: false, art_ubul: 1,
    mar_codi: 8, sru_codi: 22,
    mar_nomb: "Whirlpool", sru_nomb: "Electrodomésticos", rub_nomb: "Hogar", rub_codi: 2,
  },
  {
    art_codi: 2003, art_sku: "ARI-LAV-8KG", art_cn: "DD02003",
    art_nomb: "Lavarropas Automático Ariston 8kg", art_desc: "Lavarropas carga frontal 8kg, 1200rpm",
    art_pnet: 53058, art_pfin: 64200, art_cost: 44000, art_descu: 0,
    art_stk: 9, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: false, art_xbul: false, art_ubul: 1,
    mar_codi: 9, sru_codi: 22,
    mar_nomb: "Ariston", sru_nomb: "Electrodomésticos", rub_nomb: "Hogar", rub_codi: 2,
  },
  {
    art_codi: 2004, art_sku: "ARI-COC-4HN", art_cn: "DD02004",
    art_nomb: "Cocina Ariston 4 Hornallas", art_desc: "Cocina a gas 4 hornallas con horno",
    art_pnet: 47934, art_pfin: 58000, art_cost: 40000, art_descu: 0,
    art_stk: 11, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: false, art_xbul: false, art_ubul: 1,
    mar_codi: 9, sru_codi: 23,
    mar_nomb: "Ariston", sru_nomb: "Cocina", rub_nomb: "Hogar", rub_codi: 2,
  },
  {
    art_codi: 3001, art_sku: "SAM-TV-50K4", art_cn: "DD03001",
    art_nomb: 'Smart TV Samsung 50" 4K', art_desc: "Smart TV Crystal UHD 4K 50 pulgadas, Tizen OS",
    art_pnet: 20496, art_pfin: 24800, art_cost: 17000, art_descu: 0,
    art_stk: 18, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: false, art_xbul: false, art_ubul: 1,
    mar_codi: 2, sru_codi: 31,
    mar_nomb: "Samsung", sru_nomb: "Televisores", rub_nomb: "Entretenimiento", rub_codi: 3,
  },
  {
    art_codi: 3002, art_sku: "LG-BS-BT40", art_cn: "DD03002",
    art_nomb: "Barra de Sonido LG Bluetooth", art_desc: "Soundbar 2.1, 160W, Dolby Atmos",
    art_pnet: 5455, art_pfin: 6600, art_cost: 4500, art_descu: 0,
    art_stk: 25, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: false, art_xbul: false, art_ubul: 1,
    mar_codi: 1, sru_codi: 32,
    mar_nomb: "LG", sru_nomb: "Audio", rub_nomb: "Entretenimiento", rub_codi: 3,
  },
  {
    art_codi: 4001, art_sku: "HP-IMP-LAP", art_cn: "DD04001",
    art_nomb: "Impresora Láser HP LaserJet", art_desc: "Impresora laser monocromo, 30ppm, WiFi",
    art_pnet: 23140, art_pfin: 28000, art_cost: 19000, art_descu: 0,
    art_stk: 5, art_tiva: 21, art_acti: true, art_visw: true,
    art_mext: false, art_xbul: false, art_ubul: 1,
    mar_codi: 6, sru_codi: 15,
    mar_nomb: "HP", sru_nomb: "Impresoras", rub_nomb: "Oficina", rub_codi: 4,
  },
];

// ================================================================
// CLIENTES (con nomenclatura exacta Django)
// ================================================================
export const clientes: Cliente[] = [
  {
    cli_codi: 1,  cli_nomb: "Distribuidora del Sur SA",
    cli_mail: "compras@distrosur.com", cli_tele: "+54 11 4231-8800",
    loc_codi: 101, loc_nomb: "Buenos Aires", pci_nomb: "Buenos Aires",
    cli_falt: "2023-03-15", cli_acti: true,
    totalPedidos: 34, totalGastado: 1854000, totalVentas: 1720000, avatar: "DS",
  },
  {
    cli_codi: 2,  cli_nomb: "Tecnología Avanzada SRL",
    cli_mail: "info@tecnoavanzada.com", cli_tele: "+54 351 488-2200",
    loc_codi: 201, loc_nomb: "Córdoba", pci_nomb: "Córdoba",
    cli_falt: "2023-06-22", cli_acti: true,
    totalPedidos: 18, totalGastado: 920000, totalVentas: 840000, avatar: "TA",
  },
  {
    cli_codi: 3,  cli_nomb: "Comercializadora Norte",
    cli_mail: "ventas@comnorte.com", cli_tele: "+54 381 421-5500",
    loc_codi: 501, loc_nomb: "San Miguel de Tucumán", pci_nomb: "Tucumán",
    cli_falt: "2023-01-08", cli_acti: true,
    totalPedidos: 52, totalGastado: 2740000, totalVentas: 2540000, avatar: "CN",
  },
  {
    cli_codi: 4,  cli_nomb: "Ferretería Industrial Eléctrica",
    cli_mail: "admin@ferelectrica.com", cli_tele: "+54 11 4641-3300",
    loc_codi: 101, loc_nomb: "Buenos Aires", pci_nomb: "Buenos Aires",
    cli_falt: "2022-11-30", cli_acti: false,
    totalPedidos: 9, totalGastado: 310000, totalVentas: 290000, avatar: "FI",
  },
  {
    cli_codi: 5,  cli_nomb: "Mayorista Electrohogar",
    cli_mail: "contacto@electrohogar.com", cli_tele: "+54 341 499-1100",
    loc_codi: 301, loc_nomb: "Rosario", pci_nomb: "Santa Fe",
    cli_falt: "2023-08-14", cli_acti: true,
    totalPedidos: 27, totalGastado: 1480000, totalVentas: 1360000, avatar: "ME",
  },
  {
    cli_codi: 6,  cli_nomb: "Soluciones & Servicios SA",
    cli_mail: "soporte@syservicios.com", cli_tele: "+54 261 445-7700",
    loc_codi: 401, loc_nomb: "Mendoza", pci_nomb: "Mendoza",
    cli_falt: "2023-05-09", cli_acti: true,
    totalPedidos: 15, totalGastado: 760000, totalVentas: 700000, avatar: "SS",
  },
  {
    cli_codi: 7,  cli_nomb: "Grupo Comercial Patagonia",
    cli_mail: "patagonia@grupo-pat.com", cli_tele: "+54 299 478-9900",
    loc_codi: 601, loc_nomb: "Neuquén", pci_nomb: "Neuquén",
    cli_falt: "2022-09-17", cli_acti: true,
    totalPedidos: 41, totalGastado: 2150000, totalVentas: 1980000, avatar: "GP",
  },
  {
    cli_codi: 8,  cli_nomb: "Importadora Atlántida",
    cli_mail: "ventas@atlantida.com", cli_tele: "+54 11 4321-6600",
    loc_codi: 101, loc_nomb: "Buenos Aires", pci_nomb: "Buenos Aires",
    cli_falt: "2023-07-03", cli_acti: false,
    totalPedidos: 12, totalGastado: 580000, totalVentas: 520000, avatar: "IA",
  },
  {
    cli_codi: 9,  cli_nomb: "Cadena Hogar SA",
    cli_mail: "compras@cadenahogar.com", cli_tele: "+54 351 422-4400",
    loc_codi: 201, loc_nomb: "Córdoba", pci_nomb: "Córdoba",
    cli_falt: "2023-02-25", cli_acti: true,
    totalPedidos: 38, totalGastado: 1960000, totalVentas: 1800000, avatar: "CH",
  },
  {
    cli_codi: 10, cli_nomb: "Negocios del Plata",
    cli_mail: "info@delplata.com", cli_tele: "+54 379 442-8800",
    loc_codi: 701, loc_nomb: "Corrientes", pci_nomb: "Corrientes",
    cli_falt: "2023-09-11", cli_acti: true,
    totalPedidos: 7, totalGastado: 420000, totalVentas: 390000, avatar: "NP",
  },
  {
    cli_codi: 11, cli_nomb: "Distribuidora Cuyo SA",
    cli_mail: "cuyo@distcuyo.com", cli_tele: "+54 261 433-2200",
    loc_codi: 401, loc_nomb: "Mendoza", pci_nomb: "Mendoza",
    cli_falt: "2023-04-19", cli_acti: true,
    totalPedidos: 23, totalGastado: 1220000, totalVentas: 1120000, avatar: "DC",
  },
  {
    cli_codi: 12, cli_nomb: "El Almacen Digital",
    cli_mail: "ventas@eldigital.com", cli_tele: "+54 11 4555-1100",
    loc_codi: 101, loc_nomb: "Buenos Aires", pci_nomb: "Buenos Aires",
    cli_falt: "2023-10-06", cli_acti: false,
    totalPedidos: 5, totalGastado: 245000, totalVentas: 220000, avatar: "AD",
  },
];

// ================================================================
// PEDIDOS (con nomenclatura exacta Django)
// ================================================================
export const pedidos: Pedido[] = [
  {
    ped_codi: 2048, ped_fech: "2025-07-08", ped_hora: "09:15",
    cli_codi: 3,  cli_nomb: "Comercializadora Norte",
    ped_tota: 128400, ped_fpag: "CTC", ped_fpag_display: "Cuenta Corriente",
    ped_exp: false, ped_fexp: null, cantidadItems: 6,
    detalles: [
      { dpe_codi: 1, art_codi: 1001, art_nomb: 'Monitor LG 27" 4K',   dpe_cant: 5,  art_pfin: 18500, subtotal: 92500 },
      { dpe_codi: 2, art_codi: 1002, art_nomb: "Teclado Mecánico RGB", dpe_cant: 10, art_pfin: 3200,  subtotal: 32000 },
      { dpe_codi: 3, art_codi: 1003, art_nomb: "Mouse Logitech G304",  dpe_cant: 1,  art_pfin: 3900,  subtotal: 3900  },
    ],
  },
  {
    ped_codi: 2047, ped_fech: "2025-07-08", ped_hora: "08:42",
    cli_codi: 1,  cli_nomb: "Distribuidora del Sur SA",
    ped_tota: 87600, ped_fpag: "TRF", ped_fpag_display: "Transferencia",
    ped_exp: true, ped_fexp: "2025-07-08T10:00:00", cantidadItems: 4,
    detalles: [
      { dpe_codi: 4, art_codi: 1004, art_nomb: 'Notebook Lenovo 14" i5', dpe_cant: 2, art_pfin: 32000, subtotal: 64000 },
      { dpe_codi: 5, art_codi: 1005, art_nomb: "Router TP-Link WiFi 6",  dpe_cant: 2, art_pfin: 6800,  subtotal: 13600 },
    ],
  },
  {
    ped_codi: 2046, ped_fech: "2025-07-07", ped_hora: "16:20",
    cli_codi: 5,  cli_nomb: "Mayorista Electrohogar",
    ped_tota: 154300, ped_fpag: "CDO", ped_fpag_display: "Contado",
    ped_exp: true, ped_fexp: "2025-07-07T18:00:00", cantidadItems: 9,
    detalles: [
      { dpe_codi: 6, art_codi: 2001, art_nomb: "Aire Acondicionado Whirlpool 12000 BTU", dpe_cant: 3, art_pfin: 42000, subtotal: 126000 },
      { dpe_codi: 7, art_codi: 3002, art_nomb: "Barra de Sonido LG Bluetooth",           dpe_cant: 4, art_pfin: 6600,  subtotal: 26400  },
    ],
  },
  {
    ped_codi: 2045, ped_fech: "2025-07-07", ped_hora: "14:05",
    cli_codi: 9,  cli_nomb: "Cadena Hogar SA",
    ped_tota: 64200, ped_fpag: "CTC", ped_fpag_display: "Cuenta Corriente",
    ped_exp: false, ped_fexp: null, cantidadItems: 5,
    detalles: [
      { dpe_codi: 8, art_codi: 2003, art_nomb: "Lavarropas Automático Ariston 8kg", dpe_cant: 1, art_pfin: 64200, subtotal: 64200 },
    ],
  },
  {
    ped_codi: 2044, ped_fech: "2025-07-07", ped_hora: "11:30",
    cli_codi: 7,  cli_nomb: "Grupo Comercial Patagonia",
    ped_tota: 198500, ped_fpag: "TRF", ped_fpag_display: "Transferencia",
    ped_exp: true, ped_fexp: "2025-07-07T13:00:00", cantidadItems: 12,
    detalles: [
      { dpe_codi: 9,  art_codi: 2002, art_nomb: "Heladera Side by Side 540L", dpe_cant: 2, art_pfin: 85000, subtotal: 170000 },
      { dpe_codi: 10, art_codi: 2004, art_nomb: "Cocina Ariston 4 Hornallas",  dpe_cant: 2, art_pfin: 58000, subtotal: 116000 },
    ],
  },
  {
    ped_codi: 2043, ped_fech: "2025-07-06", ped_hora: "15:45",
    cli_codi: 2,  cli_nomb: "Tecnología Avanzada SRL",
    ped_tota: 45800, ped_fpag: "CHQ", ped_fpag_display: "Cheque",
    ped_exp: false, ped_fexp: null, cantidadItems: 7,
    detalles: [
      { dpe_codi: 11, art_codi: 1005, art_nomb: "Router TP-Link WiFi 6", dpe_cant: 6, art_pfin: 6800, subtotal: 40800 },
      { dpe_codi: 12, art_codi: 4001, art_nomb: "Impresora Láser HP",    dpe_cant: 1, art_pfin: 5000, subtotal: 5000  },
    ],
  },
  {
    ped_codi: 2042, ped_fech: "2025-07-06", ped_hora: "10:10",
    cli_codi: 6,  cli_nomb: "Soluciones & Servicios SA",
    ped_tota: 73200, ped_fpag: "CDO", ped_fpag_display: "Contado",
    ped_exp: true, ped_fexp: "2025-07-06T12:00:00", cantidadItems: 3,
    detalles: [
      { dpe_codi: 13, art_codi: 4001, art_nomb: "Impresora Láser HP", dpe_cant: 2, art_pfin: 28000, subtotal: 56000 },
      { dpe_codi: 14, art_codi: 1002, art_nomb: "Teclado Mecánico RGB", dpe_cant: 5, art_pfin: 3200, subtotal: 16000 },
    ],
  },
  {
    ped_codi: 2041, ped_fech: "2025-07-05", ped_hora: "17:55",
    cli_codi: 11, cli_nomb: "Distribuidora Cuyo SA",
    ped_tota: 112400, ped_fpag: "TRF", ped_fpag_display: "Transferencia",
    ped_exp: true, ped_fexp: "2025-07-05T19:00:00", cantidadItems: 8,
    detalles: [
      { dpe_codi: 15, art_codi: 3001, art_nomb: 'Smart TV Samsung 50" 4K', dpe_cant: 4, art_pfin: 24800, subtotal: 99200 },
      { dpe_codi: 16, art_codi: 3002, art_nomb: "Barra de Sonido LG",      dpe_cant: 2, art_pfin: 6600,  subtotal: 13200 },
    ],
  },
  {
    ped_codi: 2040, ped_fech: "2025-07-05", ped_hora: "09:20",
    cli_codi: 3,  cli_nomb: "Comercializadora Norte",
    ped_tota: 38900, ped_fpag: "CTC", ped_fpag_display: "Cuenta Corriente",
    ped_exp: false, ped_fexp: null, cantidadItems: 4,
    detalles: [
      { dpe_codi: 17, art_codi: 1001, art_nomb: 'Monitor LG 27" 4K',   dpe_cant: 2, art_pfin: 18500, subtotal: 37000 },
      { dpe_codi: 18, art_codi: 1003, art_nomb: "Mouse Logitech G304",  dpe_cant: 1, art_pfin: 3900,  subtotal: 3900  },
    ],
  },
  {
    ped_codi: 2039, ped_fech: "2025-07-04", ped_hora: "13:15",
    cli_codi: 1,  cli_nomb: "Distribuidora del Sur SA",
    ped_tota: 96800, ped_fpag: "CDO", ped_fpag_display: "Contado",
    ped_exp: true, ped_fexp: "2025-07-04T15:00:00", cantidadItems: 10,
    detalles: [
      { dpe_codi: 19, art_codi: 1004, art_nomb: 'Notebook Lenovo 14" i5', dpe_cant: 3, art_pfin: 32000, subtotal: 96000 },
    ],
  },
  {
    ped_codi: 2038, ped_fech: "2025-07-04", ped_hora: "08:50",
    cli_codi: 5,  cli_nomb: "Mayorista Electrohogar",
    ped_tota: 54600, ped_fpag: "TRF", ped_fpag_display: "Transferencia",
    ped_exp: false, ped_fexp: null, cantidadItems: 6,
    detalles: [
      { dpe_codi: 20, art_codi: 2001, art_nomb: "Aire Acondicionado Whirlpool 12000 BTU", dpe_cant: 1, art_pfin: 42000, subtotal: 42000 },
      { dpe_codi: 21, art_codi: 3002, art_nomb: "Barra de Sonido LG",                     dpe_cant: 2, art_pfin: 6600,  subtotal: 13200 },
    ],
  },
  {
    ped_codi: 2037, ped_fech: "2025-07-03", ped_hora: "16:30",
    cli_codi: 9,  cli_nomb: "Cadena Hogar SA",
    ped_tota: 145200, ped_fpag: "CTC", ped_fpag_display: "Cuenta Corriente",
    ped_exp: true, ped_fexp: "2025-07-03T18:00:00", cantidadItems: 11,
    detalles: [
      { dpe_codi: 22, art_codi: 2004, art_nomb: "Cocina Ariston 4 Hornallas",        dpe_cant: 2, art_pfin: 58000, subtotal: 116000 },
      { dpe_codi: 23, art_codi: 2003, art_nomb: "Lavarropas Automático Ariston 8kg", dpe_cant: 1, art_pfin: 64200, subtotal: 64200  },
    ],
  },
];

// ================================================================
// VENTAS (facturación confirmada)
// ================================================================
export const ventas: Venta[] = [
  {
    ven_codi: 5201, ven_fech: "2025-07-08", ven_hora: "10:45",
    cli_codi: 3, cli_nomb: "Comercializadora Norte",
    ven_tota: 128400, ven_fpag: "CTC", ven_fpag_display: "Cuenta Corriente",
    ven_ncmp: "FA-00005201", cantidadItems: 3,
    detalles: [
      { dva_codi: 1, art_codi: 1001, art_nomb: 'Monitor LG 27" 4K',   dva_cant: 5, art_pfin: 18500, subtotal: 92500 },
      { dva_codi: 2, art_codi: 1002, art_nomb: "Teclado Mecánico RGB", dva_cant: 10, art_pfin: 3200, subtotal: 32000 },
      { dva_codi: 3, art_codi: 1003, art_nomb: "Mouse Logitech G304",  dva_cant: 1, art_pfin: 3900,  subtotal: 3900  },
    ],
  },
  {
    ven_codi: 5200, ven_fech: "2025-07-07", ven_hora: "18:10",
    cli_codi: 5, cli_nomb: "Mayorista Electrohogar",
    ven_tota: 154300, ven_fpag: "CDO", ven_fpag_display: "Contado",
    ven_ncmp: "FA-00005200", cantidadItems: 2,
    detalles: [
      { dva_codi: 4, art_codi: 2001, art_nomb: "Aire Acondicionado Whirlpool 12000 BTU", dva_cant: 3, art_pfin: 42000, subtotal: 126000 },
      { dva_codi: 5, art_codi: 3002, art_nomb: "Barra de Sonido LG Bluetooth",           dva_cant: 4, art_pfin: 6600,  subtotal: 26400  },
    ],
  },
  {
    ven_codi: 5199, ven_fech: "2025-07-07", ven_hora: "13:20",
    cli_codi: 7, cli_nomb: "Grupo Comercial Patagonia",
    ven_tota: 286000, ven_fpag: "TRF", ven_fpag_display: "Transferencia",
    ven_ncmp: "FA-00005199", cantidadItems: 4,
    detalles: [
      { dva_codi: 6, art_codi: 2002, art_nomb: "Heladera Side by Side 540L", dva_cant: 2, art_pfin: 85000, subtotal: 170000 },
      { dva_codi: 7, art_codi: 2004, art_nomb: "Cocina Ariston 4 Hornallas",  dva_cant: 2, art_pfin: 58000, subtotal: 116000 },
    ],
  },
  {
    ven_codi: 5198, ven_fech: "2025-07-06", ven_hora: "12:00",
    cli_codi: 6, cli_nomb: "Soluciones & Servicios SA",
    ven_tota: 73200, ven_fpag: "CDO", ven_fpag_display: "Contado",
    ven_ncmp: "FA-00005198", cantidadItems: 2,
    detalles: [
      { dva_codi: 8, art_codi: 4001, art_nomb: "Impresora Láser HP",    dva_cant: 2, art_pfin: 28000, subtotal: 56000 },
      { dva_codi: 9, art_codi: 1002, art_nomb: "Teclado Mecánico RGB",  dva_cant: 5, art_pfin: 3200,  subtotal: 16000 },
    ],
  },
  {
    ven_codi: 5197, ven_fech: "2025-07-05", ven_hora: "19:00",
    cli_codi: 11, cli_nomb: "Distribuidora Cuyo SA",
    ven_tota: 112400, ven_fpag: "TRF", ven_fpag_display: "Transferencia",
    ven_ncmp: "FA-00005197", cantidadItems: 2,
    detalles: [
      { dva_codi: 10, art_codi: 3001, art_nomb: 'Smart TV Samsung 50" 4K', dva_cant: 4, art_pfin: 24800, subtotal: 99200 },
      { dva_codi: 11, art_codi: 3002, art_nomb: "Barra de Sonido LG",      dva_cant: 2, art_pfin: 6600,  subtotal: 13200 },
    ],
  },
  {
    ven_codi: 5196, ven_fech: "2025-07-04", ven_hora: "15:30",
    cli_codi: 1, cli_nomb: "Distribuidora del Sur SA",
    ven_tota: 96000, ven_fpag: "CDO", ven_fpag_display: "Contado",
    ven_ncmp: "FA-00005196", cantidadItems: 1,
    detalles: [
      { dva_codi: 12, art_codi: 1004, art_nomb: 'Notebook Lenovo 14" i5', dva_cant: 3, art_pfin: 32000, subtotal: 96000 },
    ],
  },
  {
    ven_codi: 5195, ven_fech: "2025-07-03", ven_hora: "18:30",
    cli_codi: 9, cli_nomb: "Cadena Hogar SA",
    ven_tota: 180200, ven_fpag: "CTC", ven_fpag_display: "Cuenta Corriente",
    ven_ncmp: "FA-00005195", cantidadItems: 2,
    detalles: [
      { dva_codi: 13, art_codi: 2004, art_nomb: "Cocina Ariston 4 Hornallas",        dva_cant: 2, art_pfin: 58000, subtotal: 116000 },
      { dva_codi: 14, art_codi: 2003, art_nomb: "Lavarropas Automático Ariston 8kg", dva_cant: 1, art_pfin: 64200, subtotal: 64200  },
    ],
  },
  {
    ven_codi: 5194, ven_fech: "2025-07-02", ven_hora: "11:00",
    cli_codi: 2, cli_nomb: "Tecnología Avanzada SRL",
    ven_tota: 68000, ven_fpag: "CHQ", ven_fpag_display: "Cheque",
    ven_ncmp: "FA-00005194", cantidadItems: 2,
    detalles: [
      { dva_codi: 15, art_codi: 1004, art_nomb: 'Notebook Lenovo 14" i5', dva_cant: 2, art_pfin: 32000, subtotal: 64000 },
      { dva_codi: 16, art_codi: 1005, art_nomb: "Router TP-Link WiFi 6",  dva_cant: 1, art_pfin: 6800,  subtotal: 6800  },
    ],
  },
  {
    ven_codi: 5193, ven_fech: "2025-07-01", ven_hora: "09:30",
    cli_codi: 3, cli_nomb: "Comercializadora Norte",
    ven_tota: 40900, ven_fpag: "CTC", ven_fpag_display: "Cuenta Corriente",
    ven_ncmp: "FA-00005193", cantidadItems: 2,
    detalles: [
      { dva_codi: 17, art_codi: 1001, art_nomb: 'Monitor LG 27" 4K',  dva_cant: 2, art_pfin: 18500, subtotal: 37000 },
      { dva_codi: 18, art_codi: 1003, art_nomb: "Mouse Logitech G304", dva_cant: 1, art_pfin: 3900,  subtotal: 3900  },
    ],
  },
  {
    ven_codi: 5192, ven_fech: "2025-06-30", ven_hora: "14:00",
    cli_codi: 5, cli_nomb: "Mayorista Electrohogar",
    ven_tota: 95200, ven_fpag: "TRF", ven_fpag_display: "Transferencia",
    ven_ncmp: "FA-00005192", cantidadItems: 2,
    detalles: [
      { dva_codi: 19, art_codi: 2001, art_nomb: "Aire Acondicionado Whirlpool 12000 BTU", dva_cant: 2, art_pfin: 42000, subtotal: 84000 },
      { dva_codi: 20, art_codi: 3002, art_nomb: "Barra de Sonido LG",                     dva_cant: 2, art_pfin: 5600,  subtotal: 11200 },
    ],
  },
];

// ================================================================
// DATOS PARA GRÁFICOS — todos los nombres de campo son los reales
// ================================================================
export const ventasMensuales = [
  { mes: "Ene", ped_count: 145, ven_count: 128, ven_total: 2840000 },
  { mes: "Feb", ped_count: 132, ven_count: 115, ven_total: 2610000 },
  { mes: "Mar", ped_count: 168, ven_count: 155, ven_total: 3280000 },
  { mes: "Abr", ped_count: 151, ven_count: 140, ven_total: 2950000 },
  { mes: "May", ped_count: 189, ven_count: 172, ven_total: 3720000 },
  { mes: "Jun", ped_count: 176, ven_count: 161, ven_total: 3510000 },
  { mes: "Jul", ped_count: 98,  ven_count: 82,  ven_total: 1920000 },
];

export const ventasSemanales = [
  { dia: "Lun", ped_count: 12, ven_count: 9,  ven_total: 245000 },
  { dia: "Mar", ped_count: 18, ven_count: 15, ven_total: 386000 },
  { dia: "Mié", ped_count: 15, ven_count: 13, ven_total: 312000 },
  { dia: "Jue", ped_count: 22, ven_count: 19, ven_total: 448000 },
  { dia: "Vie", ped_count: 28, ven_count: 24, ven_total: 567000 },
  { dia: "Sáb", ped_count: 9,  ven_count: 7,  ven_total: 178000 },
  { dia: "Dom", ped_count: 4,  ven_count: 3,  ven_total: 89000  },
];

export const formaPagoData = [
  { name: "Contado",          ped_fpag: "CDO", value: 32, color: "hsl(var(--chart-1))" },
  { name: "Cuenta Corriente", ped_fpag: "CTC", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Transferencia",    ped_fpag: "TRF", value: 24, color: "hsl(var(--chart-3))" },
  { name: "Cheque",           ped_fpag: "CHQ", value: 16, color: "hsl(var(--chart-4))" },
];

export const estadoPedidosData = [
  { name: "Procesados", value: 68, fill: "hsl(var(--chart-2))" },
  { name: "Pendientes", value: 32, fill: "hsl(var(--chart-4))" },
];

export const topClientesData = [
  { cli_nomb: "Com. Norte",    ped_count: 52, ven_total: 2740 },
  { cli_nomb: "G. Patagonia",  ped_count: 41, ven_total: 2150 },
  { cli_nomb: "Cadena Hogar",  ped_count: 38, ven_total: 1960 },
  { cli_nomb: "Dist. del Sur", ped_count: 34, ven_total: 1854 },
  { cli_nomb: "Electrohogar",  ped_count: 27, ven_total: 1480 },
  { cli_nomb: "Dist. Cuyo",    ped_count: 23, ven_total: 1220 },
];

export const nuevosClientesData = [
  { mes: "Ene", cli_count: 8 },
  { mes: "Feb", cli_count: 5 },
  { mes: "Mar", cli_count: 12 },
  { mes: "Abr", cli_count: 7 },
  { mes: "May", cli_count: 15 },
  { mes: "Jun", cli_count: 10 },
  { mes: "Jul", cli_count: 6 },
];

export const categoriaVentasData = [
  { categoria: "Tecnología",      rub_codi: 1, ventas: 486, color: "hsl(var(--chart-1))" },
  { categoria: "Hogar",           rub_codi: 2, ventas: 312, color: "hsl(var(--chart-2))" },
  { categoria: "Entretenimiento", rub_codi: 3, ventas: 198, color: "hsl(var(--chart-3))" },
  { categoria: "Oficina",         rub_codi: 4, ventas: 145, color: "hsl(var(--chart-4))" },
];

export const radarData = [
  { metric: "Pedidos",      actual: 85, objetivo: 100 },
  { metric: "Ingresos",     actual: 72, objetivo: 100 },
  { metric: "Clientes",     actual: 91, objetivo: 100 },
  { metric: "Productos",    actual: 65, objetivo: 100 },
  { metric: "Satisfacción", actual: 88, objetivo: 100 },
  { metric: "Retención",    actual: 79, objetivo: 100 },
];

export const actividadReciente = [
  { id: 1, tipo: "pedido",  titulo: "Nuevo pedido #2048",     desc: "Comercializadora Norte — $128.400",  tiempo: "Hace 5 min", icon: "shopping" },
  { id: 2, tipo: "cliente", titulo: "Cliente registrado",     desc: "El Almacen Digital se registró",      tiempo: "Hace 1 h",   icon: "user" },
  { id: 3, tipo: "stock",   titulo: "Stock bajo",             desc: "Mouse Logitech G304 — 8 unidades",    tiempo: "Hace 3 h",   icon: "alert" },
  { id: 4, tipo: "venta",   titulo: "Venta facturada #5201",  desc: "Distribuidora del Sur — $87.600",     tiempo: "Hace 4 h",   icon: "check" },
  { id: 5, tipo: "pago",    titulo: "Pago recibido",          desc: "Transferencia de Grupo Patagonia",    tiempo: "Hace 6 h",   icon: "dollar" },
  { id: 6, tipo: "cliente", titulo: "Cliente actualizado",    desc: "Cadena Hogar SA actualizó datos",     tiempo: "Hace 8 h",   icon: "user" },
];

export const ventasPorCiudad = [
  { loc_nomb: "Buenos Aires",          ped_count: 145, ven_total: 4250000 },
  { loc_nomb: "Córdoba",               ped_count: 88,  ven_total: 2100000 },
  { loc_nomb: "Rosario",               ped_count: 62,  ven_total: 1480000 },
  { loc_nomb: "Mendoza",               ped_count: 45,  ven_total: 1120000 },
  { loc_nomb: "S.M. de Tucumán",       ped_count: 52,  ven_total: 2740000 },
  { loc_nomb: "Neuquén",               ped_count: 41,  ven_total: 2150000 },
];

export const scatterData = [
  { x: 24, y: 18500, z: 87 },  // art_stk, art_pfin, vendidos
  { x: 56, y: 3200,  z: 142 },
  { x: 8,  y: 3900,  z: 65 },
  { x: 12, y: 32000, z: 34 },
  { x: 22, y: 6800,  z: 73 },
  { x: 15, y: 42000, z: 22 },
  { x: 9,  y: 64200, z: 27 },
  { x: 18, y: 24800, z: 56 },
  { x: 25, y: 6600,  z: 41 },
  { x: 5,  y: 28000, z: 19 },
  { x: 11, y: 58000, z: 15 },
  { x: 6,  y: 85000, z: 18 },
];

export const dashboardStats = {
  totalPedidos: 1059,
  pedidosPendientes: 340,
  totalClientes: 312,
  clientesActivos: 248,
  totalVentas: 874,
  ingresosTotales: 20830000,
  ingresosVentas: 18250000,
  ticketPromedio: 19689,
  pedidosHoy: 12,
  ventasHoy: 9,
  ingresosHoy: 287600,
  crecimientoPedidos: 12.5,
  crecimientoClientes: 8.2,
  crecimientoIngresos: 18.3,
  crecimientoTicket: -3.1,
  crecimientoVentas: 15.6,
};

// ================================================================
// HELPERS
// ================================================================
export function getPedidoById(id: number) {
  return pedidos.find((p) => p.ped_codi === id);
}

export function getClienteByCodi(codi: number) {
  return clientes.find((c) => c.cli_codi === codi);
}

export function getPedidosByCliente(cli_codi: number) {
  return pedidos.filter((p) => p.cli_codi === cli_codi);
}

export function getVentaById(id: number) {
  return ventas.find((v) => v.ven_codi === id);
}

export function getVentasByCliente(cli_codi: number) {
  return ventas.filter((v) => v.cli_codi === cli_codi);
}

export function getArticuloByCodi(codi: number) {
  return articulos.find((a) => a.art_codi === codi);
}

export function getMarcaByCodi(codi: number) {
  return marcas.find((m) => m.mar_codi === codi);
}

export function getSubrubroByCodi(codi: number) {
  return subrubros.find((s) => s.sru_codi === codi);
}

export function getRubroByCodi(codi: number) {
  return rubros.find((r) => r.rub_codi === codi);
}

export function getZonaByCodi(codi: number) {
  return zonas.find((z) => z.zon_codi === codi);
}

export function getLocalidadByCodi(codi: number) {
  return localidades.find((l) => l.loc_codi === codi);
}

export function getProvinciaByCodi(codi: number) {
  return provincias.find((p) => p.pci_codi === codi);
}
