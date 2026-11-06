## Context

Proyecto nuevo, sin código. Motivación y alcance en `proposal.md`; comportamiento esperado en `specs/`. Restricciones: frontend en React, publicación en la nube con costo bajo al inicio, y un equipo con experiencia en C#/.NET y bases de datos relacionales.

## Goals / Non-Goals

**Goals**
- Un único motor de programación y costos en el servidor, para que la vista de gestión, la vista pública y la importación den siempre los mismos resultados.
- El servidor es la única fuente de verdad: los clientes envían intenciones y reciben el estado resultante en tiempo real.
- Separación estricta entre la API autenticada y la API pública de enlaces.

**Non-Goals**
- Edición sin conexión ni fusión de cambios en el cliente (CRDT/OT): el servidor ordena las operaciones.
- Multi-tenant por organización o empresa (en el MVP el límite de acceso es el proyecto).
- Escritura de .mpp (no hay forma soportada de generarlo; ver Out of Scope).

## Decisions

### D1. Base de datos: PostgreSQL
**Elegida:** PostgreSQL 16 o superior.
- Sin costo de licencia y con planes gestionados económicos o gratuitos en la mayoría de nubes (Azure, AWS, Render, Neon, Supabase…).
- CTE recursivas para recorrer la EDT, `jsonb` para línea base e historial, `numeric` exacto para importes y transacciones robustas para recalcular muchas tareas a la vez.
- Proveedor Npgsql maduro para EF Core.

**Alternativas:** SQL Server (excelente con .NET, pero la licencia y el hosting gestionado encarecen el despliegue; Express limita el tamaño). MySQL (viable, pero con menos tipos y herramientas para jerarquías y JSON, y menor afinidad con EF Core que Npgsql).

### D2. Backend: ASP.NET Core Web API con EF Core
Se aprovecha la experiencia en C#. Arquitectura por capas: `Api` (endpoints y hub de tiempo real) → `Application` (casos de uso y permisos) → `Domain` (entidades, motor de programación y de costos, sin dependencias) → `Infrastructure` (EF Core, correo, importador MPP).
**Alternativa:** Node.js (NestJS) con Prisma, que comparte TypeScript con el frontend. Se descarta por la curva de aprendizaje frente a .NET y porque la librería de lectura de .mpp (D9) es nativa de Java y .NET.

### D3. Motor de programación en el dominio
Módulo puro en C# y totalmente probado con tests unitarios:
1. Ordenación topológica de las dependencias (detecta ciclos y los rechaza).
2. Pasada hacia adelante (inicio y fin tempranos) aplicando FS/SS/FF/SF, desfase y restricción "No comenzar antes de".
3. Pasada hacia atrás (inicio y fin tardíos) → holgura total; ruta crítica = holgura 0.
4. Agregación de tareas resumen (min/max y avance ponderado por duración).
Las fechas se manejan como días laborables usando un servicio de calendario. Cada operación recalcula el proyecto completo dentro de una transacción; con 1 000 tareas el costo es lineal y no justifica un recálculo incremental en el MVP.

### D4. Motor de costos en el dominio
Se ejecuta después del motor de programación, en la misma transacción. Importes en `decimal` de C# y `numeric(18,2)` en la base; nunca `double`. El valor ganado (PV, EV, AC, CV, SV, CPI, SPI) se calcula al consultarlo, con la fecha de estado como parámetro y la línea base guardada como referencia. La distribución de costo planificado en el tiempo es lineal por día laborable (igual que la acumulación prorrateada por defecto de MS Project).

### D5. Jerarquía de tareas: lista de adyacencia
`parent_id` + `sort_order` por hermano. La numeración EDT se calcula al leer, no se guarda.
**Alternativa:** `ltree` o ruta materializada; se descarta porque reordenar obliga a reescribir muchas filas.

### D6. Autenticación local y externa
ASP.NET Core Identity para usuarios, hash de contraseñas, bloqueo y tokens de verificación y recuperación, con sus inicios de sesión externos (tabla de logins por proveedor).
- **Google:** OpenID Connect; se confía en el correo solo si el token trae `email_verified = true`.
- **Microsoft:** OpenID Connect contra Microsoft Entra ID con el endpoint `common` (cuentas personales, laborales y educativas). La cuenta se identifica por `tid` + `oid`, nunca por el correo, porque el correo en Entra puede no estar verificado por el dueño del dominio. Se solicita el claim opcional `xms_edov` y, si no indica dominio verificado, se envía el correo de verificación propio.
- La vinculación nunca es automática por coincidencia de correo (ver spec `autenticacion-usuarios`); esto evita tomas de cuenta mediante proveedores que no verifican el correo.
- Sesión: JWT de acceso de 15 minutos en memoria del frontend y token de refresco rotativo en cookie `HttpOnly; Secure; SameSite=Lax` (Lax es necesario para volver del proveedor externo), guardado con hash para poder revocarlo. Protección CSRF con token antifalsificación en los endpoints que usan la cookie.

### D7. Tiempo real con SignalR
- Un hub de SignalR con un grupo por proyecto; al conectar se validan la membresía y el rol.
- **Escritura:** el cliente envía operaciones (`SetDuration`, `AddDependency`, `Indent`…) por HTTP o por el hub. Un despachador por proyecto las pone en cola y las aplica de una en una: valida permisos, aplica la operación sobre el estado actual, recalcula programación y costos, guarda en una transacción, incrementa el número de versión del proyecto y publica el resultado.
- **Lectura:** el servidor emite a cada grupo un mensaje con la versión y las tareas modificadas (fechas incluidas). Existen dos subgrupos por proyecto, con y sin costos, para no enviar costos a Lectores.
- **Reconexión:** el cliente guarda la última versión recibida; al reconectar pide los cambios desde esa versión (tabla `project_changes`), y si es demasiado antigua recarga el proyecto completo.
- **Presencia:** se mantiene en memoria (o en Redis con varias instancias) y caduca si el cliente deja de enviar latidos.
- **Revocación:** al quitar a un miembro se eliminan sus conexiones del grupo y se les envía un aviso.
- **Vista pública:** se conecta como grupo de solo lectura identificado por el token, con DTO público; si falla el WebSocket, consulta la versión cada 10 segundos.
- **Escalado:** una instancia en el MVP. Con varias instancias, Azure SignalR Service o un backplane de Redis, y el despachador por proyecto pasa a usar un bloqueo distribuido (bloqueo asesorado de PostgreSQL por id de proyecto).
**Alternativas:** CRDT (Yjs) o transformación operacional; se descartan porque el recálculo de fechas depende de todo el grafo y debe hacerse en el servidor de todos modos.

### D8. Historial de cambios
Cada operación aplicada guarda en `project_changes` la versión, el autor, la fecha y hora, el tipo de operación y los valores anterior y nuevo (`jsonb`). La misma tabla sirve para la reconexión (D7) y para el historial de tareas. Se conserva indefinidamente en el MVP.

### D9. Importación de archivos de Microsoft Project
- Librería **MPXJ** mediante el paquete NuGet oficial `MPXJ.Net` (licencia LGPL-2.1-or-later, confirmada en NuGet y en el repositorio oficial), versión 16.10.0 o superior porque las anteriores tienen avisos de seguridad. Lee .mpp, .mpt y MSPDI XML. Uso comercial permitido sin costo: se usa como dependencia sin modificarla y se incluye su aviso de licencia en la página legal. Al ser un servicio web, la aplicación no se distribuye, así que la LGPL no obliga a publicar el código de ProjectPlanner.
- La imagen Docker del trabajador debe instalar `libfontconfig`, porque sin esa librería MPXJ.Net puede fallar en Linux.
- El archivo se sube a almacenamiento temporal y lo procesa un **trabajador separado** (proceso o contenedor aparte) con límites de 2 minutos y 1 GB de memoria, porque IKVM carga un runtime de Java traducido y el archivo no es de confianza.
- El trabajador produce un modelo intermedio propio (tareas, dependencias, calendario, recursos, asignaciones, costos, línea base y avisos de conversión). La API crea el proyecto a partir de ese modelo en una transacción, ejecuta los motores y compara la fecha de fin calculada con la del archivo para el informe.
- El progreso se notifica al usuario por el hub de tiempo real.

### D10. Enlaces compartidos
Token de 32 bytes aleatorios (CSPRNG) en base64url; en la base se guarda solo su SHA-256. La ruta pública `/api/public/{token}` usa DTOs propios, sin correos, notas, costos ni historial. Limitación de tasa con el `RateLimiter` integrado de ASP.NET Core, por IP. La URL del frontend es `/v/{token}` e incluye `noindex`.

### D11. Frontend
React + TypeScript con Vite, React Router, TanStack Query para la caché del servidor, cliente `@microsoft/signalr` que actualiza esa caché con los mensajes del hub, y un sistema de componentes accesible (por ejemplo, Mantine o shadcn/ui). Las columnas y paneles de costos solo se muestran si el rol lo permite, y además la API no los envía (D7, D10).
**Gantt:** spike de 1 o 2 días con 1 000 tareas para comparar una librería existente (por ejemplo SVAR React Gantt, MIT, o dhtmlxGantt, GPL o comercial) con un Gantt propio en SVG con virtualización. Criterios: licencia compatible con un producto comercial, 4 tipos de dependencia, línea base, ruta crítica, arrastre y capacidad de aplicar actualizaciones remotas sin perder el desplazamiento ni la selección del usuario. Hay que confirmar qué funciones incluye la edición gratuita de cada librería.

### D12. Modelo de datos (principal)
`users`, `user_logins` (Identity) · `projects` (nombre, inicio, moneda, horas por día, presupuesto, versión, archivado) · `project_holidays` · `memberships` · `invitations` · `resources` (proyecto, usuario opcional, nombre, tarifa por hora, costo por uso) · `tasks` (proyecto, parent_id, sort_order, nombre, duración, restricción, % avance, notas, costo fijo, costo real manual, valores calculados) · `dependencies` · `assignments` (tarea, recurso, dedicación) · `baselines` (proyecto, fecha, `jsonb` con fechas y costos por tarea) · `project_changes` (versión, autor, operación, antes/después) · `import_jobs` (estado, informe) · `share_links` · `refresh_tokens`.

### D13. Despliegue
Contenedores Docker para la API y para el trabajador de importación; frontend estático en CDN; el proxy o balanceador debe admitir WebSockets. Migraciones de EF Core aplicadas en el pipeline antes de liberar. CI con GitHub Actions: build, tests del dominio, tests de integración contra PostgreSQL en contenedor y una batería de archivos .mpp de prueba.

## Risks / Trade-offs

- [El motor de programación tiene casos límite (desfases negativos, FF/SF, restricciones)] → Tests unitarios con proyectos de referencia cuyos resultados se comparan contra MS Project; los .mpp de prueba sirven también para la importación.
- [Los resultados importados no coinciden con MS Project (calendarios por recurso, duraciones en horas, restricciones no admitidas)] → Informe de conversión obligatorio que compara fechas finales; ampliar el soporte según los casos reales.
- [MPXJ vía IKVM es pesado en memoria y tiempo de arranque] → Trabajador aislado con límites propios.
- [Cuello de botella del despachador por proyecto si muchas personas editan a la vez] → Las operaciones son cortas (menos de 300 ms con 1 000 tareas); medir y, si hace falta, recalcular solo el subgrafo afectado.
- [Fuga de costos a Lectores o a la vista pública a través del tiempo real] → DTOs y grupos separados por nivel de permiso, con tests que inspeccionan los mensajes enviados.
- [Toma de cuenta por inicio de sesión externo con correo no verificado] → Identificación por id del proveedor y vinculación solo tras demostrar el control de la cuenta (D6).
- [La librería Gantt impide un uso comercial o no admite actualizaciones remotas fluidas] → El spike de D11 decide antes de construir.

## Migration Plan

No aplica (sistema nuevo). Rollback: cada despliegue usa una imagen versionada; las migraciones deben ser compatibles hacia atrás con la versión anterior durante una liberación. Los clientes de tiempo real se reconectan solos tras un despliegue.

## Open Questions

- Proveedor de nube final y de correo transaccional; no cambia la arquitectura.
- Nombre de dominio y marca (necesario para registrar las aplicaciones en Google y Microsoft).
