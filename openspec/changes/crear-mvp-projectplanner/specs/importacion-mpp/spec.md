## Purpose

Permitir crear un proyecto de ProjectPlanner a partir de un plan existente de Microsoft Project, conservando tareas, dependencias, calendario, recursos, costos y línea base.

## ADDED Requirements

### Requirement: Archivos admitidos
Un usuario autenticado SHALL poder importar archivos .mpp y .mpt de Microsoft Project y archivos XML de MS Project (MSPDI), de hasta 20 MB. El sistema MUST rechazar otros formatos o archivos dañados con un mensaje claro.

#### Scenario: Archivo válido
- **WHEN** un usuario sube un .mpp válido de 5 MB
- **THEN** el sistema inicia la importación y muestra su progreso

#### Scenario: Archivo no admitido
- **WHEN** un usuario sube un archivo .xlsx o un .mpp dañado
- **THEN** el sistema rechaza el archivo e indica el motivo sin crear ningún proyecto

### Requirement: Proyecto nuevo por importación
Cada importación SHALL crear un proyecto nuevo con el importador como Administrador de proyecto. La importación MUST ser atómica: si falla, no queda ningún proyecto a medias.

#### Scenario: Falla a mitad de proceso
- **WHEN** la importación falla después de leer parte de las tareas
- **THEN** no se crea ningún proyecto y el usuario ve el error

### Requirement: Datos importados
El sistema MUST importar la jerarquía y el orden de las tareas, nombres, duraciones, hitos, % completado, notas, dependencias con tipo y desfase, el calendario base (días laborables y excepciones), los recursos con sus tarifas y costo por uso, las asignaciones con su dedicación, los costos fijos y la línea base principal.

#### Scenario: Plan con dependencias y recursos
- **WHEN** se importa un plan con 200 tareas, dependencias y 10 recursos
- **THEN** el proyecto creado tiene las mismas tareas, dependencias y asignaciones, y los recursos quedan como recursos sin cuenta

### Requirement: Conversión de elementos no equivalentes
El sistema SHALL convertir lo que no tenga equivalente exacto y registrarlo: duraciones en horas o minutos se redondean hacia arriba a días laborables; restricciones distintas de "No comenzar antes de" se convierten a esa restricción usando la fecha de inicio que tenía la tarea; campos personalizados, macros y vínculos a otros proyectos se omiten.

#### Scenario: Restricción no admitida
- **WHEN** el archivo tiene una tarea con restricción "Debe finalizar el"
- **THEN** la tarea se importa con "No comenzar antes de" su inicio original y el cambio queda en el informe

### Requirement: Informe de importación
Al terminar, el sistema SHALL mostrar un informe con cantidades importadas (tareas, dependencias, recursos, asignaciones) y la lista de elementos convertidos u omitidos, y MUST indicar si las fechas finales difieren de las del archivo.

#### Scenario: Fechas recalculadas distintas
- **WHEN** tras programar el proyecto importado su fecha de fin difiere de la del archivo
- **THEN** el informe muestra ambas fechas y la diferencia en días

### Requirement: Tratamiento seguro del archivo
El sistema MUST procesar el archivo con límite de tiempo y de memoria, aislado del proceso que atiende a los usuarios, y MUST eliminar el archivo una vez procesado.

#### Scenario: Archivo que agota el tiempo
- **WHEN** el procesamiento supera el límite de tiempo
- **THEN** la importación se cancela, se informa al usuario y el archivo se elimina
