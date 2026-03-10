# ============================================
# ACAXEE CRM - VARIABLES DE ENTORNO
# Copia este archivo como .env y llena los valores
# NUNCA subas el .env a GitHub
# ============================================

# WhatsApp Business API (Meta Developers)
WA_VERIFY_TOKEN=acaxee_webhook_2026        # Invéntalo tú, lo usarás al configurar el webhook en Meta
WA_ACCESS_TOKEN=                            # Token de acceso permanente de Meta (lo obtienes al registrar el número)
WA_PHONE_NUMBER_ID=                         # ID del número de WhatsApp en Meta Developers

# Supabase
SUPABASE_URL=https://xxxx.supabase.co       # URL de tu proyecto en supabase.com
SUPABASE_SERVICE_KEY=                       # Service role key (Settings > API en Supabase)

# Anthropic
ANTHROPIC_API_KEY=                          # Tu API key de console.anthropic.com

# Servidor
PORT=3000

// ============================================
// ACAXEE - AGENTE WHATSAPP
// Webhook para recibir y responder mensajes
// Stack: Node.js + Express + Supabase + Claude API
// ============================================

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(express.json());

// ============================================
// CONFIGURACIÓN — llenar con tus credenciales
// ============================================
const config = {
  // Meta / WhatsApp
  WA_VERIFY_TOKEN: process.env.WA_VERIFY_TOKEN,       // lo inventas tú, ej: "acaxee_2026"
  WA_ACCESS_TOKEN: process.env.WA_ACCESS_TOKEN,       // token de Meta Developers
  WA_PHONE_NUMBER_ID: process.env.WA_PHONE_NUMBER_ID, // ID del número en Meta

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

  // Anthropic
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
};

// Clientes
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);
const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

// ============================================
// CONOCIMIENTO DE ACAXEE
// Base de conocimiento completa para el agente
// ============================================
const ACAXEE_KNOWLEDGE = `
Eres el asistente virtual de ACAXEE Sky Tropic Lounge, un restaurante rooftop premium en Mazatlán, Sinaloa, México.

SOBRE ACAXEE:
- Ubicación: Blvd. Marina Mazatlán 48, Mazatlán, Sinaloa (junto a la Marina)
- Teléfono: 669 225 4659
- Sitio web: acaxeemazatlan.com
- Instagram: @acaxeemx
- Tipo: Rooftop con vista 360° al mar — la mejor vista de Sinaloa
- Concepto: Mixología de autor, sushi y cocina de mariscos frescos, ambiente tropical sofisticado
- Especial: Todos los sábados hay show de fuego, zancos, performance de mimos, pirotecnia en fechas especiales
- Ticket promedio: $310 - $500 MXN por persona
- Valoración: 4.7 estrellas en Google y OpenTable

MENÚ COMPLETO:

ENTRADAS:
- Espíritu Pacífico $145 — camarón cocido, crudo, seco y pulpo en cóctel picosito con pepino y cebolla morada
- Dumplings Wonton $195 — 7 piezas rellenas de philadelphia y camarón
- Platón Acaxee con Callo $415 — aguachile, camarón cocido, callo y pulpo con pepino y cebolla morada
- Platón Acaxee $345 — aguachile, camarón cocido y pulpo
- Sashimi de Atún $230 — láminas de atún fresco (200g) en salsa especial
- Curricanes Acaxee $209 — kanikama con atún, aderezo de cilantro y aguacate, aceite de ajonjolí y salsa de anguila
- Chorizo Argentino $215 — chorizo (300g) a las brasas con guacamole y chimichurri
- Camarones Roca $275 — camarones (200g) en salsa especial y salsa de anguila
- Carnitas de Atún $270 — lomo de atún (200g) marinado y frito con guacamole
- Chicharrones de Rib Eye $370 — cubos de Rib Eye (230g) en ponzu, fritos, con guacamole
- Papas a la Francesa $150 — papa natural (300g) frita con parmesano
- Boneless $230 — pechuga de pollo (230g), salsa buffalo o BBQ
- Guacamole $150 — con totopos

TOSTADAS:
- Tostada Aguachile Salsa Verde $125 — camarón crudo (80g) en salsa verde sobre aguacate
- Tostada Aguachile Salsa Negra $125 — camarón crudo (80g) en salsa negra sobre aguacate
- Tostada Aguachile Salsa Roja $125 — camarón crudo (80g) en salsa roja sobre aguacate
- Tostada Mix de Camarón $155 — camarón crudo y cocido en ceviche con salsa picosita de camarón seco
- Tostada Cama/Callo $200 — ceviche de camarón cocido con láminas de callo de hacha
- Tostada Tuna $155 — cubos de atún marinado (100g), aguacate en tostada de wonton

CEVICHES & AGUACHILES:
- Ceviche Especial $415 — camarón crudo y cocido, pulpo y callo de hacha (380g)
- Ceviche Mixto $260 — camarón cocido y crudo (200g) con mix de vegetales
- Ceviche de Atún $230 — cubos de atún (200g) con aguacate
- Ceviche de Camarón $245 — camarón crudo (220g) con salsa negra
- Ceviche de Camarón Cocido $260 — camarón cocido (220g)
- Ceviche de Pulpo $260 — pulpo cocido (220g)
- Aguachile Verde $230 — camarón mariposeado (200g) en salsa verde
- Aguachile Negro $230 — camarón mariposeado (200g) en salsa negra
- Aguachile Mixto $230 — camarón mariposeado (200g) en salsa verde y negra

SUSHI:
- Hikari Fune $515 — barco de sushi con dos rollos a elegir (para compartir)
- Tuna Roll $230 — envuelto en lomo de atún, relleno de camarón cocido, pepino y philadelphia
- Sushi VIP $265 — camarón cocido, aguacate, pepino y philadelphia, envuelto en aguacate/salmón/atún, topping spicy pulpo
- Kraken Roll $240 — carnitas de pulpo (90g) y philadelphia, dip de jalapeño y cebolla frita
- Kraby Roll $245 — salmón, aguacate y filadelfia, forrado de kanikama con topping de carnitas de salmón
- Fire Salmon Roll $250 — kanikama, aguacate y filadelfia, forrado de salmón, aderezo dragon y salsa anguila
- Monkey Roll $235 — camarón empanizado, aguacate y filadelfia forrado de plátano macho frito
- Sushi Tsuna $230 — alga por fuera, lomo de atún (200g) con topping de cubos de atún marinado

AL GRILL:
- Porterhouse $1,500 — 900g Sterling Silver High Choice con papa al horno y vegetales
- Rib Eye Premium $610 — 320g Choice al grill con 2 guarniciones
- Rib Eye al Grill $450 — 320g con vegetales salteados y guacamole
- Quesadillas de Rib Eye $285 — tortilla de maíz azul con costra de queso, rib eye (200g) y vegetales
- Aguachile de Rib Eye $440 — rib eye (320g) al grill con salsa ponzu y mix de vegetales
- Especial de Salmón $399 — puré de papa, salmón (220g) en miel de agave, vegetales en vino tinto

HAMBURGUESAS:
- Hamburguesa Acaxee $299 — res (200g) con chorizo argentino, aros de cebolla y guacamole + papas
- Hamburguesa Mixta $295 — res (200g) con camarones, queso pepper jack, tocino + papas
- Hamburguesa de Res $275 — res (200g), tocino, queso pepper jack + papas
- Hamburguesa de Atún $275 — medallón de atún (200g), tocino, vegetales y guacamole + papas

POSTRES:
- Trilogía de Pays $195 — pays de guayaba, plátano y fresa
- Crunch & Cream $150 — galleta casera con chispas de chocolate y gelato

REGLAS DE COMPORTAMIENTO:
1. Siempre saluda con calidez y personalidad — eres parte de la experiencia Acaxee
2. Si el cliente pregunta por reservaciones, recopila: nombre, fecha, hora, número de personas y ocasión especial
3. Si mencionan alergias o restricciones, tómalo en cuenta y sugiere opciones seguras
4. Cuando sea sábado, menciona proactivamente el show nocturno
5. Para grupos de 6+, sugiere el Hikari Fune o el Platón Acaxee
6. Si no puedes resolver algo, ofrece conectar con el equipo de Acaxee
7. Nunca inventes precios ni platillos que no estén en este menú
8. Habla en español mexicano, con calidez y profesionalismo — no seas robótico
9. Si el cliente viene de un anuncio específico (lo sabrás por el contexto), puedes hacer referencia a la promoción si aplica
10. Siempre confirma los datos de reservación antes de registrarlos

HORARIOS APROXIMADOS:
- Martes a Domingo
- Comida: 13:00 - 17:00
- Cena: 18:00 - 23:00 (viernes y sábados hasta medianoche)
- Lunes cerrado

NOTAS IMPORTANTES:
- Ingredientes del mar sujetos a disponibilidad climática y estacional
- Consumo de productos crudos bajo responsabilidad del comensal
- Informar alergias antes de ordenar
- Se recomienda reservar, especialmente viernes y sábados
`;

// ============================================
// VERIFICACIÓN DEL WEBHOOK (Meta lo requiere)
// ============================================
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.WA_VERIFY_TOKEN) {
    console.log('✅ Webhook verificado por Meta');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ============================================
// RECEPCIÓN DE MENSAJES
// ============================================
app.post('/webhook', async (req, res) => {
  res.sendStatus(200); // Responder rápido a Meta

  try {
    const body = req.body;
    if (body.object !== 'whatsapp_business_account') return;

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;
        if (!value.messages) continue;

        for (const message of value.messages) {
          if (message.type !== 'text') continue; // Por ahora solo texto

          const telefono = message.from;
          const texto = message.text.body;
          const waMessageId = message.id;

          // Extraer UTMs del contexto del mensaje si vienen
          const referral = message.referral || null;

          await procesarMensaje(telefono, texto, waMessageId, referral);
        }
      }
    }
  } catch (error) {
    console.error('Error procesando webhook:', error);
  }
});

// ============================================
// LÓGICA PRINCIPAL — procesar cada mensaje
// ============================================
async function procesarMensaje(telefono, texto, waMessageId, referral) {
  try {
    // 1. Verificar si ya procesamos este mensaje (evitar duplicados)
    const { data: msgExistente } = await supabase
      .from('mensajes')
      .select('id')
      .eq('wa_message_id', waMessageId)
      .single();

    if (msgExistente) return;

    // 2. Buscar o crear contacto
    let contacto = await obtenerOCrearContacto(telefono, referral);

    // 3. Buscar conversación activa o crear nueva
    let conversacion = await obtenerOCrearConversacion(contacto.id, referral);

    // 4. Guardar mensaje entrante
    await supabase.from('mensajes').insert({
      conversacion_id: conversacion.id,
      contacto_id: contacto.id,
      direccion: 'entrante',
      contenido: texto,
      remitente: 'cliente',
      wa_message_id: waMessageId,
    });

    // 5. Obtener historial de la conversación
    const historial = await obtenerHistorial(conversacion.id);

    // 6. Generar respuesta con Claude
    const respuesta = await generarRespuesta(historial, contacto);

    // 7. Guardar respuesta del bot
    await supabase.from('mensajes').insert({
      conversacion_id: conversacion.id,
      contacto_id: contacto.id,
      direccion: 'saliente',
      contenido: respuesta,
      remitente: 'bot',
    });

    // 8. Enviar respuesta por WhatsApp
    await enviarMensajeWA(telefono, respuesta);

    // 9. Actualizar actividad del contacto
    await supabase
      .from('contactos')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', contacto.id);

    // 10. Log del evento
    await supabase.from('eventos').insert({
      tipo: 'mensaje_procesado',
      entidad: 'conversacion',
      entidad_id: conversacion.id,
      descripcion: `Mensaje de ${telefono}: "${texto.substring(0, 50)}..."`,
    });

  } catch (error) {
    console.error(`Error procesando mensaje de ${telefono}:`, error);
  }
}

// ============================================
// OBTENER O CREAR CONTACTO
// ============================================
async function obtenerOCrearContacto(telefono, referral) {
  // Buscar contacto existente
  const { data: existente } = await supabase
    .from('contactos')
    .select('*')
    .eq('telefono', telefono)
    .single();

  if (existente) return existente;

  // Crear nuevo contacto — capturar UTMs si vienen del anuncio
  const nuevoContacto = {
    telefono,
    etiqueta: 'nuevo',
  };

  // Si el mensaje viene de un click en un anuncio de Meta
  if (referral) {
    nuevoContacto.utm_source = referral.source || 'facebook';
    nuevoContacto.utm_medium = referral.type || 'paid';
    nuevoContacto.ad_id = referral.ad_id || null;
    nuevoContacto.campaign_id = referral.ads_context_data?.ad_title || null;
    nuevoContacto.primer_contacto_url = referral.source_url || null;
  }

  const { data: creado } = await supabase
    .from('contactos')
    .insert(nuevoContacto)
    .select()
    .single();

  // Log de nuevo contacto
  await supabase.from('eventos').insert({
    tipo: 'nuevo_contacto',
    entidad: 'contacto',
    entidad_id: creado.id,
    descripcion: `Nuevo contacto: ${telefono}`,
    metadata: { referral },
  });

  return creado;
}

// ============================================
// OBTENER O CREAR CONVERSACIÓN ACTIVA
// ============================================
async function obtenerOCrearConversacion(contactoId, referral) {
  // Buscar conversación activa (menos de 24 horas)
  const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: activa } = await supabase
    .from('conversaciones')
    .select('*')
    .eq('contacto_id', contactoId)
    .eq('estado', 'activa')
    .gte('updated_at', hace24h)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (activa) return activa;

  // Crear nueva conversación
  const nueva = {
    contacto_id: contactoId,
    estado: 'activa',
    canal: 'whatsapp',
  };

  if (referral) {
    nueva.utm_campaign = referral.ads_context_data?.ad_title || null;
    nueva.ad_id = referral.ad_id || null;
  }

  const { data: creada } = await supabase
    .from('conversaciones')
    .insert(nueva)
    .select()
    .single();

  return creada;
}

// ============================================
// OBTENER HISTORIAL DE CONVERSACIÓN
// ============================================
async function obtenerHistorial(conversacionId) {
  const { data: mensajes } = await supabase
    .from('mensajes')
    .select('*')
    .eq('conversacion_id', conversacionId)
    .order('created_at', { ascending: true })
    .limit(20); // Últimos 20 mensajes

  return (mensajes || []).map(m => ({
    role: m.direccion === 'entrante' ? 'user' : 'assistant',
    content: m.contenido,
  }));
}

// ============================================
// GENERAR RESPUESTA CON CLAUDE
// ============================================
async function generarRespuesta(historial, contacto) {
  // Contexto personalizado del contacto
  let contextoContacto = '';
  if (contacto.nombre) {
    contextoContacto += `\nNombre del cliente: ${contacto.nombre}`;
  }
  if (contacto.visitas_totales > 0) {
    contextoContacto += `\nCliente recurrente con ${contacto.visitas_totales} visitas previas`;
  }
  if (contacto.etiqueta === 'vip') {
    contextoContacto += `\nCliente VIP — trato especial`;
  }
  if (contacto.utm_campaign) {
    contextoContacto += `\nVino del anuncio: ${contacto.utm_campaign}`;
  }

  const systemPrompt = ACAXEE_KNOWLEDGE + (contextoContacto ? `\n\nCONTEXTO DE ESTE CLIENTE:${contextoContacto}` : '');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: systemPrompt,
    messages: historial,
  });

  return response.content[0].text;
}

// ============================================
// ENVIAR MENSAJE POR WHATSAPP
// ============================================
async function enviarMensajeWA(telefono, mensaje) {
  const url = `https://graph.facebook.com/v19.0/${config.WA_PHONE_NUMBER_ID}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.WA_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: telefono,
      type: 'text',
      text: { body: mensaje },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Error enviando mensaje WA:', error);
    throw new Error(`WhatsApp API error: ${error}`);
  }

  return response.json();
}

// ============================================
// ENDPOINT PARA CREAR RESERVACIÓN MANUALMENTE
// (para usar desde el dashboard)
// ============================================
app.post('/api/reservaciones', async (req, res) => {
  try {
    const { contacto_id, fecha, hora, personas, mesa_numero, ocasion, notas, origen } = req.body;

    const { data, error } = await supabase
      .from('reservaciones')
      .insert({
        contacto_id,
        fecha,
        hora,
        personas,
        mesa_numero,
        ocasion,
        notas_especiales: notas,
        origen: origen || 'dashboard',
        estado: 'confirmada',
      })
      .select()
      .single();

    if (error) throw error;

    // Actualizar estado de la mesa
    if (mesa_numero) {
      await supabase
        .from('mesas')
        .update({ estado: 'reservada' })
        .eq('numero', mesa_numero);
    }

    res.json({ success: true, reservacion: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ENDPOINT PARA ACTUALIZAR ESTADO DE MESA
// (para la hostess en tiempo real)
// ============================================
app.patch('/api/mesas/:numero/estado', async (req, res) => {
  try {
    const { numero } = req.params;
    const { estado, contacto_id, personas } = req.body;

    await supabase
      .from('mesas')
      .update({ estado })
      .eq('numero', parseInt(numero));

    if (estado === 'ocupada' && contacto_id) {
      await supabase.from('sesiones_mesa').insert({
        mesa_numero: parseInt(numero),
        contacto_id,
        personas,
        hora_llegada: new Date().toISOString(),
        estado: 'activa',
      });
    }

    if (estado === 'disponible') {
      await supabase
        .from('sesiones_mesa')
        .update({ estado: 'completada', hora_salida: new Date().toISOString() })
        .eq('mesa_numero', parseInt(numero))
        .eq('estado', 'activa');
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ENDPOINT DE SALUD
// ============================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Acaxee CRM Agent', timestamp: new Date().toISOString() });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌮 Acaxee Agent corriendo en puerto ${PORT}`);
});

export default app;

-- ============================================
-- ACAXEE CRM - SCHEMA SUPABASE
-- ============================================

-- EXTENSIONES
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. CONTACTOS
-- Cada persona que escribe por WhatsApp
-- ============================================
create table contactos (
  id uuid primary key default uuid_generate_v4(),
  telefono text unique not null,
  nombre text,
  email text,
  
  -- Atribución META
  utm_source text,          -- ej: "facebook", "instagram"
  utm_medium text,          -- ej: "paid", "organic"
  utm_campaign text,        -- ej: "marzo_sushi"
  utm_content text,         -- ej: "video_rooftop_v2"
  utm_term text,
  ad_id text,               -- ID del anuncio específico de Meta
  campaign_id text,         -- ID de campaña
  adset_id text,            -- ID del conjunto de anuncios
  primer_contacto_url text, -- URL con UTMs completa
  
  -- Perfil del cliente
  etiqueta text default 'nuevo',   -- nuevo, recurrente, vip, critico, bloguero
  visitas_totales integer default 0,
  ultima_visita timestamp,
  notas text,
  
  -- Preferencias capturadas en conversación
  restricciones_dieta text[],   -- ["sin gluten", "vegetariano"]
  ocasiones_frecuentes text[],  -- ["aniversario", "negocios"]
  
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================
-- 2. CONVERSACIONES
-- Cada sesión de chat por WhatsApp
-- ============================================
create table conversaciones (
  id uuid primary key default uuid_generate_v4(),
  contacto_id uuid references contactos(id),
  
  estado text default 'activa',   -- activa, resuelta, escalada
  canal text default 'whatsapp',
  
  -- Atribución (copiada del contacto al momento del primer mensaje)
  utm_campaign text,
  utm_content text,
  ad_id text,
  
  -- Contexto de la conversación
  intencion text,   -- reservacion, menu, informacion, queja, otro
  resolucion text,  -- reservo, no_reservo, derivado_humano
  
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================
-- 3. MENSAJES
-- Cada mensaje individual
-- ============================================
create table mensajes (
  id uuid primary key default uuid_generate_v4(),
  conversacion_id uuid references conversaciones(id),
  contacto_id uuid references contactos(id),
  
  direccion text not null,   -- "entrante" (cliente) o "saliente" (bot/humano)
  contenido text not null,
  tipo text default 'texto', -- texto, imagen, audio, documento
  
  remitente text default 'bot',  -- bot, humano, cliente
  
  wa_message_id text,   -- ID de WhatsApp para no duplicar
  
  created_at timestamp default now()
);

-- ============================================
-- 4. RESERVACIONES
-- Reservas capturadas por el agente o el equipo
-- ============================================
create table reservaciones (
  id uuid primary key default uuid_generate_v4(),
  contacto_id uuid references contactos(id),
  conversacion_id uuid references conversaciones(id),
  
  -- Datos de la reserva
  fecha date not null,
  hora time not null,
  personas integer not null,
  turno text,   -- "turno_1" (comida), "turno_2" (cena)
  
  -- Asignación de mesa
  mesa_numero integer,
  zona text,   -- "terraza", "interior", "barra"
  
  -- Estado
  estado text default 'pendiente',  -- pendiente, confirmada, sentada, completada, cancelada, no_show
  
  -- Contexto especial
  ocasion text,          -- aniversario, cumpleaños, negocios, cita
  notas_especiales text, -- restricciones, peticiones, decoración
  
  -- Origen
  origen text default 'whatsapp',  -- whatsapp, opentable, telefono, walk_in
  
  -- Atribución META
  utm_campaign text,
  ad_id text,
  
  -- Recordatorio
  recordatorio_enviado boolean default false,
  
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================
-- 5. MESAS
-- Layout del restaurante para la hostess
-- ============================================
create table mesas (
  id uuid primary key default uuid_generate_v4(),
  numero integer unique not null,
  capacidad_min integer default 2,
  capacidad_max integer default 4,
  zona text,         -- "terraza", "interior", "barra", "vip"
  estado text default 'disponible',  -- disponible, ocupada, reservada, bloqueada
  pos_x float,       -- posición en el mapa visual
  pos_y float,
  forma text default 'redonda',  -- redonda, rectangular, barra
  activa boolean default true,
  notas text
);

-- ============================================
-- 6. SESIONES DE MESAS (ocupación en tiempo real)
-- ============================================
create table sesiones_mesa (
  id uuid primary key default uuid_generate_v4(),
  mesa_numero integer references mesas(numero),
  reservacion_id uuid references reservaciones(id),
  contacto_id uuid references contactos(id),
  
  hora_llegada timestamp,
  hora_salida timestamp,
  personas integer,
  
  estado text default 'activa',  -- activa, completada
  notas text,
  
  created_at timestamp default now()
);

-- ============================================
-- 7. CAMPAÑAS META (para el dashboard de atribución)
-- ============================================
create table campanas_meta (
  id uuid primary key default uuid_generate_v4(),
  campaign_id text unique,
  nombre text,
  objetivo text,
  estado text,
  presupuesto_diario decimal,
  fecha_inicio date,
  fecha_fin date,
  
  -- Métricas sincronizadas desde Meta API
  impresiones integer default 0,
  clics integer default 0,
  gasto decimal default 0,
  
  -- Métricas calculadas en nuestro sistema
  conversaciones_generadas integer default 0,
  reservaciones_generadas integer default 0,
  
  updated_at timestamp default now()
);

-- ============================================
-- 8. EVENTOS DEL SISTEMA (log de actividad)
-- ============================================
create table eventos (
  id uuid primary key default uuid_generate_v4(),
  tipo text,          -- nueva_conversacion, reservacion_creada, mesa_asignada, etc.
  entidad text,       -- contacto, reservacion, mesa
  entidad_id uuid,
  descripcion text,
  metadata jsonb,
  created_at timestamp default now()
);

-- ============================================
-- ÍNDICES para performance
-- ============================================
create index idx_contactos_telefono on contactos(telefono);
create index idx_contactos_ad_id on contactos(ad_id);
create index idx_mensajes_conversacion on mensajes(conversacion_id);
create index idx_reservaciones_fecha on reservaciones(fecha);
create index idx_reservaciones_estado on reservaciones(estado);
create index idx_mesas_estado on mesas(estado);

-- ============================================
-- DATOS INICIALES - MESAS DE ACAXEE ROOF TOP
-- (basado en el mapa de OpenTable)
-- ============================================
insert into mesas (numero, capacidad_min, capacidad_max, zona, pos_x, pos_y, forma) values
-- Columna izquierda (mesas pequeñas/individuales)
(1, 1, 2, 'interior', 5, 90, 'rectangular'),
(2, 1, 2, 'interior', 5, 80, 'rectangular'),
(3, 1, 2, 'interior', 5, 70, 'rectangular'),
(4, 1, 2, 'interior', 5, 60, 'rectangular'),
(5, 1, 2, 'interior', 5, 50, 'rectangular'),
(6, 1, 2, 'interior', 5, 15, 'rectangular'),
(7, 1, 2, 'interior', 7, 20, 'rectangular'),

-- Columna segunda (rectangulares)
(21, 2, 4, 'interior', 15, 95, 'rectangular'),
(22, 2, 4, 'interior', 15, 80, 'rectangular'),
(23, 2, 4, 'interior', 15, 70, 'rectangular'),
(24, 2, 4, 'interior', 15, 55, 'rectangular'),
(25, 2, 4, 'terraza', 15, 15, 'rectangular'),

-- Mesas redondas centrales
(31, 2, 4, 'interior', 35, 90, 'redonda'),
(32, 2, 4, 'interior', 35, 80, 'redonda'),
(33, 2, 4, 'interior', 35, 70, 'redonda'),
(34, 2, 4, 'interior', 35, 60, 'redonda'),
(35, 2, 4, 'interior', 45, 60, 'redonda'),
(36, 2, 4, 'interior', 45, 70, 'redonda'),

-- Mesas grandes terraza/vista
(26, 4, 6, 'terraza', 30, 15, 'redonda'),
(27, 4, 6, 'terraza', 42, 15, 'redonda'),
(28, 4, 6, 'terraza', 54, 15, 'redonda'),
(58, 4, 6, 'terraza', 66, 15, 'redonda'),
(56, 4, 6, 'terraza', 78, 15, 'redonda'),
(57, 6, 8, 'vip', 72, 15, 'redonda'),

-- Mesas zona derecha
(41, 2, 4, 'interior', 68, 55, 'redonda'),
(42, 2, 4, 'interior', 68, 45, 'redonda'),
(43, 2, 4, 'interior', 72, 45, 'redonda'),
(44, 2, 4, 'interior', 72, 55, 'redonda'),
(45, 2, 4, 'interior', 72, 65, 'redonda'),
(46, 2, 4, 'interior', 72, 75, 'redonda'),

-- Mesas grandes derecha
(51, 4, 6, 'terraza', 83, 90, 'redonda'),
(52, 4, 6, 'terraza', 83, 80, 'redonda'),
(53, 4, 6, 'terraza', 83, 70, 'redonda'),
(54, 4, 8, 'vip', 83, 60, 'redonda'),
(55, 4, 6, 'terraza', 83, 45, 'rectangular'),

-- Mesas esquina derecha
(61, 6, 10, 'terraza', 95, 95, 'redonda'),
(62, 6, 10, 'terraza', 95, 85, 'redonda'),
(63, 6, 10, 'terraza', 95, 75, 'redonda'),
(64, 6, 10, 'terraza', 95, 65, 'redonda'),
(65, 6, 8, 'terraza', 95, 55, 'redonda'),
(66, 6, 8, 'terraza', 95, 40, 'redonda'),
(67, 4, 6, 'terraza', 95, 25, 'redonda');

-- ============================================
-- ROW LEVEL SECURITY (básico)
-- ============================================
alter table contactos enable row level security;
alter table conversaciones enable row level security;
alter table mensajes enable row level security;
alter table reservaciones enable row level security;
alter table mesas enable row level security;

-- Política: acceso total para el service_role (el backend)
create policy "service_role_all" on contactos for all using (true);
create policy "service_role_all" on conversaciones for all using (true);
create policy "service_role_all" on mensajes for all using (true);
create policy "service_role_all" on reservaciones for all using (true);
create policy "service_role_all" on mesas for all using (true);
