## Why

Los equipos pequeños y medianos necesitan planificar proyectos con la potencia de Microsoft Project (EDT, dependencias, ruta crítica, línea base) sin licencias de escritorio, y mostrar el avance a clientes o directivos sin obligarlos a crear una cuenta. ProjectPlanner resuelve ambas cosas en una sola herramienta web.

## What Changes

- Registro e inicio de sesión con correo electrónico verificado.
- Creación de proyectos con calendario laboral, fecha de inicio y miembros.
- Roles por proyecto (Administrador de proyecto, Editor, Lector) gestionados por el administrador del proyecto.
- Planificación de tareas jerárquicas (tareas resumen, subtareas, hitos) con duración en días laborables, dependencias FS/SS/FF/SF con desfase y programación automática.
- Seguimiento del avance (% completado), línea base y cálculo de ruta crítica.
- Asignación de recursos (miembros del proyecto) a tareas.
- Vista Gantt interactiva para editar y de solo lectura para visualizar.
- Enlaces de visualización compartibles: cualquier persona con el enlace ve el Gantt y el avance sin autenticarse; el enlace se puede revocar y puede caducar.

## Capabilities

### New Capabilities

- `autenticacion-usuarios`: registro con correo, verificación, inicio y cierre de sesión, recuperación de contraseña.
- `roles-proyecto`: membresía de usuarios en proyectos y permisos por rol.
- `gestion-proyectos`: creación, edición, archivado de proyectos y su calendario laboral.
- `planificacion-tareas`: EDT jerárquica, hitos, dependencias, programación automática, avance, línea base y ruta crítica.
- `asignacion-recursos`: asignación de miembros a tareas y detección de sobreasignación.
- `vista-gantt`: representación Gantt de las tareas, editable o de solo lectura según permisos.
- `enlaces-compartidos`: enlaces públicos de solo lectura, revocables y con caducidad opcional.

### Modified Capabilities

(ninguna; el proyecto parte de cero)

## Out of Scope

- Importar o exportar archivos .mpp de Microsoft Project (se evaluará en un cambio posterior; podría empezar por XML de MS Project).
- Costos, presupuesto y valor ganado.
- Inicio de sesión con proveedores externos (Google, Microsoft).
- Notificaciones por correo de cambios en tareas.
- Aplicación móvil nativa (la web debe ser usable en móvil, pero sin app).
- Edición colaborativa en tiempo real (en el MVP gana el último guardado, con control de concurrencia).

## Impact

- Repositorio nuevo con dos aplicaciones: `web/` (React) y `api/` (ASP.NET Core).
- Base de datos PostgreSQL con esquema nuevo gestionado por migraciones de EF Core.
- Servicio de envío de correo transaccional para verificación y recuperación de contraseña.
- Endpoint público sin autenticación para enlaces compartidos, que requiere limitación de tasa.
