## Purpose

Asignar a las tareas a las personas responsables de ejecutarlas y advertir cuando alguien tiene más trabajo del que puede cubrir en un día.

## ADDED Requirements

### Requirement: Asignar recursos a tareas
Editores y Administradores SHALL poder asignar uno o varios miembros del proyecto a una tarea no resumen con un porcentaje de dedicación (1-100 %, por defecto 100 %).

#### Scenario: Asignación válida
- **WHEN** un Editor asigna a un miembro al 50 % en una tarea
- **THEN** la tarea muestra a ese miembro como recurso con 50 % de dedicación

#### Scenario: Asignar a no miembro
- **WHEN** se intenta asignar a un usuario que no es miembro del proyecto
- **THEN** el sistema rechaza la asignación

### Requirement: Detección de sobreasignación
El sistema SHALL marcar como sobreasignado a un recurso cuando la suma de su dedicación en tareas del mismo proyecto que coinciden en un día laborable supera el 100 %.

#### Scenario: Dos tareas simultáneas
- **WHEN** un miembro está asignado al 100 % en dos tareas que se solapan
- **THEN** el sistema marca al recurso y ambas tareas con aviso de sobreasignación

### Requirement: Vista de tareas por recurso
El sistema SHALL mostrar, para cada miembro, la lista de tareas asignadas con fechas y avance.

#### Scenario: Consultar mis tareas
- **WHEN** un miembro abre la vista de recursos y se selecciona a sí mismo
- **THEN** ve sus tareas asignadas ordenadas por fecha de inicio
