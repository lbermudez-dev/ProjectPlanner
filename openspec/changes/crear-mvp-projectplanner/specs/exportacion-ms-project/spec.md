## Purpose

Permitir descargar un proyecto de ProjectPlanner en formato XML de Microsoft Project (MSPDI) para abrirlo en MS Project u otras herramientas compatibles.

## ADDED Requirements

### Requirement: Exportar a XML de MS Project
Administradores y Editores SHALL poder exportar un proyecto como archivo XML de Microsoft Project (MSPDI). Los Lectores y la vista pública MUST NOT poder exportar.

#### Scenario: Editor exporta
- **WHEN** un Editor elige exportar el proyecto
- **THEN** el sistema descarga un archivo `.xml` que Microsoft Project puede abrir

#### Scenario: Lector intenta exportar
- **WHEN** un Lector intenta exportar el proyecto
- **THEN** el sistema rechaza la operación con un error de permisos

### Requirement: Contenido exportado
El archivo MUST incluir la jerarquía y el orden de las tareas, nombres, duraciones, fechas, hitos, % completado, notas, dependencias con tipo y desfase, restricciones "No comenzar antes de", el calendario del proyecto con sus festivos, los recursos, las asignaciones con su dedicación, las tarifas, los costos fijos y la línea base si existe.

#### Scenario: Proyecto completo
- **WHEN** se exporta un proyecto con dependencias, recursos, costos y línea base
- **THEN** al abrirlo en Microsoft Project aparecen las mismas tareas, dependencias, asignaciones, costos y línea base

### Requirement: Fidelidad de ida y vuelta
Exportar un proyecto e importar el archivo resultante MUST producir un proyecto equivalente: mismas tareas, jerarquía, duraciones, dependencias, asignaciones y costos, y las mismas fechas calculadas.

#### Scenario: Exportar e importar
- **WHEN** se exporta un proyecto y el archivo se importa en ProjectPlanner
- **THEN** el proyecto importado tiene las mismas tareas, dependencias y fechas que el original y el informe de importación no muestra conversiones

### Requirement: Recursos vinculados a usuarios
Los recursos que son miembros MUST exportarse con su nombre. El correo MUST incluirse solo si quien exporta es Administrador de proyecto.

#### Scenario: Editor exporta recursos
- **WHEN** un Editor exporta un proyecto con miembros asignados
- **THEN** el archivo contiene los nombres de los recursos pero no sus correos

### Requirement: Formato .mpp no disponible
El sistema MUST NOT ofrecer la exportación en formato .mpp e SHALL indicar que el XML exportado se abre en Microsoft Project y puede guardarse allí como .mpp.

#### Scenario: Usuario busca exportar a .mpp
- **WHEN** el usuario abre las opciones de exportación
- **THEN** ve solo el formato XML de MS Project con una nota sobre cómo convertirlo a .mpp en Microsoft Project
