import { useMemo, useState, useEffect, useRef } from 'react'
import './App.css'
import { SPECS, DEFAULT_TOUR } from './specs'

function Toggle({ id, label, checked, onChange }) {
  return (
    <label className="ctl">
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} /> {label}
    </label>
  )
}

function Badge({ children }) {
  return <div className="badge">{children}</div>
}

// Make chips optionally clickable to open specs
function Chip({ children, onClick, dataKey, className }) {
  const [glow, setGlow] = useState(false)
  const clickable = !!onClick
  const cls = 'chip' + (className ? ' ' + className : '') + (clickable ? ' click' : '') + (glow ? ' glow' : '')
  const handleClick = () => {
    if (!clickable) return
    setGlow(true)
    setTimeout(() => setGlow(false), 900)
    onClick(dataKey)
  }
  return (
  <span data-spec={dataKey || undefined} className={cls} onClick={clickable ? handleClick : undefined} role={clickable ? 'button' : undefined} tabIndex={clickable ? 0 : undefined}>
      {children}
    </span>
  )
}

function RU({ count = 36 }) {
  return (
    <div className="ru">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="unit" />
      ))}
    </div>
  )
}

function Racks({ onSpec }) {
  return (
    <div className="racks">
      <div className="rack" data-tip="Rack 1 — Core (Switch PoE, Firewall/Router, Patch Panel)">
        <div className="chips">
          <Chip onClick={onSpec} dataKey="switch-poe"><svg className="ic"><use href="#ic-switch" /></svg> Switch PoE 24p</Chip>
          <Chip onClick={onSpec} dataKey="patch-panel"><svg className="ic"><use href="#ic-patch" /></svg> Patch Panel</Chip>
          <Chip onClick={onSpec} dataKey="firewall"><svg className="ic"><use href="#ic-shield" /></svg> Firewall/Router</Chip>
          <Chip onClick={onSpec} dataKey="kvm"><svg className="ic"><use href="#ic-kvm" /></svg> KVM/IP</Chip>
        </div>
        <RU />
      </div>
      <div className="rack" data-tip="Rack 2 — Cómputo (Servidores VM, NAS RAID, Backup)">
        <div className="chips">
          <Chip onClick={onSpec} dataKey="servers-vm"><svg className="ic"><use href="#ic-server" /></svg> Servidores VM</Chip>
          <Chip onClick={onSpec} dataKey="nas-raid"><svg className="ic"><use href="#ic-nas" /></svg> NAS 8TB RAID</Chip>
          <Chip onClick={onSpec} dataKey="ac-precision"><svg className="ic"><use href="#ic-ac" /></svg> A/C precisión</Chip>
        </div>
        <RU />
      </div>
    </div>
  )
}

function Supervisores({ onSpec }) {
  return (
    <div className="sup" data-spec="supervision">
      <div className="desk" data-tip="Supervisor 1">
        <div className="screens"><div className="scr" /><div className="scr" /></div>
        <div className="vw" />
        <div className="chips" style={{ marginTop: 8 }}>
          <Chip onClick={onSpec} dataKey="softphone"><svg className="ic"><use href="#ic-headset" /></svg> Softphone</Chip>
          <Chip onClick={onSpec} dataKey="reportes"><svg className="ic"><use href="#ic-report" /></svg> Reportes</Chip>
        </div>
      </div>
      <div className="desk" data-tip="Supervisor 2">
        <div className="screens"><div className="scr" /><div className="scr" /></div>
        <div className="vw" />
        <div className="chips" style={{ marginTop: 8 }}>
          <Chip onClick={onSpec} dataKey="analitica"><svg className="ic"><use href="#ic-analytics" /></svg> Analítica</Chip>
          <Chip onClick={onSpec} dataKey="grabacion"><svg className="ic"><use href="#ic-record" /></svg> Grabación</Chip>
        </div>
      </div>
    </div>
  )
}

function AgentsGrid() {
  const seats = useMemo(() => Array.from({ length: 20 }, (_, i) => `A${i + 1}`), [])
  return (
    <div className="seats">
      {seats.map(id => (
        <div className="seat" key={id}>
          <div className="tag">{id}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <svg className="ic"><use href="#ic-desktop" /></svg>
            <svg className="ic"><use href="#ic-headset" /></svg>
            <svg className="ic"><use href="#ic-phone" /></svg>
            <Chip><svg className="ic"><use href="#ic-poe" /></svg> PoE</Chip>
          </div>
        </div>
      ))}
    </div>
  )
}

// Energy cards accept an onSpec callback to open specs
function EnergyCards({ generatorKw = 60, onSpec }) {
  const genRef = useRef(null)

  useEffect(() => {
    const el = genRef.current
    if (!el) return
    // restore position if any
    try {
      const raw = window.localStorage.getItem('generatorPos')
      if (raw) {
        const pos = JSON.parse(raw)
        el.style.position = 'fixed'
        el.style.left = pos.x + 'px'
        el.style.top = pos.y + 'px'
        el.style.zIndex = 999
      }
  } catch (err) { console.warn('restore generatorPos failed', err) }

    let dragging = false
    let startX = 0
    let startY = 0
    let origX = 0
    let origY = 0

    const onPointerDown = (e) => {
      // only start when clicking the handle
      if (!e.target.closest || !e.target.closest('.drag-handle')) return
      dragging = true
      el.setPointerCapture?.(e.pointerId)
      startX = e.clientX
      startY = e.clientY
      const rect = el.getBoundingClientRect()
      origX = rect.left
      origY = rect.top
      el.style.position = 'fixed'
      el.style.zIndex = 10000
      document.body.classList.add('dragging')
      e.preventDefault()
    }

    const onPointerMove = (e) => {
      if (!dragging) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const nx = Math.max(8, origX + dx)
      const ny = Math.max(8, origY + dy)
      el.style.left = nx + 'px'
      el.style.top = ny + 'px'
      e.preventDefault()
    }

    const onPointerUp = (e) => {
      if (!dragging) return
      dragging = false
      el.releasePointerCapture?.(e.pointerId)
      document.body.classList.remove('dragging')
      // persist
  try { window.localStorage.setItem('generatorPos', JSON.stringify({ x: parseInt(el.style.left || '0', 10), y: parseInt(el.style.top || '0', 10) })) } catch (err) { console.warn('persist generatorPos failed', err) }
      e.preventDefault()
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [genRef])

  return (
    <div className="cards">
      <div className="card" data-spec="ups" data-tip="UPS Online 3 kVA — carga crítica">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <svg className="ic"><use href="#ic-ups" /></svg><strong>UPS Online 3 kVA</strong>
        </div>
        <div className="note">Protege carga crítica (servidores y core de red)</div>
        <div className="chips">
          <Chip onClick={onSpec} dataKey="ups"><svg className="ic"><use href="#ic-battery" /></svg> 15 min</Chip>
          <Chip onClick={onSpec} dataKey="ups"><svg className="ic"><use href="#ic-ground" /></svg> Tierra física</Chip>
        </div>
      </div>
      <div ref={genRef} className="card" data-spec="generator" data-tip={`Generador ${generatorKw} kW — ATS — dimensionamiento revisado (≥50 kW)`} style={{ cursor: 'grab' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <svg className="ic"><use href="#ic-gen" /></svg><strong>Generador {generatorKw} kW</strong>
          <span className="drag-handle" title="Arrastrar" style={{ marginLeft: 8, padding: '4px 6px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, fontSize: 12, color: '#9fb0c5' }}>☰</span>
        </div>
        <div className="note">Diésel • Transferencia automática (ATS) • Dimensionamiento revisado (≥50 kW)</div>
        <div className="chips">
          <Chip onClick={onSpec} dataKey="ats"><svg className="ic"><use href="#ic-ats" /></svg> ATS</Chip>
          <Chip onClick={onSpec} dataKey="tank"><svg className="ic"><use href="#ic-tank" /></svg> Tanque 24 h</Chip>
        </div>
      </div>
    </div>
  )
}

// Lightweight modal for specs/tour
function SpecsModal({ open, id, onClose, onPrev, onNext }) {
  const modalRef = useRef(null)
  useEffect(() => {
    if (!open) return
    const el = modalRef.current
    if (!el) return
    // restore position
    try {
      const raw = window.localStorage.getItem('specsPos')
      if (raw) {
        const pos = JSON.parse(raw)
        el.style.position = 'fixed'
        el.style.left = pos.x + 'px'
        el.style.top = pos.y + 'px'
        el.style.zIndex = 20000
      }
    } catch { /* ignore */ }

    let dragging = false
    let startX = 0
    let startY = 0
    let origX = 0
    let origY = 0

    const onPointerDown = (e) => {
      // only start when clicking header, but ignore clicks on interactive elements (buttons/links)
      if (!e.target.closest || !e.target.closest('.modal-header')) return
      // ignore interactive targets so their click handlers work
      if (e.target.closest && e.target.closest('button, a, .btn, [role="button"]')) return
      dragging = true
      el.setPointerCapture?.(e.pointerId)
      startX = e.clientX
      startY = e.clientY
      const rect = el.getBoundingClientRect()
      origX = rect.left
      origY = rect.top
      el.style.position = 'fixed'
      el.style.zIndex = 30000
      document.body.classList.add('dragging')
      e.preventDefault()
    }

    const onPointerMove = (e) => {
      if (!dragging) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const nx = Math.max(8, origX + dx)
      const ny = Math.max(8, origY + dy)
      el.style.left = nx + 'px'
      el.style.top = ny + 'px'
      e.preventDefault()
    }

    const onPointerUp = (e) => {
      if (!dragging) return
      dragging = false
      el.releasePointerCapture?.(e.pointerId)
      document.body.classList.remove('dragging')
      // persist position
      try { window.localStorage.setItem('specsPos', JSON.stringify({ x: parseInt(el.style.left || '0', 10), y: parseInt(el.style.top || '0', 10) })) } catch { /* ignore */ }
      e.preventDefault()
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [open, id])

  if (!open || !id) return null
  const spec = SPECS[id]
  if (!spec) return null
  return (
    <div className="modal" role="dialog" aria-label="Especificaciones">
      <div ref={modalRef} className="modal-card" style={{ cursor: 'grab' }}>
        <div className="modal-header" style={{ cursor: 'grab' }}>
          <strong>{spec.title}</strong>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn" onClick={onPrev} aria-label="Anterior">◀</button>
            <button className="btn" onClick={onNext} aria-label="Siguiente">▶</button>
            <button className="btn" onClick={onClose} aria-label="Cerrar">✕</button>
          </div>
        </div>
        <div className="modal-body">
          <p className="note">{spec.summary}</p>
          <ul>
            {spec.bullets?.map((b, i) => (<li key={i}>{b}</li>))}
          </ul>
          {!!spec.docs?.length && (
            <div style={{ marginTop: 8 }}>
              {spec.docs.map((d, i) => (<a key={i} className="link" href={d.url} target="_blank" rel="noreferrer">{d.label}</a>))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Inspector de Cumplimiento (panel lateral informativo)
function CompliancePanel({ open, onClose }) {
  if (!open) return null
  return (
    <div className="panel-flyout" role="dialog" aria-label="Inspector de Cumplimiento">
      <div className="panel-header">
        <strong>Inspector de Cumplimiento y Evidencia</strong>
        <button className="btn-close" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>
      <div className="panel-body">
        <p><strong>Resumen:</strong> El diagrama refleja la propuesta de la investigación en diseño físico, HVAC, energía, red, seguridad y adquisición. Identifica una discrepancia crítica: el generador no puede ser de 5 kW; debe dimensionarse ≥ 50 kW según la carga total.</p>

        <h4>Cómo el diagrama cumple la investigación</h4>
        <ul>
          <li><strong>Diseño físico:</strong> Sala de Servidores (2 racks), Área de Agentes (20), Supervisión/NOC, Recepción/Entrada; acceso restringido, ergonomía y canaletas/piso técnico; salidas de emergencia señalizadas.</li>
          <li><strong>HVAC:</strong> Rango 20–24 °C y 45–55% HR; pasillos frío/caliente; A/C precisión y sensores T/H.</li>
          <li><strong>Energía:</strong> UPS ≥ 15 min con baterías y monitoreo; Generador con ATS; PDU (R1/R2), medición kWh y tablero eléctrico.</li>
          <li><strong>Red:</strong> VLAN Voz/Datos; WAN dual (ISP A/B); SW de Pod 1–5; AP Wi‑Fi.</li>
          <li><strong>Seguridad:</strong> Control biométrico; gas inerte; backups diarios/incrementales y semanales/completos; CCTV+Syslog+Alertas.</li>
        </ul>

        <h4>Punto crítico de discrepancia</h4>
        <p><strong>Generador subdimensionado (5 kW):</strong> Incompatible con 2 racks, HVAC de precisión, red y 20 puestos. Recalcular carga y proponer ≥ 50 kW (ej. 60 kW) con ATS y pruebas semanales.</p>

        <h4>Normativas y buenas prácticas</h4>
        <ul>
          <li><strong>ASHRAE TC 9.9:</strong> T° 20–24 °C; HR 45–55%; control por temperatura de entrada al servidor si hay contención.</li>
          <li><strong>ANSI/TIA‑942 y J‑STD‑607‑A:</strong> Piso técnico/canaletas; TMGB/TGB; CBN; aterrizaje individual de racks.</li>
          <li><strong>NFPA 75/76:</strong> Protección de TI y telecom; detección y supresión con agente limpio (p. ej., Inergen/Fluoro‑K).</li>
          <li><strong>Red:</strong> VLANs, QoS (voz &lt; 150 ms ITU‑T G.114), PoE+ 802.3at, WAN dual.</li>
          <li><strong>Backups 3‑2‑1‑1‑0:</strong> Copia inmutable/air‑gapped y verificación de restauración.</li>
        </ul>

        <h4>Acciones recomendadas</h4>
        <ol>
          <li>Calcular carga eléctrica y dimensionar generador/UPS (≥ 50 kW con ATS).</li>
          <li>Implementar contención (CAC/HAC) y ajustar control HVAC por aire de entrada.</li>
          <li>Integrar seguridad física (biometría) y lógica (UTM, EPP/EDR) con registros unificados.</li>
          <li>Formalizar DRP y backups 3‑2‑1‑1‑0 con pruebas periódicas.</li>
        </ol>
      </div>
    </div>
  )
}

export default function App() {
  const [showAir, setShowAir] = useState(false)
  const [showCctv, setShowCctv] = useState(false)
  const [showTray, setShowTray] = useState(false)
  const [showEvac, setShowEvac] = useState(false)
  const [showAccess, setShowAccess] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  // Tour state with persistence
  const persisted = typeof window !== 'undefined' ? Number(window.localStorage.getItem('tourIdx') ?? '0') : 0
  const [tourOpen, setTourOpen] = useState(false)
  const [tourIdx, setTourIdx] = useState(Number.isFinite(persisted) ? persisted : 0)
  // tour list is built dynamically from DOM [data-spec] when starting the tour
  const tourListRef = useRef(DEFAULT_TOUR)
  const currentId = tourListRef.current[tourIdx]
  const pointerRef = useRef(null)
  const highlightRef = useRef(null)
  const autoplayRef = useRef(false)

  const setIdxPersist = (fnOrIdx) => {
    setTourIdx(prev => {
      const next = typeof fnOrIdx === 'function' ? fnOrIdx(prev) : fnOrIdx
  try { window.localStorage.setItem('tourIdx', String(next)) } catch { void 0 }
      return next
    })
  }

  const openSpec = (id) => {
    const idx = tourListRef.current.indexOf(id)
    setIdxPersist(idx >= 0 ? idx : 0)
    setTourOpen(true)
  }
  const next = () => setIdxPersist(i => (i + 1) % tourListRef.current.length)
  const prev = () => setIdxPersist(i => (i - 1 + tourListRef.current.length) % tourListRef.current.length)

  // Start the tour building a dynamic list of all [data-spec] elements in DOM order
  const startTour = (autoplay = false) => {
    try {
      const nodes = Array.from(document.querySelectorAll('[data-spec]')).map(el => el.getAttribute('data-spec')).filter(Boolean)
      const uniq = Array.from(new Set(nodes))
      tourListRef.current = uniq.length ? uniq : DEFAULT_TOUR
    } catch {
      tourListRef.current = DEFAULT_TOUR
    }
    autoplayRef.current = autoplay
    setIdxPersist(0)
    setTourOpen(true)
  }

  // Move the visual pointer to the currently focused tour element
  useEffect(() => {
    if (!tourOpen) return
    const id = currentId
    if (!id) return
    const el = document.querySelector(`[data-spec="${id}"]`)
    const p = pointerRef.current
    if (!p || !el) return
    // prefer to highlight a meaningful area (ancestor section/card/rack) when available
    const area = el.closest('section.room, .cards, .racks, .agents, .entrygrid, .rack, .seats, .card, .entry, .room')
    const rect = (area || el).getBoundingClientRect()
    // center pointer above the area (use viewport coordinates)
    const cx = Math.round(rect.left + rect.width / 2 - 9)
    const cy = Math.round(rect.top - 28)
    // place pointer using fixed positioning (viewport coords)
    p.style.left = cx + 'px'
    p.style.top = cy + 'px'
    p.style.opacity = '1'

    // position and show highlight box using fixed coords
    const h = highlightRef.current
    if (h) {
      h.style.width = rect.width + 'px'
      h.style.height = rect.height + 'px'
      h.style.left = Math.round(rect.left) + 'px'
      h.style.top = Math.round(rect.top) + 'px'
      h.style.opacity = '1'
    }

    // scroll into view smoothly - use area if available
    (area || el).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    // If autoplay is set, advance after delay
    if (autoplayRef.current) {
      const t = setTimeout(() => {
        setIdxPersist(i => (i + 1) % tourListRef.current.length)
      }, 1900)
      return () => clearTimeout(t)
    }
  }, [tourOpen, tourIdx, currentId])

  return (
    <div className="wrap">
      <h1>Centro de Cómputo — Call Center (20 puestos)</h1>
      <Badge>
        <svg className="ic"><use href="#ic-thermo"></use></svg> 20–24 °C · 45–55 % HR · Pasillos Frío/Caliente
      </Badge>

      <div className="legend">
        <div className="pill"><span className="sw" style={{ background: '#102a43' }}></span> Sala de Servidores</div>
        <div className="pill"><span className="sw" style={{ background: '#102735' }}></span> Energía (UPS/Gen)</div>
        <div className="pill"><span className="sw" style={{ background: '#0e2438' }}></span> Supervisión</div>
        <div className="pill"><span className="sw" style={{ background: '#0d1725' }}></span> Agentes</div>
        <div className="pill"><svg className="ic"><use href="#ic-lock"></use></svg> Control de Acceso</div>
        <div className="pill"><svg className="ic"><use href="#ic-snow"></use></svg> Pasillo frío</div>
        <div className="pill"><svg className="ic"><use href="#ic-fire"></use></svg> Pasillo caliente</div>
        <div className="pill"><svg className="ic"><use href="#ic-gas"></use></svg> Gas inerte</div>
        <div className="pill"><svg className="ic"><use href="#ic-cctv"></use></svg> CCTV</div>
        <div className="pill"><svg className="ic"><use href="#ic-poe"></use></svg> PoE</div>
      </div>

      <div className="controls">
    <Toggle id="air" label="Flujo de aire" checked={showAir} onChange={setShowAir} />
    <Toggle id="cctv" label="CCTV" checked={showCctv} onChange={setShowCctv} />
    <Toggle id="tray" label="Bandeja de cableado" checked={showTray} onChange={setShowTray} />
    <Toggle id="evac" label="Evacuación" checked={showEvac} onChange={setShowEvac} />
    <Toggle id="access" label="Acceso" checked={showAccess} onChange={setShowAccess} />
    <Toggle id="panel" label="Inspector de Cumplimiento" checked={showPanel} onChange={setShowPanel} />
    <button className="btn" onClick={() => startTour(true)} style={{ marginLeft: 'auto' }}>Iniciar tour</button>
  <button className="btn" onClick={() => startTour(false)} style={{ marginLeft: 8 }}>Iniciar tour (manual)</button>
      </div>

      {showTray && (
        <div className="room" style={{ marginBottom: 12, padding: '10px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9fb0c5' }}>
            <svg className="ic"><use href="#ic-cable"></use></svg> Bandeja principal de voz/datos
          </div>
          <div style={{ height: 8, marginTop: 6, borderRadius: 6, border: '1px solid var(--edge)', background: 'repeating-linear-gradient(90deg,#122338 0 12px,#152a42 12px 24px)' }}></div>
        </div>
      )}

      <div className="grid">
        <section className="room">
          <h3><svg className="ic"><use href="#ic-rack" /></svg> Sala de Servidores — 2 Racks</h3>
          <div className="note">Control de acceso · A/C precisión · Sensores T°/H°</div>
          <div className="rackzone">
            <Racks onSpec={openSpec} />
            {showAir && <div className="aisle hot">🔥 Pasillo caliente <span className="arrow"></span></div>}
            {showAir && <div className="aisle cold">🧊 Pasillo frío <span className="arrow" style={{ transform: 'rotate(-135deg)' }}></span></div>}
          </div>
        </section>

        <section className="room">
          <h3><svg className="ic"><use href="#ic-power" /></svg> Energía: UPS (15 min) + Generador (60 kW)</h3>
          <EnergyCards generatorKw={60} onSpec={openSpec} />
        </section>

        <section className="room">
          <h3><svg className="ic"><use href="#ic-monitor" /></svg> Sala de Supervisión — 2 Estaciones</h3>
          <div className="note">Monitoreo de KPIs · Grabaciones · QoS</div>
    <Supervisores onSpec={openSpec} />
        </section>
      </div>

  <section className="agents" data-spec="agents-area">
        <h3><svg className="ic"><use href="#ic-users" /></svg> Área de Agentes — 20 Puestos (Voz/Datos en VLAN)</h3>
        <AgentsGrid />
        <div className="rowlabel">Pasillo de circulación</div>
      </section>

      {/* RECEPCION Y ACCESO (movido debajo del área de agentes) */}
      <section className="room entry">
        <h3><svg className="ic"><use href="#ic-lock" /></svg> Recepción y Control de Acceso — Vestíbulo/Mantrap</h3>
        <div className="note">Identidad verificada · Registro de visitas · Torniquetes · Lectores RFID/QR</div>
        <div className="entrygrid">
          <div className="gate" data-tip="Puesto de seguridad / recepción">
            <div className="chips">
              <Chip onClick={openSpec} dataKey="badge-rfid"><svg className="ic"><use href="#ic-id" /></svg> Registro/Visitantes</Chip>
              <Chip onClick={openSpec} dataKey="cctv"><svg className="ic"><use href="#ic-cctv" /></svg> Monitoreo CCTV</Chip>
            </div>
          </div>
          <div className="turn" data-tip="Mantrap / torniquetes">
            <div className="chips">
              <Chip onClick={openSpec} dataKey="turnstiles"><svg className="ic"><use href="#ic-lock" /></svg> Torniquetes</Chip>
              <Chip onClick={openSpec} dataKey="badge-rfid"><svg className="ic"><use href="#ic-badge" /></svg> Badge RFID</Chip>
            </div>
          </div>
          <div className="kiosk" data-tip="Kiosko de visitantes / QR">
            <div className="chips">
              <Chip onClick={openSpec} dataKey="badge-rfid"><svg className="ic"><use href="#ic-qr" /></svg> QR Visitantes</Chip>
              <Chip onClick={openSpec} dataKey="badge-rfid"><svg className="ic"><use href="#ic-badge" /></svg> Impresión de gafete</Chip>
            </div>
          </div>
        </div>

        {/* Puerta de Entrada y Mantrap */}
        <div className="doors" aria-label="Puertas de acceso (mantrap)">
          <div className="doorblock">
            <div className="label"><svg className="ic"><use href="#ic-exit" /></svg> Entrada principal</div>
            <div className="frame">
              <div className="leaf open" aria-hidden="true">
                <div className="handle" />
              </div>
            </div>
            <div className="chips">
              <Chip className="ok" onClick={openSpec} dataKey="badge-rfid"><svg className="ic"><use href="#ic-badge" /></svg> Lector RFID</Chip>
              <Chip onClick={openSpec} dataKey="badge-rfid"><svg className="ic"><use href="#ic-qr" /></svg> QR Visitantes</Chip>
            </div>
          </div>
          <div className="airlock" aria-hidden="true"></div>
          <div className="doorblock">
            <div className="label"><svg className="ic"><use href="#ic-lock" /></svg> Puerta interior a salas</div>
            <div className="frame">
              <div className="leaf" aria-hidden="true">
                <div className="handle" />
              </div>
            </div>
            <div className="chips">
              <Chip className="warn" onClick={openSpec} dataKey="biometric"><svg className="ic"><use href="#ic-id" /></svg> Biometría</Chip>
              <Chip onClick={openSpec} dataKey="cctv"><svg className="ic"><use href="#ic-cctv" /></svg> CCTV</Chip>
            </div>
          </div>
        </div>
      </section>

      {showCctv && (
        <div className="overlay">
          <div className="cam" style={{ left: 20, top: 20 }}><svg className="ic" style={{ width: 16, height: 16 }}><use href="#ic-cctv" /></svg></div>
          <div className="cone" style={{ left: 14, top: 32, transform: 'rotate(18deg)' }}></div>
          <div className="cam" style={{ right: 20, top: 20 }}><svg className="ic" style={{ width: 16, height: 16 }}><use href="#ic-cctv" /></svg></div>
          <div className="cone" style={{ right: 14, top: 32, transform: 'rotate(-18deg)' }}></div>
          <div className="cam" style={{ left: 20, bottom: 130 }}><svg className="ic" style={{ width: 16, height: 16 }}><use href="#ic-cctv" /></svg></div>
          <div className="cone" style={{ left: 14, bottom: 40, transform: 'rotate(-200deg)' }}></div>
          <div className="cam" style={{ right: 20, bottom: 130 }}><svg className="ic" style={{ width: 16, height: 16 }}><use href="#ic-cctv" /></svg></div>
          <div className="cone" style={{ right: 14, bottom: 40, transform: 'rotate(-340deg)' }}></div>
        </div>
      )}

  {/* Tour pointer (absolute, moves to target) */}
  <div ref={pointerRef} className="tour-pointer" style={{ position: 'fixed', left: 0, top: 0, width: 18, height: 18, background: '#ffb86b', borderRadius: 9, boxShadow: '0 0 12px rgba(255,184,107,0.9)', transform: 'translate(-9999px,-9999px)', transition: 'left 450ms cubic-bezier(.2,.9,.3,1), top 450ms cubic-bezier(.2,.9,.3,1), opacity 300ms', opacity: 0, zIndex: 9999 }} aria-hidden="true" />
  <div ref={highlightRef} className="tour-highlight" style={{ position: 'fixed', left: 0, top: 0, border: '2px solid rgba(255,184,107,0.95)', borderRadius: 8, boxShadow: '0 8px 30px rgba(255,184,107,0.08)', transform: 'none', transition: 'left 450ms cubic-bezier(.2,.9,.3,1), top 450ms cubic-bezier(.2,.9,.3,1), width 450ms, height 450ms, opacity 300ms', opacity: 0, pointerEvents: 'none', zIndex: 9998 }} aria-hidden="true" />

      {showEvac && (
        <div className="overlay">
          <div style={{ position: 'absolute', left: 12, right: 12, bottom: 16, height: 4, background: 'repeating-linear-gradient(90deg,#15a34a 0 18px, transparent 18px 24px)' }}></div>
          {/* Bottom exits (existing) */}
          <div style={{ position: 'absolute', left: 12, bottom: 6, color: '#9fe3b5', fontSize: 12 }}><svg className="ic"><use href="#ic-exit" /></svg> Salida</div>
          <div style={{ position: 'absolute', right: 12, bottom: 6, color: '#9fe3b5', fontSize: 12 }}>Salida <svg className="ic"><use href="#ic-exit" /></svg></div>

          {/* Additional exits: middle-left and middle-right */}
          <div style={{ position: 'absolute', left: 12, top: '40%', color: '#9fe3b5', fontSize: 12, transform: 'translateY(-50%)' }}><svg className="ic"><use href="#ic-exit" /></svg> Salida</div>
          <div style={{ position: 'absolute', right: 12, top: '40%', color: '#9fe3b5', fontSize: 12, transform: 'translateY(-50%)', textAlign: 'right' }}>Salida <svg className="ic"><use href="#ic-exit" /></svg></div>

          {/* Optional top exits near server/entry area */}
          <div style={{ position: 'absolute', left: 12, top: 18, color: '#9fe3b5', fontSize: 12 }}><svg className="ic"><use href="#ic-exit" /></svg> Salida</div>
          <div style={{ position: 'absolute', right: 12, top: 18, color: '#9fe3b5', fontSize: 12, textAlign: 'right' }}>Salida <svg className="ic"><use href="#ic-exit" /></svg></div>
        </div>
      )}

      {showAccess && (
        <div className="overlay">
          {/* Lectores en entradas clave */}
          <div className="reader" style={{ left: 24, top: 92 }} title="Control de acceso — Entrada principal">
            <svg className="ic" style={{ width: 14, height: 14 }}><use href="#ic-lock" /></svg>
          </div>
          <div className="reader" style={{ right: 24, top: 92 }} title="Control de acceso — Salida">
            <svg className="ic" style={{ width: 14, height: 14 }}><use href="#ic-lock" /></svg>
          </div>
          <div className="reader" style={{ left: 24, top: 280 }} title="Sala de Servidores — Biométrico">
            <svg className="ic" style={{ width: 14, height: 14 }}><use href="#ic-id" /></svg>
          </div>
        </div>
      )}

      <div className="controls">
        <Toggle id="air2" label="Flujo de aire" checked={showAir} onChange={setShowAir} />
        <Toggle id="cctv2" label="CCTV" checked={showCctv} onChange={setShowCctv} />
        <Toggle id="tray2" label="Bandeja" checked={showTray} onChange={setShowTray} />
        <Toggle id="evac2" label="Evac." checked={showEvac} onChange={setShowEvac} />
      </div>

      <div className="note">Segmentación: <strong>VLAN Voz (PoE)</strong> · <strong>VLAN Datos</strong> · IDS/IPS · Backups incrementales diarios</div>

      <CompliancePanel open={showPanel} onClose={() => setShowPanel(false)} />
      <SpecsModal open={tourOpen} id={currentId} onClose={() => setTourOpen(false)} onPrev={prev} onNext={next} />

      {/* SVG symbols */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <symbol id="ic-rack" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M7 7h10M7 12h10M7 17h10"></path></symbol>
          <symbol id="ic-switch" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2"></rect><path d="M7 12h.01M11 12h.01M15 12h.01"></path></symbol>
          <symbol id="ic-patch" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M8 9v6M12 9v6M16 9v6"></path></symbol>
          <symbol id="ic-shield" viewBox="0 0 24 24"><path d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z"></path></symbol>
          <symbol id="ic-kvm" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"></rect><path d="M7 10h10M7 14h6"></path></symbol>
          <symbol id="ic-server" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="6" rx="2"></rect><rect x="4" y="14" width="16" height="6" rx="2"></rect><path d="M8 7h.01M8 17h.01"></path></symbol>
          <symbol id="ic-nas" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="2"></rect><path d="M8 9h8M8 15h8"></path></symbol>
          <symbol id="ic-ac" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><path d="M12 4v4M12 16v4M4 12h4M16 12h4M8 8l2 2M14 14l2 2M16 8l-2 2M10 14l-2 2"></path></symbol>
          <symbol id="ic-thermo" viewBox="0 0 24 24"><path d="M10 14a4 4 0 104 0V5a2 2 0 10-4 0v9z"></path><circle cx="12" cy="18" r="2"></circle></symbol>
          <symbol id="ic-snow" viewBox="0 0 24 24"><path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1L19.1 4.9"></path></symbol>
          <symbol id="ic-fire" viewBox="0 0 24 24"><path d="M12 3s6 5 6 10a6 6 0 11-12 0c0-5 6-10 6-10z"></path></symbol>
          <symbol id="ic-gas" viewBox="0 0 24 24"><path d="M6 21h12l-2-9H8l-2 9z"></path><path d="M9 12c0-3 3-6 3-6s3 3 3 6"></path></symbol>
          <symbol id="ic-cctv" viewBox="0 0 24 24"><path d="M3 10l8-4 10 6-8 4-10-6z"></path><path d="M13 12l4 6"></path><rect x="2" y="9" width="6" height="4" rx="1"></rect></symbol>
          <symbol id="ic-poe" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2"></rect><path d="M10 7V5a2 2 0 114 0v2"></path></symbol>
          <symbol id="ic-power" viewBox="0 0 24 24"><path d="M12 2v8"></path><circle cx="12" cy="14" r="8"></circle></symbol>
          <symbol id="ic-ups" viewBox="0 0 24 24"><rect x="5" y="6" width="14" height="12" rx="2"></rect><path d="M9 12h6M12 9v6"></path></symbol>
          <symbol id="ic-battery" viewBox="0 0 24 24"><rect x="3" y="8" width="16" height="8" rx="2"></rect><path d="M19 10v4"></path></symbol>
          <symbol id="ic-ground" viewBox="0 0 24 24"><path d="M12 3v18M6 19h12M8 15h8"></path></symbol>
          <symbol id="ic-gen" viewBox="0 0 24 24"><circle cx="8" cy="16" r="3"></circle><circle cx="16" cy="8" r="3"></circle><path d="M6 14L4 12h5M18 10l2 2h-5"></path></symbol>
          <symbol id="ic-ats" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M8 12h8M12 9v6"></path></symbol>
          <symbol id="ic-tank" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2"></rect><path d="M9 8h6M9 12h6M9 16h6"></path></symbol>
          <symbol id="ic-monitor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M8 20h8"></path></symbol>
          <symbol id="ic-headset" viewBox="0 0 24 24"><path d="M12 3a8 8 0 00-8 8v5a2 2 0 002 2h2v-6H6v-1a6 6 0 1112 0v1h-2v6h2a2 2 0 002-2v-5a8 8 0 00-8-8z"></path></symbol>
          <symbol id="ic-report" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M8 8h8M8 12h8M8 16h5"></path></symbol>
          <symbol id="ic-analytics" viewBox="0 0 24 24"><path d="M4 19h16"></path><rect x="6" y="11" width="3" height="6"></rect><rect x="11" y="7" width="3" height="10"></rect><rect x="16" y="9" width="3" height="8"></rect></symbol>
          <symbol id="ic-record" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="3"></circle></symbol>
          <symbol id="ic-users" viewBox="0 0 24 24"><circle cx="8" cy="9" r="3"></circle><circle cx="16" cy="9" r="3"></circle><path d="M4 20v-2a4 4 0 014-4m8 6v-2a4 4 0 00-4-4"></path></symbol>
          <symbol id="ic-desktop" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M8 20h8"></path></symbol>
          <symbol id="ic-phone" viewBox="0 0 24 24"><path d="M6 2h6a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"></path><path d="M8 18h2"></path></symbol>
          <symbol id="ic-cable" viewBox="0 0 24 24"><path d="M2 12h8a4 4 0 004-4V6m0 12v-2a4 4 0 014-4h4"></path></symbol>
          <symbol id="ic-exit" viewBox="0 0 24 24"><path d="M10 3H5a2 2 0 00-2 2v14a2 2 0 002 2h5"></path><path d="M15 12H8m7-3l3 3-3 3"></path></symbol>
          <symbol id="ic-lock" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 118 0v3"></path></symbol>
          <symbol id="ic-badge" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M12 7v2M8 12h8M8 16h8"></path></symbol>
          <symbol id="ic-id" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"></rect><circle cx="8" cy="12" r="2"></circle><path d="M12 10h6M12 14h6"></path></symbol>
          <symbol id="ic-qr" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1"></rect><rect x="13" y="3" width="8" height="8" rx="1"></rect><rect x="3" y="13" width="8" height="8" rx="1"></rect><path d="M16 13h5M16 18h5M13 16h3"></path></symbol>
        </defs>
      </svg>
    </div>
  )
}
