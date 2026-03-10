import { useState, useEffect } from "react";

// ============================================
// ACAXEE CRM DASHBOARD
// Design: Dark luxury rooftop — obsidian + gold
// ============================================

const MOCK_DATA = {
  stats: {
    conversacionesHoy: 24,
    reservacionesHoy: 11,
    mesasOcupadas: 8,
    mesasTotal: 42,
    contactosNuevos: 7,
    tasaConversion: 46,
  },
  campanas: [
    { nombre: "Sábado Show Fuego", clicks: 312, conversaciones: 87, reservaciones: 34, gasto: 1850, roas: 4.2 },
    { nombre: "Sunset Rooftop Marzo", clicks: 198, conversaciones: 54, reservaciones: 21, gasto: 1200, roas: 3.8 },
    { nombre: "Sushi Premium", clicks: 145, conversaciones: 41, reservaciones: 18, gasto: 900, roas: 4.6 },
    { nombre: "Cumpleaños VIP", clicks: 89, conversaciones: 28, reservaciones: 14, gasto: 600, roas: 5.1 },
  ],
  conversaciones: [
    { nombre: "María González", telefono: "669 123 4567", estado: "activa", campana: "Sábado Show Fuego", mensaje: "Hola, me gustaría reservar para el sábado...", hace: "2 min" },
    { nombre: "Carlos Mendoza", telefono: "669 234 5678", estado: "reservó", campana: "Sunset Rooftop Marzo", mensaje: "Perfecto, confirmamos para 4 personas a las 8pm", hace: "15 min" },
    { nombre: "Ana Ríos", telefono: "669 345 6789", estado: "activa", campana: "Sushi Premium", mensaje: "¿Tienen opciones sin gluten en el menú?", hace: "32 min" },
    { nombre: "Roberto Félix", telefono: "669 456 7890", estado: "escalada", campana: "Cumpleaños VIP", mensaje: "Necesito hablar con alguien de eventos...", hace: "1h" },
    { nombre: "Sofía Castro", telefono: "669 567 8901", estado: "reservó", campana: "Sábado Show Fuego", mensaje: "Confirmado para 2 el viernes, gracias!", hace: "2h" },
  ],
  reservaciones: [
    { nombre: "María González", personas: 4, fecha: "Sáb 14 Mar", hora: "20:00", mesa: 57, ocasion: "Cumpleaños", estado: "confirmada" },
    { nombre: "Carlos Mendoza", personas: 4, fecha: "Hoy", hora: "20:00", mesa: 28, ocasion: "Cena", estado: "confirmada" },
    { nombre: "Familia Herrera", personas: 6, fecha: "Hoy", hora: "14:00", mesa: 63, ocasion: "Aniversario", estado: "sentada" },
    { nombre: "Empresas Roca", personas: 8, fecha: "Mié 11 Mar", hora: "21:00", mesa: 54, ocasion: "Negocios", estado: "confirmada" },
    { nombre: "Laura Díaz", personas: 2, fecha: "Jue 12 Mar", hora: "19:30", mesa: 35, ocasion: "Cita", estado: "pendiente" },
  ],
  mesas: [
    // Zona terraza norte (vista panorámica)
    ...[26,27,28,58,56,57,67].map((n, i) => ({
      numero: n, zona: "terraza", estado: [0,2,5].includes(i) ? "ocupada" : i === 1 ? "reservada" : "disponible",
      capacidad: n === 57 ? 8 : 6, x: 20 + i * 11, y: 8
    })),
    // Zona interior
    ...[31,32,33,34,35,36].map((n, i) => ({
      numero: n, zona: "interior", estado: i === 0 ? "ocupada" : i === 3 ? "reservada" : "disponible",
      capacidad: 4, x: 30 + (i % 2) * 8, y: 35 + Math.floor(i / 2) * 12
    })),
    // Zona derecha vista
    ...[61,62,63,64,65,66].map((n, i) => ({
      numero: n, zona: "terraza", estado: [1,3].includes(i) ? "ocupada" : i === 0 ? "reservada" : "disponible",
      capacidad: 8, x: 86, y: 15 + i * 13
    })),
    // Mesas VIP
    ...[54,55].map((n, i) => ({
      numero: n, zona: "vip", estado: i === 0 ? "ocupada" : "disponible",
      capacidad: i === 0 ? 8 : 6, x: 76, y: 35 + i * 15
    })),
  ]
};

const ESTADO_COLORS = {
  activa: "#22c55e",
  reservó: "#3b82f6",
  escalada: "#f59e0b",
  resuelta: "#6b7280",
};

const MESA_COLORS = {
  disponible: "#1e293b",
  ocupada: "#7c2d12",
  reservada: "#1e3a5f",
  bloqueada: "#111827",
};

const MESA_BORDER = {
  disponible: "#334155",
  ocupada: "#ef4444",
  reservada: "#3b82f6",
  bloqueada: "#374151",
};

export default function AcaxeeDashboard() {
  const [tab, setTab] = useState("overview");
  const [hora, setHora] = useState(new Date());
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const mesasOcupadas = MOCK_DATA.mesas.filter(m => m.estado === "ocupada").length;
  const mesasDisponibles = MOCK_DATA.mesas.filter(m => m.estado === "disponible").length;
  const mesasReservadas = MOCK_DATA.mesas.filter(m => m.estado === "reservada").length;

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#080c14",
      minHeight: "100vh",
      color: "#e2e8f0",
      padding: 0,
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d1117 0%, #111827 100%)",
        borderBottom: "1px solid #1e293b",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #b8973a, #e8c96a)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "#080c14",
          }}>A</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.05em", color: "#f1f5f9" }}>ACAXEE</div>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.1em" }}>SKY TROPIC LOUNGE · CRM</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {["overview", "conversaciones", "mesas", "campanas"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: tab === t ? 600 : 400,
              background: tab === t ? "#1e293b" : "transparent",
              color: tab === t ? "#e8c96a" : "#64748b",
              transition: "all 0.15s",
              textTransform: "capitalize",
            }}>
              {t === "overview" ? "Resumen" : t === "mesas" ? "Mesas" : t === "campanas" ? "Campañas" : "Conversaciones"}
            </button>
          ))}
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 300, letterSpacing: "0.05em", color: "#f1f5f9" }}>
            {hora.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div style={{ fontSize: 11, color: "#64748b" }}>
            {hora.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "short" })}
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Conversaciones hoy", value: MOCK_DATA.stats.conversacionesHoy, sub: "+3 vs ayer", color: "#22c55e" },
                { label: "Reservaciones hoy", value: MOCK_DATA.stats.reservacionesHoy, sub: "de 24 conv.", color: "#3b82f6" },
                { label: "Mesas ocupadas", value: `${mesasOcupadas}/${MOCK_DATA.mesas.length}`, sub: `${mesasReservadas} reservadas`, color: "#ef4444" },
                { label: "Contactos nuevos", value: MOCK_DATA.stats.contactosNuevos, sub: "desde anuncios", color: "#b8973a" },
                { label: "Tasa conversión", value: `${MOCK_DATA.stats.tasaConversion}%`, sub: "conv → reserva", color: "#a855f7" },
                { label: "Gasto META hoy", value: "$4,550", sub: "4 campañas", color: "#f59e0b" },
              ].map((kpi, i) => (
                <div key={i} style={{
                  background: "linear-gradient(135deg, #0d1117 0%, #111827 100%)",
                  border: "1px solid #1e293b",
                  borderRadius: 12,
                  padding: "16px 20px",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: kpi.color, opacity: 0.6,
                  }} />
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6, letterSpacing: "0.05em" }}>
                    {kpi.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: 11, color: kpi.color, marginTop: 6 }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Grid: Conversaciones + Reservaciones */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Conversaciones activas */}
              <div style={{
                background: "linear-gradient(135deg, #0d1117 0%, #111827 100%)",
                border: "1px solid #1e293b",
                borderRadius: 12,
                overflow: "hidden",
              }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Conversaciones Activas</span>
                  <span style={{ background: "#22c55e20", color: "#22c55e", padding: "2px 10px", borderRadius: 20, fontSize: 12 }}>
                    {MOCK_DATA.conversaciones.filter(c => c.estado === "activa").length} activas
                  </span>
                </div>
                {MOCK_DATA.conversaciones.map((conv, i) => (
                  <div key={i} style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #0f172a",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    cursor: "pointer",
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `hsl(${i * 60}, 40%, 20%)`,
                      border: `2px solid ${ESTADO_COLORS[conv.estado]}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 600, flexShrink: 0, color: "#e2e8f0",
                    }}>{conv.nombre[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{conv.nombre}</span>
                        <span style={{ fontSize: 11, color: "#475569" }}>{conv.hace}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {conv.mensaje}
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                        <span style={{
                          fontSize: 10, padding: "1px 8px", borderRadius: 10,
                          background: `${ESTADO_COLORS[conv.estado]}20`,
                          color: ESTADO_COLORS[conv.estado],
                        }}>{conv.estado}</span>
                        <span style={{ fontSize: 10, color: "#475569" }}>📢 {conv.campana}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reservaciones del día */}
              <div style={{
                background: "linear-gradient(135deg, #0d1117 0%, #111827 100%)",
                border: "1px solid #1e293b",
                borderRadius: 12,
                overflow: "hidden",
              }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Próximas Reservaciones</span>
                  <span style={{ background: "#3b82f620", color: "#3b82f6", padding: "2px 10px", borderRadius: 20, fontSize: 12 }}>
                    {MOCK_DATA.reservaciones.length} total
                  </span>
                </div>
                {MOCK_DATA.reservaciones.map((res, i) => (
                  <div key={i} style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #0f172a",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{res.nombre}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {res.fecha} · {res.hora} · {res.personas} personas
                      </div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                        Mesa {res.mesa} · {res.ocasion}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, padding: "3px 10px", borderRadius: 20,
                      background: res.estado === "sentada" ? "#22c55e20" : res.estado === "confirmada" ? "#3b82f620" : "#f59e0b20",
                      color: res.estado === "sentada" ? "#22c55e" : res.estado === "confirmada" ? "#3b82f6" : "#f59e0b",
                    }}>{res.estado}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* MESAS */}
        {tab === "mesas" && (
          <div>
            {/* Leyenda */}
            <div style={{ display: "flex", gap: 24, marginBottom: 20, alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>MAPA DE MESAS — ACAXEE ROOF TOP</span>
              <div style={{ flex: 1 }} />
              {[
                { estado: "disponible", color: "#334155", label: `Disponible (${mesasDisponibles})` },
                { estado: "ocupada", color: "#ef4444", label: `Ocupada (${mesasOcupadas})` },
                { estado: "reservada", color: "#3b82f6", label: `Reservada (${mesasReservadas})` },
              ].map(l => (
                <div key={l.estado} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: l.color, border: `2px solid ${l.color}` }} />
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Mapa */}
            <div style={{
              background: "linear-gradient(135deg, #0d1117 0%, #0f172a 100%)",
              border: "1px solid #1e293b",
              borderRadius: 16,
              padding: 24,
              position: "relative",
              height: 520,
              overflow: "hidden",
            }}>
              {/* Label vista */}
              <div style={{
                position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
                fontSize: 11, color: "#334155", letterSpacing: "0.2em",
              }}>◂ VISTA PANORÁMICA MAZATLÁN ▸</div>

              {/* Línea del mar */}
              <div style={{
                position: "absolute", top: 40, left: 0, right: 0, height: 1,
                background: "linear-gradient(90deg, transparent, #1e3a5f, transparent)",
              }} />

              {MOCK_DATA.mesas.map(mesa => {
                const isVIP = mesa.zona === "vip";
                const size = mesa.capacidad >= 8 ? 56 : mesa.capacidad >= 6 ? 48 : 40;

                return (
                  <div
                    key={mesa.numero}
                    onClick={() => setMesaSeleccionada(mesa.numero === mesaSeleccionada ? null : mesa.numero)}
                    style={{
                      position: "absolute",
                      left: `${mesa.x}%`,
                      top: `${mesa.y + 8}%`,
                      width: size,
                      height: size,
                      borderRadius: "50%",
                      background: MESA_COLORS[mesa.estado],
                      border: `2px solid ${mesa.numero === mesaSeleccionada ? "#e8c96a" : MESA_BORDER[mesa.estado]}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transform: "translate(-50%, -50%)",
                      transition: "all 0.2s",
                      boxShadow: mesa.numero === mesaSeleccionada
                        ? "0 0 0 3px #e8c96a40, 0 4px 20px #e8c96a20"
                        : mesa.estado === "ocupada"
                          ? "0 0 12px #ef444430"
                          : "none",
                      zIndex: mesa.numero === mesaSeleccionada ? 10 : 1,
                    }}
                  >
                    {isVIP && (
                      <div style={{ fontSize: 8, color: "#e8c96a", letterSpacing: "0.1em", marginBottom: -2 }}>VIP</div>
                    )}
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0" }}>{mesa.numero}</div>
                    <div style={{ fontSize: 9, color: "#64748b" }}>{mesa.capacidad}p</div>
                  </div>
                );
              })}

              {/* Panel info mesa seleccionada */}
              {mesaSeleccionada && (() => {
                const mesa = MOCK_DATA.mesas.find(m => m.numero === mesaSeleccionada);
                const reserva = MOCK_DATA.reservaciones.find(r => r.mesa === mesaSeleccionada);
                return mesa ? (
                  <div style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    background: "#0d1117",
                    border: "1px solid #e8c96a40",
                    borderRadius: 12,
                    padding: "16px 20px",
                    minWidth: 200,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#e8c96a", marginBottom: 8 }}>
                      Mesa {mesa.numero}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
                      Zona: <span style={{ color: "#e2e8f0" }}>{mesa.zona}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
                      Capacidad: <span style={{ color: "#e2e8f0" }}>{mesa.capacidad} personas</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
                      Estado: <span style={{ color: MESA_BORDER[mesa.estado] }}>{mesa.estado}</span>
                    </div>
                    {reserva && (
                      <div style={{ fontSize: 12, color: "#64748b", borderTop: "1px solid #1e293b", paddingTop: 8 }}>
                        {reserva.nombre} · {reserva.hora} · {reserva.personas}p
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      {["disponible", "ocupada", "reservada"].map(e => (
                        <button key={e} style={{
                          flex: 1, padding: "4px 0", borderRadius: 6, border: "none", cursor: "pointer",
                          fontSize: 10, fontWeight: mesa.estado === e ? 700 : 400,
                          background: mesa.estado === e ? MESA_BORDER[e] + "30" : "#1e293b",
                          color: mesa.estado === e ? MESA_BORDER[e] : "#64748b",
                        }}>{e.charAt(0).toUpperCase() + e.slice(1)}</button>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}

        {/* CAMPAÑAS META */}
        {tab === "campanas" && (
          <div>
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#f1f5f9" }}>Atribución META Ads</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>De qué anuncio viene cada reservación</div>
              </div>
            </div>

            {/* Tabla campañas */}
            <div style={{
              background: "linear-gradient(135deg, #0d1117 0%, #111827 100%)",
              border: "1px solid #1e293b",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 20,
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                padding: "12px 20px",
                borderBottom: "1px solid #1e293b",
                fontSize: 11,
                color: "#475569",
                letterSpacing: "0.08em",
              }}>
                {["CAMPAÑA", "CLICKS", "CONVERSACIONES", "RESERVACIONES", "GASTO", "ROAS"].map(h => (
                  <div key={h}>{h}</div>
                ))}
              </div>
              {MOCK_DATA.campanas.map((c, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                  padding: "16px 20px",
                  borderBottom: "1px solid #0f172a",
                  alignItems: "center",
                  cursor: "pointer",
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.nombre}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>Meta Ads · Activa</div>
                  </div>
                  <div style={{ color: "#94a3b8" }}>{c.clicks.toLocaleString()}</div>
                  <div style={{ color: "#3b82f6" }}>{c.conversaciones}</div>
                  <div style={{ color: "#22c55e" }}>{c.reservaciones}</div>
                  <div style={{ color: "#94a3b8" }}>${c.gasto.toLocaleString()}</div>
                  <div>
                    <span style={{
                      background: c.roas >= 4.5 ? "#22c55e20" : c.roas >= 3.5 ? "#3b82f620" : "#ef444420",
                      color: c.roas >= 4.5 ? "#22c55e" : c.roas >= 3.5 ? "#3b82f6" : "#ef4444",
                      padding: "3px 10px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                    }}>{c.roas}x</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Flujo de atribución */}
            <div style={{
              background: "linear-gradient(135deg, #0d1117 0%, #111827 100%)",
              border: "1px solid #1e293b",
              borderRadius: 12,
              padding: 24,
            }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: "#94a3b8" }}>FUNNEL DE CONVERSIÓN</div>
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                {[
                  { label: "Impresiones", value: "48,200", color: "#475569", pct: 100 },
                  { label: "Clicks al AD", value: "744", color: "#b8973a", pct: 1.5 },
                  { label: "WhatsApp", value: "210", color: "#3b82f6", pct: 28 },
                  { label: "Reservaron", value: "87", color: "#22c55e", pct: 41 },
                ].map((step, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                      height: 80 * (step.pct / 100) + 20,
                      background: `${step.color}30`,
                      border: `1px solid ${step.color}`,
                      borderRadius: 8,
                      margin: "0 4px",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      paddingBottom: 8,
                      minHeight: 30,
                    }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: step.color }}>{step.value}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>{step.label}</div>
                    {i > 0 && (
                      <div style={{ fontSize: 10, color: step.color }}>{step.pct}%</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONVERSACIONES */}
        {tab === "conversaciones" && (
          <div style={{
            background: "linear-gradient(135deg, #0d1117 0%, #111827 100%)",
            border: "1px solid #1e293b",
            borderRadius: 12,
            overflow: "hidden",
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Todas las Conversaciones</span>
              {["todas", "activas", "reservaron", "escaladas"].map(f => (
                <button key={f} style={{
                  padding: "4px 14px", borderRadius: 20, border: "1px solid #1e293b",
                  background: f === "todas" ? "#1e293b" : "transparent",
                  color: f === "todas" ? "#e8c96a" : "#64748b",
                  fontSize: 12, cursor: "pointer",
                }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
            </div>
            {MOCK_DATA.conversaciones.map((conv, i) => (
              <div key={i} style={{
                padding: "16px 20px",
                borderBottom: "1px solid #0f172a",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                cursor: "pointer",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: `hsl(${i * 60}, 40%, 15%)`,
                  border: `2px solid ${ESTADO_COLORS[conv.estado]}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, flexShrink: 0, color: "#e2e8f0",
                }}>{conv.nombre[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{conv.nombre}</span>
                    <span style={{ fontSize: 12, color: "#475569" }}>{conv.hace}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>{conv.mensaje}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{
                      fontSize: 11, padding: "2px 10px", borderRadius: 10,
                      background: `${ESTADO_COLORS[conv.estado]}20`,
                      color: ESTADO_COLORS[conv.estado],
                    }}>{conv.estado}</span>
                    <span style={{ fontSize: 11, color: "#475569", padding: "2px 0" }}>
                      📢 {conv.campana}
                    </span>
                    <span style={{ fontSize: 11, color: "#475569", padding: "2px 0" }}>
                      📱 {conv.telefono}
                    </span>
                  </div>
                </div>
                <button style={{
                  padding: "6px 14px", borderRadius: 8,
                  border: "1px solid #1e293b", background: "transparent",
                  color: "#64748b", fontSize: 12, cursor: "pointer",
                }}>Ver chat</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
