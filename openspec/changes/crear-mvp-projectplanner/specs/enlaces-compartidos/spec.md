## Purpose

Permitir que cualquier persona con un enlace vea el Gantt y el avance de un proyecto sin registrarse, bajo control del administrador del proyecto.

## ADDED Requirements

### Requirement: Crear enlace de visualización
El Administrador de proyecto SHALL poder crear uno o varios enlaces de visualización por proyecto, cada uno con un nombre descriptivo y una fecha de caducidad opcional. El token del enlace MUST ser aleatorio, de al menos 128 bits y no derivable del proyecto.

#### Scenario: Crear enlace
- **WHEN** el administrador crea un enlace llamado "Cliente"
- **THEN** el sistema genera una URL única que puede copiar y compartir

#### Scenario: Editor intenta crear enlace
- **WHEN** un Editor intenta crear un enlace de visualización
- **THEN** el sistema rechaza la operación con un error de permisos

### Requirement: Acceso sin autenticación
Quien abra un enlace vigente SHALL ver sin iniciar sesión el nombre del proyecto, el avance general, la tabla de tareas y el Gantt en solo lectura, con los datos actuales.

#### Scenario: Visitante abre el enlace
- **WHEN** una persona sin cuenta abre un enlace vigente
- **THEN** ve el Gantt y el avance actualizados y ningún control de edición

### Requirement: Datos expuestos en el enlace
La vista pública MUST NOT mostrar correos de miembros, notas de tareas, la lista de miembros ni otros enlaces. Los recursos asignados MUST mostrarse solo por nombre.

#### Scenario: Revisión de la respuesta pública
- **WHEN** se consulta la API de la vista pública
- **THEN** la respuesta no contiene correos ni notas

### Requirement: Revocación y caducidad
El Administrador de proyecto SHALL poder revocar un enlace en cualquier momento. Un enlace revocado, caducado o de un proyecto eliminado MUST dejar de funcionar de inmediato.

#### Scenario: Enlace revocado
- **WHEN** alguien abre un enlace que fue revocado
- **THEN** ve un mensaje de enlace no disponible sin ningún dato del proyecto

#### Scenario: Enlace caducado
- **WHEN** alguien abre un enlace después de su fecha de caducidad
- **THEN** ve el mismo mensaje de enlace no disponible

### Requirement: Invitación a gestionar
La vista pública SHALL ofrecer un acceso para iniciar sesión o registrarse; tras autenticarse, el usuario MUST tener acceso de gestión solo si es miembro del proyecto.

#### Scenario: Visitante quiere gestionar
- **WHEN** un visitante se registra desde la vista pública
- **THEN** ve el proyecto en su cuenta solo si el administrador lo agregó como miembro, y si no, se le indica que solicite acceso

### Requirement: Protección contra abuso
El endpoint público MUST limitar las solicitudes por IP y responder igual ante tokens inexistentes y revocados.

#### Scenario: Prueba de tokens
- **WHEN** una IP realiza muchas solicitudes con tokens inválidos en poco tiempo
- **THEN** el sistema limita temporalmente sus solicitudes
