## Purpose

Mostrar las tareas del proyecto como un diagrama de Gantt junto a la tabla de tareas, editable para quien tiene permisos y de solo lectura para el resto.

## ADDED Requirements

### Requirement: Diagrama de Gantt
El sistema SHALL mostrar una tabla de tareas (número EDT, nombre, duración, inicio, fin, % completado) y, a su lado, barras en una escala de tiempo con el avance dentro de cada barra, hitos como rombos y flechas de dependencia.

#### Scenario: Abrir el proyecto
- **WHEN** un miembro abre un proyecto
- **THEN** ve la tabla y el Gantt alineados fila por fila

### Requirement: Escala de tiempo
El usuario SHALL poder cambiar la escala entre días, semanas y meses, y los días no laborables MUST distinguirse visualmente.

#### Scenario: Cambiar a semanas
- **WHEN** el usuario selecciona la escala de semanas
- **THEN** el Gantt agrupa la línea de tiempo por semana manteniendo las barras proporcionales

### Requirement: Indicadores de ruta crítica y línea base
El usuario SHALL poder resaltar las tareas críticas y mostrar la línea base como una barra secundaria bajo cada tarea.

#### Scenario: Resaltar ruta crítica
- **WHEN** el usuario activa la ruta crítica
- **THEN** las barras de las tareas críticas se muestran en un color distinto

### Requirement: Edición desde el Gantt
Para Editores y Administradores, arrastrar una barra SHALL cambiar su inicio (como restricción), estirarla SHALL cambiar su duración y unir dos barras SHALL crear una dependencia Fin-Inicio. Para Lectores el Gantt MUST ser de solo lectura.

#### Scenario: Estirar barra
- **WHEN** un Editor estira el extremo derecho de una barra dos días
- **THEN** la duración aumenta en dos días laborables y las sucesoras se reprograman

#### Scenario: Lector arrastra
- **WHEN** un Lector intenta arrastrar una barra
- **THEN** la barra no se mueve

### Requirement: Contraer y expandir
El usuario SHALL poder contraer y expandir tareas resumen en la tabla y en el Gantt a la vez.

#### Scenario: Contraer fase
- **WHEN** el usuario contrae una tarea resumen
- **THEN** sus subtareas se ocultan en la tabla y en el Gantt

### Requirement: Rendimiento
El Gantt MUST mantenerse fluido (desplazamiento sin saltos perceptibles) con al menos 1 000 tareas.

#### Scenario: Proyecto grande
- **WHEN** se abre un proyecto con 1 000 tareas
- **THEN** la vista carga en menos de 3 segundos y el desplazamiento es fluido
