# Focus Agency

Sitio público y Hub de Focus Chat & Agency. Producción: [focuschat.co](https://focuschat.co).

## Infraestructura

```mermaid
flowchart LR
  visitante[Visitante]
  dns[GoDaddy DNS]
  vercel[Vercel]
  sitio[Sitio Vite]
  api["Función /api/contact"]
  turnstile[Cloudflare Turnstile]
  resend[Resend]
  correo["focusacademy.agency@gmail.com"]
  wa[WhatsApp]

  visitante --> dns --> vercel --> sitio
  sitio -->|formulario| turnstile --> api
  api --> resend --> correo
  sitio -->|"wa.me"| wa
```

El dominio `focuschat.co` apunta a Vercel. El sitio es una aplicación Vite + React. El formulario vive en una función de Vercel: Turnstile confirma que hay una persona y Resend entrega el mensaje desde `hola@focuschat.co`. El botón de WhatsApp abre el chat de Focus Agency Marketing en el teléfono `573106309679`, con el texto que escribió el visitante.

Variables de producción, solo en Vercel: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_SITE_KEY` y `CONTACT_FROM`. El buzón de destino es `focusacademy.agency@gmail.com`.

## Llegada del visitante

```mermaid
flowchart TD
  inicio[Entra a focuschat.co]
  inicio --> redes[Redes y video]
  inicio --> whatsapp[Panel de WhatsApp]
  inicio --> formulario[Formulario de contacto]
  inicio --> hub[Entrar al Hub]
  whatsapp --> chat[WhatsApp móvil o Web]
  formulario --> equipo[Correo del equipo]
  hub --> demo[Pulso, bandeja, pipeline, pauta, flujos e inteligencia]
```

## Formulario de contacto

```mermaid
sequenceDiagram
  participant V as Visitante
  participant S as Sitio
  participant T as Turnstile
  participant A as API de contacto
  participant R as Resend

  V->>S: Nombre, correo, empresa y mensaje
  S->>T: Verificación
  T-->>S: Token
  S->>A: Envío del formulario
  A->>A: Valida datos y descarta el campo oculto
  A->>T: siteverify
  A->>R: Correo al equipo
  R-->>V: El equipo recibió el mensaje
```

Un envío incompleto responde que hay que revisar los datos. Si la verificación falla, pide confirmar que no es un robot. El campo oculto `fax` corta el envío de bots sin avisarles.

## Hub

El Hub guarda leads, conversaciones, campañas, flujos e integraciones en el navegador (`focus-hub-mvp-2`). WhatsApp Business, Instagram y Meta Ads de esa vista usan datos de demostración.

| Ruta | Lectura |
| --- | --- |
| `/hub` | Pulso del negocio |
| `/hub/bandeja` | Conversaciones |
| `/hub/pipeline` | Etapas del lead |
| `/hub/ads` | Pauta |
| `/hub/flujos` | Secuencias |
| `/hub/integraciones` | Canales y destinos |
| `/hub/inteligencia` | Qué convierte y qué se enfría |

## Pipeline

```mermaid
flowchart LR
  nuevo[Nuevo]
  conversacion[En conversación]
  calificado[Calificado]
  propuesta[Propuesta]
  ganado[Ganado]
  nuevo --> conversacion --> calificado --> propuesta --> ganado
```

Canales de entrada: WhatsApp, Instagram, Meta Ads y Web.

## Flujos

Cada flujo tiene un disparador, un canal y pasos ordenados. Los pasos posibles son mensaje, pregunta, espera, asignar y webhook.

```mermaid
flowchart TD
  disparo[Disparador]
  mensaje[Mensaje]
  pregunta[Pregunta]
  espera[Espera]
  asignar[Asignar a una persona]
  webhook[Webhook]
  disparo --> mensaje --> pregunta --> espera --> asignar --> webhook
```

La demostración trae cinco secuencias: bienvenida de WhatsApp, calificación de intención, seguimiento a las 24 h, aviso de lead caliente y nutrición de propuesta.

## Local

```bash
npm install
npm run dev
```

El sitio queda en `http://localhost:5173/`.
