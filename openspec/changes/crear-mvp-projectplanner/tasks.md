## 1. Base del repositorio

- [ ] 1.1 Crear solución .NET en `api/` con proyectos Api, Application, Domain, Infrastructure, ImportWorker y Tests
- [ ] 1.2 Crear app React + TypeScript con Vite en `web/` con React Router y TanStack Query
- [ ] 1.3 Agregar `docker-compose.yml` con PostgreSQL para desarrollo local
- [ ] 1.4 Configurar EF Core con Npgsql y la primera migración vacía
- [ ] 1.5 Configurar GitHub Actions: build y tests de `api/` y `web/`

## 2. Autenticación local (autenticacion-usuarios)

- [ ] 2.1 Integrar ASP.NET Core Identity con reglas de contraseña y bloqueo (5 intentos, 15 min)
- [ ] 2.2 Endpoint de registro y envío del correo de verificación (24 h) mediante una interfaz de correo
- [ ] 2.3 Endpoint de verificación y reenvío de enlace
- [ ] 2.4 Login con JWT de acceso y refresh token rotativo en cookie HttpOnly, con protección CSRF
- [ ] 2.5 Logout con revocación del refresh token
- [ ] 2.6 Recuperación de contraseña (respuesta uniforme, enlace de 1 h, cierre de otras sesiones)
- [ ] 2.7 Pantallas web: registro, verificación, login, recuperar y restablecer contraseña
- [ ] 2.8 Tests de integración del flujo de autenticación

## 3. Login con Google y Microsoft (autenticacion-usuarios)

- [ ] 3.1 Registrar la aplicación en Google Cloud y en Microsoft Entra ID (endpoint `common`, claim opcional `xms_edov`)
- [ ] 3.2 Configurar OpenID Connect para Google, confiando en el correo solo con `email_verified`
- [ ] 3.3 Configurar OpenID Connect para Microsoft, identificando por `tid` + `oid` y verificando el correo cuando no esté garantizado
- [ ] 3.4 Creación de cuenta desde proveedor externo y activación de invitaciones pendientes
- [ ] 3.5 Flujo de vinculación con cuenta existente (confirmar con contraseña o código por correo)
- [ ] 3.6 Perfil: ver, vincular y desvincular métodos de acceso, impidiendo quitar el último
- [ ] 3.7 Botones "Continuar con Google" y "Continuar con Microsoft" en login y registro
- [ ] 3.8 Tests de vinculación, incluido el intento de toma de cuenta con correo ya registrado

## 4. Proyectos y calendario (gestion-proyectos)

- [ ] 4.1 Entidades Project (con moneda, horas por día, presupuesto y versión) y ProjectHoliday con migración
- [ ] 4.2 Servicio de calendario laboral (sumar y restar días laborables, contar días entre fechas) con tests
- [ ] 4.3 Endpoints de crear, editar, listar (con rol, avance y fin), archivar y desarchivar
- [ ] 4.4 Eliminación con confirmación por nombre exacto
- [ ] 4.5 Pantallas web: lista de proyectos, crear y editar proyecto, calendario y festivos

## 5. Roles y miembros (roles-proyecto)

- [ ] 5.1 Entidades Membership e Invitation con migración; el creador queda como Administrador de proyecto
- [ ] 5.2 Política de autorización por rol en la capa Application (incluida la visibilidad de costos), con tests por operación
- [ ] 5.3 Responder 404 a no miembros en todos los endpoints de proyecto
- [ ] 5.4 Invitar por correo (usuario existente o invitación pendiente que se activa al verificar)
- [ ] 5.5 Cambiar rol y quitar miembro, impidiendo dejar el proyecto sin administrador
- [ ] 5.6 Pantalla web de miembros e invitaciones

## 6. Motor de programación (planificacion-tareas)

- [ ] 6.1 Modelo de dominio: tarea, dependencia (FS/SS/FF/SF + desfase), restricción, hito
- [ ] 6.2 Ordenación topológica con detección de ciclos
- [ ] 6.3 Pasada hacia adelante con los 4 tipos de dependencia, desfase y restricción "No comenzar antes de"
- [ ] 6.4 Pasada hacia atrás, holgura total y marca de ruta crítica
- [ ] 6.5 Agregación de tareas resumen (fechas y avance ponderado por duración)
- [ ] 6.6 Suite de proyectos de referencia comparados con resultados de MS Project
- [ ] 6.7 Medir el recálculo con 1 000 tareas (objetivo: menos de 300 ms)

## 7. Tareas y planificación (planificacion-tareas)

- [ ] 7.1 Entidades Task y Dependency con migración
- [ ] 7.2 Definir el catálogo de operaciones (crear, renombrar, cambiar duración, sangría, mover, dependencia, avance, restricción, eliminar)
- [ ] 7.3 Endpoints que reciben operaciones y recalculan el proyecto en una transacción
- [ ] 7.4 Rechazo de dependencias que forman ciclos
- [ ] 7.5 Guardar línea base y calcular la variación en días
- [ ] 7.6 Tabla de tareas web con numeración EDT, edición en línea, sangría y reordenamiento

## 8. Recursos (asignacion-recursos)

- [ ] 8.1 Entidad Resource (miembro o sin cuenta) y Assignment con migración
- [ ] 8.2 Crear recurso automáticamente al unirse un miembro; convertirlo en recurso sin cuenta al quitarlo
- [ ] 8.3 Vincular un recurso sin cuenta con un miembro y traspasar asignaciones
- [ ] 8.4 Cálculo de sobreasignación por día laborable
- [ ] 8.5 Pantalla del catálogo de recursos, columna de recursos en la tabla y vista de tareas por recurso

## 9. Costos (costos-proyecto)

- [ ] 9.1 Campos de tarifa por hora, costo por uso, costo fijo y costo real manual, con migración en `numeric(18,2)`
- [ ] 9.2 Motor de costos: costo planificado por tarea, resumen y proyecto, con tests del ejemplo de la spec
- [ ] 9.3 Costo real (prorrateado por % completado o manual) y variación
- [ ] 9.4 Presupuesto del proyecto y aviso de sobrecosto
- [ ] 9.5 Incluir costos en la línea base y calcular la variación de costo
- [ ] 9.6 Valor ganado (PV, EV, AC, CV, SV, CPI, SPI) para una fecha de estado
- [ ] 9.7 Columnas y panel de costos en la web, visibles solo para Administrador y Editor
- [ ] 9.8 Tests que verifican que Lectores y la API pública no reciben costos

## 10. Tiempo real (edicion-tiempo-real)

- [ ] 10.1 Hub de SignalR con autorización por proyecto y subgrupos con y sin costos
- [ ] 10.2 Despachador por proyecto que aplica operaciones de una en una e incrementa la versión
- [ ] 10.3 Tabla `project_changes` con autor, operación y valores anterior y nuevo
- [ ] 10.4 Publicar tareas modificadas tras cada operación y actualizar la caché de TanStack Query en el cliente
- [ ] 10.5 Presencia: quién tiene el proyecto abierto y qué tarea edita, con latidos y caducidad
- [ ] 10.6 Rechazo y aviso de operaciones sobre tareas eliminadas
- [ ] 10.7 Reconexión: modo sin conexión de solo lectura y puesta al día desde la última versión
- [ ] 10.8 Expulsar conexiones al quitar a un miembro
- [ ] 10.9 Panel de historial de cambios por tarea
- [ ] 10.10 Test de carga con 5 editores simultáneos en un proyecto de 1 000 tareas

## 11. Importación de MS Project (importacion-mpp)

- [ ] 11.1 Revisar la licencia de la versión de MPXJ y registrar la decisión
- [ ] 11.2 Reunir una batería de archivos .mpp, .mpt y XML de prueba (varias versiones de Project)
- [ ] 11.3 ImportWorker: leer el archivo con MPXJ y producir el modelo intermedio
- [ ] 11.4 Mapear tareas, jerarquía, dependencias, calendario base y línea base
- [ ] 11.5 Mapear recursos, tarifas, asignaciones y costos fijos
- [ ] 11.6 Conversiones (duraciones a días, restricciones a "No comenzar antes de") con avisos
- [ ] 11.7 Límites de tamaño (20 MB), tiempo (2 min) y memoria (1 GB); borrado del archivo al terminar
- [ ] 11.8 Crear el proyecto en una transacción, recalcular y comparar la fecha de fin con la del archivo
- [ ] 11.9 Pantalla de subida con progreso por tiempo real e informe de importación

## 12. Vista Gantt (vista-gantt)

- [ ] 12.1 Spike: comparar una librería Gantt con un Gantt propio usando 1 000 tareas y actualizaciones remotas, y decidir
- [ ] 12.2 Gantt alineado con la tabla: barras, avance, hitos y flechas de dependencia
- [ ] 12.3 Escalas de día, semana y mes, y sombreado de días no laborables
- [ ] 12.4 Interruptores de ruta crítica y de línea base
- [ ] 12.5 Contraer y expandir tareas resumen sincronizado con la tabla
- [ ] 12.6 Edición por arrastre (inicio como restricción, duración, nueva dependencia FS) solo para Editor y Administrador
- [ ] 12.7 Aplicar cambios remotos sin perder desplazamiento ni selección, y mostrar la presencia sobre las filas
- [ ] 12.8 Prueba de rendimiento: carga en menos de 3 s y desplazamiento fluido con 1 000 tareas

## 13. Enlaces compartidos (enlaces-compartidos)

- [ ] 13.1 Entidad ShareLink con token aleatorio de 32 bytes guardado como SHA-256
- [ ] 13.2 Endpoints de administrador para crear, listar y revocar enlaces, con caducidad opcional
- [ ] 13.3 Endpoint público `/api/public/{token}` con DTOs sin correos, notas, costos ni historial
- [ ] 13.4 Respuesta uniforme para tokens inexistentes, revocados o caducados, y limitación de tasa por IP
- [ ] 13.5 Actualización automática de la vista pública (grupo de solo lectura o consulta cada 10 s)
- [ ] 13.6 Página web `/v/{token}` con Gantt de solo lectura, avance general, `noindex` y botón de iniciar sesión o registrarse
- [ ] 13.7 Tests que verifican que la respuesta pública no contiene correos, notas ni costos

## 14. Publicación

- [ ] 14.1 Dockerfiles de la API y del ImportWorker, y build estático del frontend
- [ ] 14.2 Pipeline de despliegue con migraciones antes de liberar y balanceador con WebSockets
- [ ] 14.3 Configurar dominio, HTTPS, URLs de retorno de Google y Microsoft, y SPF/DKIM del correo transaccional
