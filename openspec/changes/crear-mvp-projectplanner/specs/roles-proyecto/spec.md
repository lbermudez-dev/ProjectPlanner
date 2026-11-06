## Purpose

Controlar quién puede ver y gestionar cada proyecto mediante membresías con roles, administradas por el administrador del proyecto.

## ADDED Requirements

### Requirement: Roles por proyecto
Cada membresía SHALL tener exactamente uno de estos roles: Administrador de proyecto (todo, incluidos miembros, enlaces, costos, importación y eliminación), Editor (crear y editar tareas, dependencias, avance y asignaciones; ver costos) y Lector (solo ver el proyecto dentro de la aplicación, sin costos).

#### Scenario: Lector intenta editar
- **WHEN** un usuario con rol Lector intenta modificar una tarea
- **THEN** el sistema rechaza la operación con un error de permisos y no cambia nada

#### Scenario: Editor intenta gestionar miembros
- **WHEN** un usuario con rol Editor intenta invitar o quitar miembros
- **THEN** el sistema rechaza la operación con un error de permisos

### Requirement: Creador como administrador
El sistema SHALL asignar el rol Administrador de proyecto al usuario que crea el proyecto.

#### Scenario: Nuevo proyecto
- **WHEN** un usuario crea un proyecto
- **THEN** queda como su Administrador de proyecto

### Requirement: Invitación de miembros
El Administrador de proyecto SHALL poder invitar por correo con un rol. Si el correo no tiene cuenta, la invitación MUST quedar pendiente y aplicarse cuando esa persona se registre y verifique el mismo correo.

#### Scenario: Invitar a usuario existente
- **WHEN** el administrador invita a un correo con cuenta verificada
- **THEN** el usuario pasa a ser miembro con el rol indicado

#### Scenario: Invitar a correo sin cuenta
- **WHEN** el administrador invita a un correo sin cuenta
- **THEN** se envía una invitación y la membresía se activa al registrarse y verificar ese correo

### Requirement: Cambio de rol y remoción
El Administrador de proyecto SHALL poder cambiar el rol de un miembro o quitarlo. El sistema MUST impedir que el proyecto quede sin ningún Administrador de proyecto.

#### Scenario: Quitar al último administrador
- **WHEN** se intenta quitar o degradar al único Administrador de proyecto
- **THEN** el sistema rechaza la operación

#### Scenario: Miembro removido
- **WHEN** el administrador quita a un miembro
- **THEN** ese usuario deja de ver el proyecto y sus asignaciones se conservan en un recurso sin cuenta con su nombre

### Requirement: Aislamiento entre proyectos
El sistema MUST impedir que un usuario acceda por la aplicación o la API a proyectos donde no es miembro.

#### Scenario: Acceso a proyecto ajeno
- **WHEN** un usuario solicita datos de un proyecto donde no es miembro
- **THEN** el sistema responde como si el proyecto no existiera
