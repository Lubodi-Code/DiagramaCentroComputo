// Catálogo simple de especificaciones para el tour y el inspector
export const SPECS = {
  'switch-poe': {
    title: 'Switch PoE 24 puertos',
    summary: 'Switch gestionable capa 2/3 con PoE+ (802.3at) para teléfonos/IP y APs.',
    bullets: [
      '24 puertos GbE + 4 SFP/SFP+',
      'PoE presupuesto ≥ 370 W',
      'VLAN, QoS, STP, LACP, SNMP',
    ],
    docs: [
      { label: 'IEEE 802.3af/at', url: 'https://en.wikipedia.org/wiki/Power_over_Ethernet' },
    ],
  },
  'patch-panel': {
    title: 'Patch Panel',
    summary: 'Panel de parcheo para terminación de cobre categoría 6/6A.',
    bullets: [
      '48 puertos Cat6',
      'Norma TIA/EIA-568',
    ],
    docs: [{ label: 'TIA/EIA-568', url: 'https://en.wikipedia.org/wiki/ANSI/TIA-568' }],
  },
  firewall: {
    title: 'Firewall/Router UTM',
    summary: 'Cortafuegos de perímetro con inspección profunda y VPN.',
    bullets: [
      'NAT, IPS/IDS, Web filter, VPN IPsec/SSL',
      'Redundancia WAN (ISP A/B)',
    ],
    docs: [{ label: 'Conceptos UTM', url: 'https://en.wikipedia.org/wiki/Unified_threat_management' }],
  },
  kvm: {
    title: 'KVM/IP',
    summary: 'Consola KVM sobre IP para administración out-of-band.',
    bullets: ['Acceso remoto seguro', 'Virtual media'],
    docs: [],
  },
  'servers-vm': {
    title: 'Servidores de Virtualización',
    summary: 'Hosts para VMs de aplicaciones y servicios.',
    bullets: ['2× CPU, 128–256 GB RAM', 'RAID 1 para sistema, RAID 10 para datos'],
    docs: [],
  },
  'nas-raid': {
    title: 'NAS 8 TB RAID',
    summary: 'Almacenamiento en red con redundancia.',
    bullets: ['RAID 5/6', 'Snapshots y NFS/SMB'],
    docs: [],
  },
  'ac-precision': {
    title: 'A/C de precisión',
    summary: 'Climatización para sala de TI con control de T°/HR.',
    bullets: ['Rango 20–24 °C', 'HR 45–55 %', 'Monitoreo T/H'],
    docs: [{ label: 'ASHRAE TC 9.9', url: 'https://tc0909.ashraetcie.org/' }],
  },
  ups: {
    title: 'UPS Online 3 kVA',
    summary: 'Protección de carga crítica con autonomía ≥ 15 min.',
    bullets: ['Doble conversión', 'Bypass manual/estático', 'Baterías VRLA/Li-ion'],
    docs: [],
  },
  generator: {
    title: 'Generador 60 kW',
    summary: 'Respaldo eléctrico diésel con ATS.',
    bullets: ['Capacidad ≥ 50 kW', 'Pruebas semanales', 'Mantenimiento preventivo'],
    docs: [],
  },
  ats: {
    title: 'ATS (Transferencia automática)',
    summary: 'Conmuta entre red y generador sin intervención.',
    bullets: ['Interlock mecánico', 'Monitoreo de estado'],
    docs: [],
  },
  tank: {
    title: 'Tanque de combustible 24 h',
    summary: 'Autonomía mínima para jornada extendida.',
    bullets: ['Doble pared', 'Sensor de fuga'],
    docs: [],
  },
  'turnstiles': {
    title: 'Torniquetes / Mantrap',
    summary: 'Control físico de acceso con antipassback.',
    bullets: ['Interlock de puertas', 'Registro de eventos'],
    docs: [],
  },
  'badge-rfid': {
    title: 'Credencial RFID',
    summary: 'Identificación por proximidad/lector.',
    bullets: ['MIFARE/125 kHz', 'Integración con control de acceso'],
    docs: [],
  },
  biometric: {
    title: 'Biometría',
    summary: 'Verificación por huella/rostro.',
    bullets: ['Liveness detection', 'Registro y auditoría'],
    docs: [],
  },
  cctv: {
    title: 'CCTV',
    summary: 'Cámaras IP con grabación y analítica.',
    bullets: ['PoE', 'Retención 30 días', 'Alerta por eventos'],
    docs: [],
  },
  supervision: {
    title: 'Sala de Supervisión — 2 Estaciones',
    summary: 'Monitoreo de KPIs, grabaciones y gestión de calidad (QoS/Softphone).',
    bullets: ['Monitoreo de KPIs', 'Grabaciones y playback', 'QoS para voz / Softphone'],
    docs: [],
  },
  'softphone': {
    title: 'Softphone',
    summary: 'Cliente softphone para agentes y supervisores.',
    bullets: ['SIP', 'QoS', 'Integración con PBX/UC'],
    docs: [],
  },
  'reportes': {
    title: 'Reportes',
    summary: 'Paneles y reportes de rendimiento y calidad.',
    bullets: ['Dashboards KPI', 'Exportes CSV/PDF'],
    docs: [],
  },
  'analitica': {
    title: 'Analítica',
    summary: 'Análisis de llamadas y extracción de insights.',
    bullets: ['Speech analytics', 'Alertas por anomalías'],
    docs: [],
  },
  'grabacion': {
    title: 'Grabación',
    summary: 'Sistema de grabación y retención de llamadas.',
    bullets: ['Retención configurable', 'Búsqueda y reproducción'],
    docs: [],
  },
  'agents-area': {
    title: 'Área de Agentes — 20 Puestos',
    summary: 'Zona de trabajo con 20 puestos utilizando VLAN para voz y datos.',
    bullets: ['20 puestos', 'VLAN Voz/Datos', 'PoE en escritorios'],
    docs: [],
  },
}

export const DEFAULT_TOUR = [
  'ups',
  'generator',
  'ats',
  'switch-poe',
  'servers-vm',
  'nas-raid',
  'ac-precision',
  'turnstiles',
  'badge-rfid',
  'biometric',
  'cctv',
]
