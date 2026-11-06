## Why

Los equipos pequeños y medianos necesitan planificar y costear proyectos con la potencia de Microsoft Project (EDT, dependencias, ruta crítica, línea base, costos) sin licencias de escritorio, trabajar juntos sobre el mismo plan al mismo tiempo, traer sus planes existentes de MS Project y mostrar el avance a clientes o directivos sin obligarlos a crear una cuenta. ProjectPlanner resuelve todo eso en una sola herramienta web.

## What Changes

- Registro e inicio de sesión con correo verificado, y también con cuentas de Google y Microsoft.
- Creación de proyectos con calendario laboral, fecha de inicio, moneda y miembros.
- Roles por proyecto (Administrador de proyecto, Editor, Lector) gestionados por el administrador del proyecto.
- Planificación de tareas jerárquicas (tareas resumen, subtareas, hitos) con duración en días laborables, dependencias FS/SS/FF/SF con desfase y programación automática.
- Seguimiento del avance (% completado), línea base y cálculo de ruta crítica.
- Recursos del proyecto (miembros o recursos con nombre sin cuenta) asignables a tareas.
- Costos: tarifas de recursos, costos fijos, presupuesto, costo real, línea base de costos y valor ganado.
- Importación de planes desde archivos de Microsoft Project (.mpp, .mpt y XML).
- Exportación de proyectos a XML de Microsoft Project (MSPDI), que MS Project abre y puede guardar como .mpp.
- Edición colaborativa en tiempo real con presencia de usuarios.
- Vista Gantt interactiva para editar y de solo lectura para visualizar.
- Enlaces de visualización compartibles: cualquier persona con el enlace ve el Gantt y el avance sin autenticarse; el enlace se puede revocar y puede caducar.

## Capabilities

### New Capabilities

- `autenticacion-usuarios`: registro con correo, verificación, inicio de sesión con contraseña, Google o Microsoft, vinculación de cuentas y recuperación de contraseña.
- `roles-proyecto`: membresía de usuarios en proyectos y permisos por rol.
- `gestion-proyectos`: creación, edición, archivado de proyectos y su calendario laboral.
- `planificacion-tareas`: EDT jerárquica, hitos, dependencias, programación automática, avance, línea base y ruta crítica.
- `asignacion-recursos`: catálogo de recursos del proyecto, asignación a tareas y detección de sobreasignación.
- `costos-proyecto`: tarifas, costos fijos, presupuesto, costo real, línea base de costos y valor ganado.
- `importacion-mpp`: creación de un proyecto a partir de un archivo de Microsoft Project con informe de conversión.
- `exportacion-ms-project`: descarga del proyecto como XML de Microsoft Project con fidelidad de ida y vuelta.
- `edicion-tiempo-real`: propagación inmediata de cambios entre usuarios conectados, presencia y resolución de ediciones simultáneas.
- `vista-gantt`: representación Gantt de las tareas, editable o de solo lectura según permisos.
- `enlaces-compartidos`: enlaces públicos de solo lectura, revocables y con caducidad opcional.

### Modified Capabilities

(ninguna; el proyecto parte de cero)

## Out of Scope

- Exportar directamente a .mpp (MPXJ no escribe ese formato; se exporta XML de MS Project, que Project convierte a .mpp).
- Exportar a otros formatos (Excel, PDF, Primavera).
- Importar sobre un proyecto existente o sincronizar en ambos sentidos con MS Project o Project Server.
- Varias monedas en un mismo proyecto y tipos de cambio.
- Recursos materiales con consumo por unidades (se cubren con costo fijo o costo por uso).
- Inicio de sesión con otros proveedores (Apple, GitHub) e inicio de sesión único empresarial por SAML.
- Notificaciones por correo de cambios en tareas.
- Aplicación móvil nativa (la web debe ser usable en móvil, pero sin app).
- Edición sin conexión.

## Impact

- Repositorio nuevo con dos aplicaciones: `web/` (React) y `api/` (ASP.NET Core).
- Base de datos PostgreSQL con esquema nuevo gestionado por migraciones de EF Core.
- Servicio de envío de correo transaccional para verificación y recuperación de contraseña.
- Registro de la aplicación en Google Cloud y en Microsoft Entra ID para el inicio de sesión externo.
- Conexión persistente (WebSocket) para tiempo real; con varias instancias de la API requiere un servicio de distribución de mensajes.
- Dependencia de la librería MPXJ para leer archivos de Microsoft Project.
- Endpoint público sin autenticación para enlaces compartidos, que requiere limitación de tasa.
