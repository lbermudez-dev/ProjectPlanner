## Purpose

Mantener los recursos de cada proyecto, asignarlos a las tareas que deben ejecutar y advertir cuando alguien tiene más trabajo del que puede cubrir en un día.

## ADDED Requirements

### Requirement: Catálogo de recursos del proyecto
Cada proyecto SHALL tener un catálogo de recursos. Un recurso MUST ser un miembro del proyecto o un recurso con nombre sin cuenta (por ejemplo, un proveedor externo o un equipo). Solo el Administrador de proyecto MUST poder crear, editar o eliminar recursos sin cuenta.

#### Scenario: Recurso sin cuenta
- **WHEN** el administrador crea el recurso "Grúa alquilada"
- **THEN** el recurso queda disponible para asignarse a tareas sin necesidad de una cuenta

#### Scenario: Miembro como recurso
- **WHEN** un usuario se une al proyecto como miembro
- **THEN** aparece automáticamente como recurso del proyecto

### Requirement: Vincular recurso con un miembro
El Administrador de proyecto SHALL poder vincular un recurso sin cuenta con un miembro; sus asignaciones MUST pasar a ese miembro.

#### Scenario: Recurso importado vinculado
- **WHEN** el administrador vincula el recurso "J. Pérez" con el miembro Juan Pérez
- **THEN** las tareas de "J. Pérez" quedan asignadas a Juan Pérez y el recurso sin cuenta desaparece

### Requirement: Asignar recursos a tareas
Editores y Administradores SHALL poder asignar uno o varios recursos del catálogo a una tarea no resumen con un porcentaje de dedicación (1-100 %, por defecto 100 %).

#### Scenario: Asignación válida
- **WHEN** un Editor asigna un recurso al 50 % en una tarea
- **THEN** la tarea muestra ese recurso con 50 % de dedicación

#### Scenario: Asignar fuera del catálogo
- **WHEN** se intenta asignar un usuario que no es recurso del proyecto
- **THEN** el sistema rechaza la asignación

### Requirement: Detección de sobreasignación
El sistema SHALL marcar como sobreasignado a un recurso cuando la suma de su dedicación en tareas del mismo proyecto que coinciden en un día laborable supera el 100 %.

#### Scenario: Dos tareas simultáneas
- **WHEN** un recurso está asignado al 100 % en dos tareas que se solapan
- **THEN** el sistema marca al recurso y ambas tareas con aviso de sobreasignación

### Requirement: Miembro removido
Al quitar un miembro del proyecto, el sistema MUST convertir su recurso en un recurso sin cuenta con el mismo nombre y conservar sus asignaciones.

#### Scenario: Quitar miembro con tareas
- **WHEN** el administrador quita a un miembro que tiene tareas asignadas
- **THEN** las tareas siguen asignadas a un recurso sin cuenta con su nombre

### Requirement: Vista de tareas por recurso
El sistema SHALL mostrar, para cada recurso, la lista de tareas asignadas con fechas y avance.

#### Scenario: Consultar mis tareas
- **WHEN** un miembro abre la vista de recursos y se selecciona a sí mismo
- **THEN** ve sus tareas asignadas ordenadas por fecha de inicio
