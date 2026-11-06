## Purpose

Permitir crear y administrar proyectos con su fecha de inicio y calendario laboral, que sirven de base para programar las tareas.

## ADDED Requirements

### Requirement: Crear proyecto
Un usuario autenticado SHALL poder crear un proyecto con nombre, descripción opcional y fecha de inicio.

#### Scenario: Creación válida
- **WHEN** un usuario crea un proyecto con nombre y fecha de inicio
- **THEN** el proyecto aparece en su lista con el calendario laboral por defecto

### Requirement: Calendario laboral del proyecto
Cada proyecto SHALL tener un calendario con días laborables de la semana (por defecto lunes a viernes) y una lista de días festivos. Solo el Administrador de proyecto MUST poder modificarlo.

#### Scenario: Agregar festivo
- **WHEN** el administrador agrega un día festivo al calendario
- **THEN** ese día deja de contarse como laborable y las fechas de las tareas afectadas se recalculan

### Requirement: Editar datos del proyecto
El Administrador de proyecto SHALL poder cambiar nombre, descripción y fecha de inicio.

#### Scenario: Mover fecha de inicio
- **WHEN** el administrador cambia la fecha de inicio del proyecto
- **THEN** las tareas sin restricción de fecha se reprograman a partir de la nueva fecha

### Requirement: Lista de proyectos
El sistema SHALL mostrar al usuario solo los proyectos donde es miembro, con su rol, porcentaje de avance general y fecha de fin calculada.

#### Scenario: Usuario con varios proyectos
- **WHEN** un usuario abre su lista de proyectos
- **THEN** ve cada proyecto del que es miembro con su rol, avance y fecha de fin

### Requirement: Archivar y eliminar proyecto
El Administrador de proyecto SHALL poder archivar un proyecto (queda de solo lectura y oculto de la lista principal) y eliminarlo definitivamente previa confirmación escribiendo su nombre.

#### Scenario: Proyecto archivado
- **WHEN** el administrador archiva un proyecto
- **THEN** ningún rol puede modificar sus tareas hasta que se desarchive

#### Scenario: Eliminación confirmada
- **WHEN** el administrador confirma la eliminación escribiendo el nombre exacto
- **THEN** el proyecto, sus tareas y sus enlaces compartidos dejan de existir
