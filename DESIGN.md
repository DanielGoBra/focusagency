# DESIGN.md — Focus

Sistema visual de Focus Chat, Focus Agency y Focus Academy. Léelo antes de cambiar la landing, las tarjetas de planes o cualquier pieza pública. La copia del producto va en español. Los tokens de abajo son los de `src/index.css`; no inventes una paleta paralela.

## 1. Tema visual

Sitio claro, amplio y comercial. El fondo es blanco o paper, con una red neuronal suave solo en los bordes laterales. El acento que señala acción es el cian. El lima es energía de marca (titulares cortos, selección, borde derecho de la tarjeta recomendada), nunca un botón de texto blanco.

La mascota FOCU es un personaje, no un icono genérico. Aparece en poses distintas según la sección para no repetirse. El producto se siente cercano (burbuja de chat, celular, asesoría) y a la vez técnico (API de WhatsApp, CRM, Meta Business Partner).

Densidad: marketing, no dashboard. Mucho aire entre secciones. Las tarjetas de precio ocupan el ancho de la página. Las transiciones entre bloques blancos llevan un degradado, no un corte plano.

## 2. Color

| Token | Hex | Rol |
|---|---|---|
| navy | `#202246` | Texto principal, títulos, tinta sobre lima |
| navy-2 | `#2c315f` | Navy secundario |
| ink | `#1a1c33` | Texto de cuerpo |
| focus / cian | `#2bbdef` | Bordes activos, marco del video, foco de teclado cercano `#48a4dc` |
| cian de tarjeta | `#3ad4f8` / `#3ad7ff` | Borde de planes claros y botón sólido |
| lima | `#1efa5d` | Acento corporativo. Texto encima: navy, nunca blanco |
| lima suave | `#6eb634` | Selección de texto y orbes. No sustituye al lima corporativo |
| mist | `#bcc3cc` | Líneas y apoyo |
| paper | `#eef1f4` | Fondo de página |
| blanco | `#ffffff` | Secciones, tarjeta activa del header, panel de FOCU |
| featured | `#071e3c` → `#041226` | Tarjeta Business Lite |
| título de plan, 2.ª palabra | `#19b7e6` | “Essential”, “Lite”, “Premium”, “GOLD”, “y tu marca” |

Redes, solo cuando el nombre es el de la red:

| Red | Color |
|---|---|
| WhatsApp | `#25D366` |
| Instagram | degradado `#f9ce34` → `#ee2a7b` → `#6228d7` (clase `.brand-ig`) |
| Facebook / Messenger | `#0866FF` |

Contraste:

- Lima `#1efa5d` con texto blanco no pasa. Usa navy `#202246`.
- En la tarjeta oscura, el check es círculo cian `#5ee9ff` con la palomita en navy `#202246`. En las tarjetas claras la palomita es blanca sobre `#2ecfff`.
- Foco visible: outline `2px solid #48a4dc`, offset `3px`.

## 3. Tipografía

| Uso | Familia | Peso |
|---|---|---|
| UI, títulos, botones | Outfit (`--font-sans`) | 800 en títulos y CTAs, 700 en nav, 600 en listas de planes |
| Texto más blando, si hace falta | Nunito (`--font-soft`) | 400–700 |

Escala orientativa de la landing:

| Pieza | Tamaño |
|---|---|
| Hero | hasta `3.15rem`, extrabold, tracking tight |
| Título de planes | `text-4xl` / `sm:text-5xl` |
| Precio de plan | grande, extrabold, encima de `USD / mes` en pequeño |
| CTA de plan | `0.92rem`, peso 800 |
| Pestaña Recomendado | `11px`, peso 800, uppercase, tracking `0.06em` |

Títulos de plan en dos tonos: la primera palabra en navy (blanco en la tarjeta oscura) y la segunda en cian. “Planes que crecen contigo” es navy; “y tu marca” es cian.

## 4. Componentes

### Header de marcas

Tres pastillas: Focuschat, Focus Agency, Focus Academy. Borde `2px solid #2bbdef`, radio completo. La activa lleva fondo blanco. Sin resplandor verde, sin text-shadow lima, sin animación de letras. La barra es un vidrio claro (`#e6e9ee` al 72 %, blur, radio 32px).

### Video de portada

Marco cian de 8px, radio `1.6rem`, fondo navy y glow cian. FOCU se alterna entre manos abiertas (`frente.png`) y señalando (`senala.png`). Debajo, la frase “Responde, asesora, agenda y vende…”. Entre esta sección y el celular hay una franja `.section-bridge`: degradado blanco → cian suave → blanco.

### Celular y canales

El carrusel de iconos deja cada red **1,5 s** en pantalla y se desplaza en **0,45 s**. Los nombres WhatsApp, Instagram y Facebook Messenger usan el color de cada red. FOCU con el celular (`chat.png`) va a la derecha del iPhone, pies alineados con la base, ancho `w-56` (224px), solo desde `xl`.

### Planes

Cuatro tarjetas en fila ancha, radio 22px, no excesivamente altas. El escenario puede llevar un velo claro sobre la animación neuronal.

| Plan | Superficie | Precio | Botón |
|---|---|---|---|
| Plan Essential | Cristal blanco, borde cian, CTA fantasma | $62 USD / mes | `#contacto` |
| Business Lite | Oscura, borde cian→lima, glow lima en el borde derecho, pestaña RECOMENDADO | $125 USD / mes | `https://chat.focuschat.co/register` |
| Plan Premium | Igual que Essential | $188 USD / mes | `#contacto` |
| Business GOLD | Clara, CTA cian sólido “Agenda tu asesoría” | sin precio | `https://chat.focuschat.co/register` |

Precios en dólares enteros. No muestres la nota de tasa en la página.

Pestaña recomendada: dentro de la tarjeta, esquina superior derecha, a ras (`top/right: -3px`), degradado `#2ad8ff` → `#1efa5d`, texto blanco “RECOMENDADO ★”. No uses un ribbon de esquina ni Ant Design Badge.

Marca FOCUS CHAT: bombillo completo con rosca, `public/brand/focu-bulb.png`, sin recortar la base ni mostrar la palabra FOCUS del archivo original. Va a la izquierda del título, a la misma altura.

WhatsApp: solo `public/brand/whatsapp-icon.png` (el PNG real, burbuja verde). Sticker de 84px en la cabecera de planes. En GOLD, 50px saliendo del extremo derecho de “Agenda tu asesoría”. Sin trazos azules ni curva verde decorativa. No dibujes el icono a mano ni uses el de react-icons en estas dos piezas.

### FOCU sobre lima

En “Yo miro el ruido. Tú cierras.” el personaje va entero dentro de un panel blanco (`rounded-[2.5rem]`, padding amplio). El texto se queda sobre el lima y no se monta encima de la figura. Nada de velo blanco translúcido: sobre lima se ve verde.

### Botones

| Variante | Fondo | Texto | Borde |
|---|---|---|---|
| Sólido de plan | `#3ad7ff` | `#102044` | ninguno |
| Fantasma de plan | blanco | `#14245c` | `2px #3ad4f8` |
| Radio | pastilla (`999px`) | | |

Hover: sube 2px. La tarjeta sube 8px.

### Formulario de contacto

Lo usan Essential, Premium y el formulario general. El mensaje prellenado de un plan es `Quiero el plan {nombre}.` solo si el campo está vacío o ya era una frase de plan. No inventes dirección ni teléfono. WhatsApp de contacto: `https://wa.me/573106309679`.

## 5. Layout

- Ancho de lectura del hero: `max-w-5xl`. El video puede llegar a `max-w-[720px]` dentro de un contenedor más ancho para dejar sitio a FOCU.
- Planes: ancho de página, con velo, no una columna estrecha.
- Header sticky con `scroll-margin-top: 11rem` en las anclas.
- Entre dos secciones blancas seguidas, un degradado o un cambio de superficie. El corte plano se ve sin terminar.
- La red neuronal (`.neural-sides`) solo se ve en los costados de escritorio y se oculta bajo 960px. No la tapes con un fondo opaco de página completa, salvo el velo claro ya aceptado en planes y el lima opaco de la sección del personaje.

## 6. Profundidad

Sombras suaves en navy, no negras duras. El video y la tarjeta recomendada sí llevan glow: cian en el video; cian arriba y lima `#1efa5d` en el borde derecho de Business Lite. El header no brilla. El sticker de WhatsApp puede tener un drop-shadow cian leve.

Radio habitual: pastillas 999px, tarjetas de plan 22px, video `1.6rem`, header 32px, panel de FOCU `2.5rem`.

## 7. Qué hacer y qué no

Hacer:

- Respetar los PNG de marca. Rutas: `public/brand/focu-bulb.png`, `public/brand/whatsapp-icon.png`, `public/brand/mascot/frente.png`, `senala.png`, `chat.png`.
- Intercalar `frente` y `senala` en el video. En el celular, `chat.png`.
- Redondear precios al dólar (`$62`, `$125`, `$188`).
- Mandar Business Lite y Business GOLD a `https://chat.focuschat.co/register`.
- Verificar en el navegador local antes de dar un cambio de UI por cerrado.

No hacer:

- Texto blanco sobre lima.
- Recortar el bombillo (la rosca forma parte del logo).
- Dibujar WhatsApp, volver a poner las tres líneas azules o la curva verde.
- Ribbon de “recomendado” con pliegue de esquina.
- Palomita blanca sobre el círculo cian de la tarjeta oscura.
- Repetir la misma pose de FOCU en secciones seguidas.
- Poner a FOCU sobre lima sin el panel blanco opaco.
- Inventar dirección, teléfono, tasa de cambio o precios con centavos.
- Publicar a producción o hacer commit si no se pidió.

## 8. Responsive

| Ancho | Comportamiento |
|---|---|
| &lt; 640px | Las tres marcas siguen en una fila; el texto puede partirse. El hero no desborda. |
| &lt; 860px | La cabecera de planes (logo, título, sticker) se apila y se centra. |
| &lt; 960px | La red neuronal lateral se oculta. |
| `sm`+ | El icono de red junto al título del celular se muestra. |
| `xl` | FOCU del video a la izquierda del marco; FOCU del celular (`w-56`) a la derecha, alineado al pie del iPhone. |
| `prefers-reduced-motion` | Sin flotación, sin tilt del teléfono, sin respiración de iconos. |

## 9. Guía para el agente

Al pedir una pantalla o un ajuste, aplica este archivo y el código existente. No copies el DESIGN.md de otra marca.

Prompt corto:

> Usa DESIGN.md de Focus. Fondo claro, navy `#202246`, cian `#2bbdef`, lima `#1efa5d` solo con texto navy. Outfit. Pastillas del header con borde cian, sin glow verde. Planes anchos: Essential $62 y Premium $188 a `#contacto`; Business Lite $125 y Business GOLD a `https://chat.focuschat.co/register`. Lite es la tarjeta oscura con pestaña RECOMENDADO y borde derecho lima. Logo bombillo completo y WhatsApp desde PNG. FOCU en poses distintas por sección; sobre lima, panel blanco opaco.

Archivos que mandan si este documento y el código se contradicen: `src/index.css` (tokens), `src/content/plans.ts` (precios y destinos), `src/components/PlanGrid.tsx`, `src/components/SiteHeader.tsx`, `src/components/ChannelPhone.tsx`, `src/components/LiveMascot.tsx`.
