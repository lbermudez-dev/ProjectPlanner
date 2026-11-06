## 1. Base del repositorio

- [ ] 1.1 Crear solución .NET en `api/` con proyectos Api, Application, Domain, Infrastructure y Tests
- [ ] 1.2 Crear app React + TypeScript con Vite en `web/` con React Router y TanStack Query
- [ ] 1.3 Agregar `docker-compose.yml` con PostgreSQL para desarrollo local
- [ ] 1.4 Configurar EF Core con Npgsql y la primera migración vacía
- [ ] 1.5 Configurar GitHub Actions: build y tests de `api/` y `web/`

## 2. Autenticación (autenticacion-usuarios)

- [ ] 2.1 Integrar ASP.NET Core Identity con reglas de contraseña y bloqueo (5 intentos, 15 min)
- [ ] 2.2 Endpoint de registro y envío del correo de verificación (24 h) mediante una interfaz de correo
- [ ] 2.3 Endpoint de verificación y reenvío de enlace
- [ ] 2.4 Login con JWT de acceso y refresh token rotativo en cookie HttpOnly
- [ ] 2.5 Logout con revocación del refresh token
- [ ] 2.6 Recuperación de contraseña (respuesta uniforme, enlace de 1 h, cierre de otras sesiones)
- [ ] 2.7 Pantallas web: registro, verificación, login, recuperar y restablecer contraseña
- [ ] 2.8 Tests de integración del flujo de autenticación

## 3. Proyectos y calendario (gestion-proyectos)

- [ ] 3.1 Entidades Project y ProjectHoliday con migración
- [ ] 3.2 Servicio de calendario laboral (sumar y restar días laborables, contar días entre fechas) con tests
- [ ] 3.3 Endpoints de crear, editar, listar (con rol, avance y fin), archivar y desarchivar
- [ ] 3.4 Eliminación con confirmación por nombre exacto
- [ ] 3.5 Pantallas web: lista de proyectos, crear y editar proyecto, calendario y festivos

## 4. Roles y miembros (roles-proyecto)

- [ ] 4.1 Entidades Membership e Invitation con migración; el creador queda como Administrador de proyecto
- [ ] 4.2 Política de autorización por rol en la capa Application, con tests por operación
- [ ] 4.3 Responder 404 a no miembros en todos los endpoints de proyecto
- [ ] 4.4 Invitar por correo (usuario existente o invitación pendiente que se activa al verificar)
- [ ] 4.5 Cambiar rol y quitar miembro, impidiendo dejar el proyecto sin administrador
- [ ] 4.6 Pantalla web de miembros e invitaciones

## 5. Motor de programación (planificacion-tareas)

- [ ] 5.1 Modelo de dominio: tarea, dependencia (FS/SS/FF/SF + desfase), restricción, hito
- [ ] 5.2 Ordenación topológica con detección de ciclos
- [ ] 5.3 Pasada hacia adelante con los 4 tipos de dependencia, desfase y restricción "No comenzar antes de"
- [ ] 5.4 Pasada hacia atrás, holgura total y marca de ruta crítica
- [ ] 5.5 Agregación de tareas resumen (fechas y avance ponderado por duración)
- [ ] 5.6 Suite de proyectos de referencia comparados con resultados de MS Project
- [ ] 5.7 Medir el recálculo con 1 000 tareas (objetivo: menos de 300 ms)

## 6. Tareas y planificación (planificacion-tareas)

- [ ] 6.1 Entidades Task y Dependency con migración y token de concurrencia (xmin)
- [ ] 6.2 Endpoints CRUD de tareas que recalculan el proyecto en una transacción
- [ ] 6.3 Endpoints de sangría, anular sangría y mover rama (parent_id + sort_order)
- [ ] 6.4 Endpoints de dependencias con rechazo de ciclos
- [ ] 6.5 Registro de avance en tareas no resumen
- [ ] 6.6 Guardar línea base y calcular la variación en días
- [ ] 6.7 Respuesta 409 ante edición concurrente y manejo de recarga en el frontend
- [ ] 6.8 Tabla de tareas web con numeración EDT, edición en línea, sangría y reordenamiento

## 7. Recursos (asignacion-recursos)

- [ ] 7.1 Entidad Assignment con migración; solo miembros del proyecto
- [ ] 7.2 Cálculo de sobreasignación por día laborable
- [ ] 7.3 Marcar asignaciones como inactivas al quitar un miembro
- [ ] 7.4 Columna de recursos en la tabla y vista de tareas por recurso

## 8. Vista Gantt (vista-gantt)

- [ ] 8.1 Spike: comparar una librería Gantt con un Gantt propio usando 1 000 tareas y decidir (licencia, funciones, rendimiento)
- [ ] 8.2 Gantt alineado con la tabla: barras, avance, hitos y flechas de dependencia
- [ ] 8.3 Escalas de día, semana y mes, y sombreado de días no laborables
- [ ] 8.4 Interruptores de ruta crítica y de línea base
- [ ] 8.5 Contraer y expandir tareas resumen sincronizado con la tabla
- [ ] 8.6 Edición por arrastre (inicio como restricción, duración, nueva dependencia FS) solo para Editor y Administrador
- [ ] 8.7 Prueba de rendimiento: carga en menos de 3 s y desplazamiento fluido con 1 000 tareas

## 9. Enlaces compartidos (enlaces-compartidos)

- [ ] 9.1 Entidad ShareLink con token aleatorio de 32 bytes guardado como SHA-256
- [ ] 9.2 Endpoints de administrador para crear, listar y revocar enlaces, con caducidad opcional
- [ ] 9.3 Endpoint público `/api/public/{token}` con DTOs sin correos, notas ni miembros
- [ ] 9.4 Respuesta uniforme para tokens inexistentes, revocados o caducados, y limitación de tasa por IP
- [ ] 9.5 Página web `/v/{token}` con Gantt de solo lectura, avance general, `noindex` y botón de iniciar sesión o registrarse
- [ ] 9.6 Tests que verifican que la respuesta pública no contiene correos ni notas

## 10. Publicación

- [ ] 10.1 Dockerfile de la API y build estático del frontend
- [ ] 10.2 Pipeline de despliegue con migraciones antes de liberar
- [ ] 10.3 Configurar dominio, HTTPS y SPF/DKIM del correo transaccional
