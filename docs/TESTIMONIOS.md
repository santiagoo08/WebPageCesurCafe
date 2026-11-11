# Guía: testimonios reales de la comunidad cafetera

La sección **"Voces de la comunidad cafetera"** (página Servicios) muestra comentarios reales de caficultores, asociaciones y aliados de CESURCAFÉ, siempre **con permiso de cada persona**.

- En el sitio publicado (`npm run build`) **solo aparecen los testimonios verificados**. Si no hay ninguno, la sección no se muestra.
- Mientras trabajas (`npm run dev`) también se ven los de **ejemplo**, con la etiqueta "Ejemplo · no se publica", para revisar el diseño.

No se necesita acceso a la cuenta de Instagram ni de Facebook del centro: los comentarios en sus publicaciones son públicos.

---

## Paso 1 · Encontrar comentarios

1. Entra al Instagram y al Facebook de CESURCAFÉ.
2. Revisa los comentarios de las publicaciones (talleres, catación, laboratorio, proyectos).
3. Elige comentarios que:
   - hablen de una experiencia concreta con el centro (un análisis, una capacitación, un acompañamiento);
   - sean de personas reales identificables (caficultores, asociaciones, estudiantes, aliados);
   - no tengan datos sensibles (teléfonos, direcciones, problemas personales).
4. Copia el **enlace exacto** del comentario o de la publicación:
   - **Instagram:** abre la publicación → `···` → *Copiar enlace*.
   - **Facebook:** haz clic en la fecha del comentario → copia la dirección del navegador.

También valen testimonios **presenciales** (por ejemplo, en un taller), si la persona firma o escribe su autorización.

## Paso 2 · Pedir permiso

Escríbele a la persona por mensaje directo (o por el medio donde la conozcan). Plantilla:

> Hola, [nombre]. Te escribimos de CESURCAFÉ – Universidad Surcolombiana. Nos gustó mucho tu comentario sobre [tema]: "[comentario]".
> ¿Nos autorizas a publicarlo en nuestro sitio web junto con tu nombre y [municipio / asociación]? Solo lo usaremos en la sección de testimonios y puedes pedirnos retirarlo cuando quieras.
> Si estás de acuerdo, respóndenos "Sí, autorizo". ¡Gracias!

- Publica **solo** si la persona responde que sí.
- Guarda una **captura de la autorización** en la carpeta interna del centro (Drive o correo). **No la subas al repositorio**: es un dato personal.
- Si la persona prefiere, se puede publicar solo su nombre de pila o sus iniciales.
- Este procedimiento sigue la Ley 1581 de 2012 de protección de datos personales; ante dudas, consulta la política de datos de la USCO.

## Paso 3 · Agregarlo al sitio

Abre `src/data/testimonials.json` y agrega un bloque dentro de `"testimonials"`:

```json
{
  "id": "t-2026-01",
  "category": "Perfil de taza",
  "quote": "Texto del comentario, tal como lo escribió la persona (puedes corregir solo errores de tecleo).",
  "author": "Nombre Apellido",
  "role": "Caficultora de Pitalito",
  "source": "instagram",
  "sourceUrl": "https://www.instagram.com/p/XXXXXXXX/",
  "date": "2026-10-15",
  "consent": true,
  "consentDate": "2026-11-12",
  "example": false
}
```

| Campo | Qué poner |
|---|---|
| `id` | Un código único, por ejemplo `t-2026-01`, `t-2026-02`… |
| `category` | Tema corto: *Perfil de taza*, *Fermentación*, *Formación*, *Laboratorio*… |
| `quote` | El comentario, sin cambiar su sentido. Si es muy largo, puedes recortarlo marcando con `…` |
| `author` / `role` | Nombre y cómo quiere ser presentado (municipio, finca, asociación) |
| `source` | `instagram`, `facebook` o `presencial` |
| `sourceUrl` | Enlace al comentario o publicación (`null` si es presencial) |
| `date` | Fecha del comentario (`AAAA-MM-DD`) |
| `consent` | `true` **solo** si la persona autorizó |
| `consentDate` | Fecha en que autorizó |
| `example` | Siempre `false` para testimonios reales |

Revisa con `npm run dev` y luego haz commit.

## Paso 4 · Quitar los ejemplos

Cuando ya haya al menos 3 testimonios reales, borra de `testimonials.json` los bloques con `"example": true` (María Consuelo Polanía, Ing. Jorge Trujillo, Andrés Felipe Cuéllar y Luz Marina Perdomo, que son textos de ejemplo).

## Retirar un testimonio

Si una persona pide que se retire su comentario, borra su bloque de `testimonials.json` (o cambia `consent` a `false`), haz commit y publica el sitio de nuevo **lo antes posible**.

---

### Más adelante: carga automática desde Instagram

Si algún día una persona con acceso de administrador a la cuenta del centro lo autoriza, se puede crear un script `npm run sync:instagram` con la API gratuita de Instagram (cuenta de empresa o creador, app en Meta for Developers y un token que se renueva cada 60 días). Aun así, cada comentario debería pasar por esta misma revisión y autorización antes de publicarse.
