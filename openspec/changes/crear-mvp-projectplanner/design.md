## Context

Proyecto nuevo, sin código. Motivación y alcance en `proposal.md`; comportamiento esperado en `specs/`. Restricciones: frontend en React, publicación en la nube con costo bajo al inicio, y un equipo con experiencia en C#/.NET y bases de datos relacionales.

## Goals / Non-Goals

**Goals**
- Un único motor de programación (fechas, ruta crítica, holgura) en el servidor, para que la vista de gestión y la vista pública muestren siempre lo mismo.
- Separación estricta entre la API autenticada y la API pública de enlaces.
- Base preparada para importar XML de MS Project más adelante sin rediseñar el modelo.

**Non-Goals**
- Multi-tenant por organización o empresa (en el MVP el límite de acceso es el proyecto).
- Sincronización en tiempo real entre navegadores (se usa control optimista y recarga).

## Decisions

### D1. Base de datos: PostgreSQL
**Elegida:** PostgreSQL 16 o superior.
- Sin costo de licencia y con planes gestionados económicos o gratuitos en la mayoría de nubes (Azure, AWS, Render, Neon, Supabase…).
- CTE recursivas para recorrer la EDT, `jsonb` para la línea base y transacciones robustas para recalcular muchas tareas a la vez.
- Proveedor Npgsql maduro para EF Core, con columna de sistema `xmin` usable como token de concurrencia.

**Alternativas:** SQL Server (excelente con .NET, pero la licencia y el hosting gestionado encarecen el despliegue; Express limita el tamaño). MySQL (viable, pero con menos tipos y herramientas para jerarquías y JSON, y menor afinidad con EF Core que Npgsql).

### D2. Backend: ASP.NET Core Web API con EF Core
Se aprovecha la experiencia en C#. Arquitectura por capas: `Api` (endpoints) → `Application` (casos de uso y permisos) → `Domain` (entidades y motor de programación sin dependencias) → `Infrastructure` (EF Core, correo).
**Alternativa:** Node.js (NestJS) con Prisma, que comparte TypeScript con el frontend. Se descarta por la curva de aprendizaje frente a .NET.

### D3. Motor de programación en el dominio
Módulo puro en C# y totalmente probado con tests unitarios:
1. Ordenación topológica de las dependencias (detecta ciclos y los rechaza).
2. Pasada hacia adelante (inicio y fin tempranos) aplicando FS/SS/FF/SF, desfase y restricción "No comenzar antes de".
3. Pasada hacia atrás (inicio y fin tardíos) → holgura total; ruta crítica = holgura 0.
4. Agregación de tareas resumen (min/max y avance ponderado por duración).
Las fechas se manejan como días laborables usando un servicio de calendario (días de la semana + festivos). Cada cambio de planificación recalcula el proyecto completo dentro de una transacción; con 1 000 tareas el costo es lineal y no justifica un recálculo incremental en el MVP.

### D4. Jerarquía de tareas: lista de adyacencia
`parent_id` + `sort_order` por hermano. La numeración EDT se calcula al leer, no se guarda. Mover una rama cambia solo el `parent_id` y el `sort_order` de la raíz movida.
**Alternativa:** `ltree` o ruta materializada; se descarta porque reordenar obliga a reescribir muchas filas.

### D5. Autenticación
ASP.NET Core Identity para usuarios, hash de contraseñas, bloqueo por intentos y tokens de verificación y recuperación. Sesión con JWT de acceso de 15 minutos en memoria del frontend y token de refresco rotativo en cookie `HttpOnly; Secure; SameSite=Strict`, guardado con hash en la base para poder revocarlo.
Los permisos se aplican en la capa `Application` con una política por rol del proyecto, nunca solo en el frontend.

### D6. Enlaces compartidos
Token de 32 bytes aleatorios (CSPRNG) en base64url; en la base se guarda solo su SHA-256, junto con nombre, caducidad y fecha de revocación. La ruta pública `/api/public/{token}` usa DTOs propios, distintos de los de gestión, para que sea imposible filtrar correos o notas por error. Limitación de tasa con el `RateLimiter` integrado de ASP.NET Core, por IP.
La URL del frontend es `/v/{token}`, renderiza el mismo componente Gantt en modo solo lectura e incluye `noindex`.

### D7. Frontend
React + TypeScript con Vite, React Router, TanStack Query para la caché de servidor y un sistema de componentes accesible (por ejemplo, Mantine o shadcn/ui).
**Gantt:** antes de construir la vista se hace un spike de 1 o 2 días con 1 000 tareas para comparar una librería existente (por ejemplo SVAR React Gantt, de licencia MIT, o dhtmlxGantt, GPL o comercial) con un Gantt propio en SVG con virtualización de filas. Criterios: licencia compatible con un producto comercial, dependencias de los 4 tipos, barras de línea base, resaltado de ruta crítica y arrastre. Hay que confirmar qué funciones incluye la edición gratuita de cada librería. Las fechas siempre vienen calculadas del servidor; el Gantt solo envía intenciones (nueva duración, nueva restricción, nueva dependencia).

### D8. Modelo de datos (principal)
`users` (Identity) · `projects` (nombre, inicio, archivado, días laborables) · `project_holidays` · `memberships` (usuario, proyecto, rol) · `invitations` (correo, rol, token hash, estado) · `tasks` (proyecto, parent_id, sort_order, nombre, duración, restricción, % avance, notas, inicio/fin calculados, holgura, crítica) · `dependencies` (predecesora, sucesora, tipo, desfase) · `assignments` (tarea, usuario, dedicación, activo) · `baselines` (proyecto, fecha, `jsonb` con las tareas) · `share_links` (proyecto, nombre, token_hash, expira, revocado) · `refresh_tokens`.

### D9. Despliegue
Contenedor Docker para la API y frontend estático en CDN. Migraciones de EF Core aplicadas en el pipeline antes de liberar. CI con GitHub Actions: build, tests del dominio, tests de integración contra PostgreSQL en contenedor.

## Risks / Trade-offs

- [El motor de programación tiene casos límite (desfases negativos, FF/SF, restricciones)] → Tests unitarios con proyectos de referencia cuyos resultados se comparan contra MS Project.
- [La licencia de la librería Gantt impide un uso comercial] → El spike de D7 decide antes de construir; la alternativa es el Gantt propio.
- [Un recálculo completo en cada cambio puede ser lento en proyectos muy grandes] → Medir con 1 000 tareas; si supera 300 ms, recalcular solo el subgrafo afectado.
- [El token del enlace se filtra al reenviarse] → Revocación inmediata, caducidad opcional y varios enlaces con nombre para saber cuál revocar.
- [Correos de verificación en spam] → Proveedor transaccional con SPF/DKIM configurados en el dominio.

## Migration Plan

No aplica (sistema nuevo). Rollback: cada despliegue usa una imagen versionada; las migraciones deben ser compatibles hacia atrás con la versión anterior durante una liberación.

## Open Questions

- Proveedor de nube final (Azure, AWS, Render…) y de correo transaccional; no cambia la arquitectura.
- Nombre de dominio y marca.
