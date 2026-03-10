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
