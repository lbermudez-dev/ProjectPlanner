## Purpose

Planificar el trabajo de un proyecto al estilo Microsoft Project: estructura jerárquica de tareas, hitos, dependencias, programación automática, avance, línea base y ruta crítica.

## ADDED Requirements

### Requirement: Estructura jerárquica de tareas (EDT)
El sistema SHALL organizar las tareas en un árbol ordenado con niveles ilimitados y numerarlas automáticamente según su posición (1, 1.1, 1.2, 2). Una tarea con subtareas MUST comportarse como tarea resumen.

#### Scenario: Aplicar sangría
- **WHEN** un Editor aplica sangría a una tarea
- **THEN** la tarea pasa a ser subtarea de la anterior del mismo nivel y la numeración se actualiza

#### Scenario: Mover tarea
- **WHEN** un Editor arrastra una tarea a otra posición
- **THEN** la tarea y sus subtareas se mueven juntas y la numeración se actualiza

### Requirement: Campos de una tarea
Cada tarea SHALL tener nombre, duración en días laborables, inicio, fin, porcentaje completado (0-100) y notas opcionales.

#### Scenario: Cambiar duración
- **WHEN** un Editor cambia la duración de una tarea de 3 a 5 días
- **THEN** su fecha de fin se recalcula según el calendario del proyecto

### Requirement: Tareas resumen calculadas
El inicio de una tarea resumen MUST ser el menor inicio de sus subtareas, su fin el mayor fin y su avance el promedio ponderado por duración. Estos campos MUST NOT editarse directamente.

#### Scenario: Subtarea se extiende
- **WHEN** una subtarea termina después que su tarea resumen
- **THEN** el fin de la tarea resumen se amplía hasta esa fecha

### Requirement: Hitos
El sistema SHALL permitir hitos: tareas de duración cero que representan un punto en el tiempo.

#### Scenario: Crear hito
- **WHEN** un Editor fija la duración de una tarea en 0
- **THEN** la tarea se trata como hito con inicio igual a fin

### Requirement: Dependencias entre tareas
El sistema SHALL permitir dependencias Fin-Inicio, Inicio-Inicio, Fin-Fin e Inicio-Fin entre tareas del mismo proyecto, con desfase opcional en días laborables (positivo o negativo). El sistema MUST rechazar dependencias que formen un ciclo.

#### Scenario: Dependencia Fin-Inicio con desfase
- **WHEN** se crea una dependencia Fin-Inicio de A hacia B con desfase de 2 días
- **THEN** B empieza como pronto 2 días laborables después del fin de A

#### Scenario: Ciclo
- **WHEN** se intenta crear una dependencia de B hacia A existiendo ya una de A hacia B
- **THEN** el sistema rechaza la dependencia e indica el ciclo

### Requirement: Programación automática
Al cambiar duraciones, dependencias, calendario o fecha de inicio, el sistema SHALL recalcular las fechas de todas las tareas afectadas usando solo días laborables. Una tarea sin predecesoras ni restricción MUST empezar en la fecha de inicio del proyecto.

#### Scenario: Retraso en cadena
- **WHEN** se alarga la duración de una tarea que tiene sucesoras Fin-Inicio
- **THEN** las sucesoras se desplazan para respetar sus dependencias

### Requirement: Restricción de fecha de inicio
Un Editor SHALL poder fijar a una tarea una restricción "No comenzar antes de" una fecha; la programación MUST respetarla junto con las dependencias.

#### Scenario: Restricción posterior a las dependencias
- **WHEN** la restricción de una tarea es posterior a la fecha que darían sus dependencias
- **THEN** la tarea empieza en la fecha de la restricción

### Requirement: Registro de avance
Editores y Administradores SHALL poder registrar el porcentaje completado de tareas no resumen. Una tarea al 100 % MUST mostrarse como completada.

#### Scenario: Actualizar avance
- **WHEN** un Editor fija una tarea al 50 %
- **THEN** el avance de sus tareas resumen y del proyecto se recalcula

### Requirement: Ruta crítica
El sistema SHALL calcular la ruta crítica del proyecto: las tareas cuya holgura total es cero porque un retraso en ellas retrasa el fin del proyecto.

#### Scenario: Tarea con holgura
- **WHEN** una tarea puede retrasarse días sin afectar el fin del proyecto
- **THEN** no se marca como crítica y el sistema muestra su holgura

### Requirement: Línea base
El Administrador de proyecto SHALL poder guardar una línea base que congela inicio, fin y duración de cada tarea. El sistema MUST mostrar la variación en días entre lo planificado actual y la línea base.

#### Scenario: Comparar con línea base
- **WHEN** una tarea termina 3 días laborables después que en la línea base
- **THEN** el sistema muestra una variación de +3 días para esa tarea

### Requirement: Cambios como intenciones
Cada modificación de planificación MUST enviarse al servidor como una operación sobre campos concretos (por ejemplo, "duración = 5"), no como la tarea completa, para que el servidor la aplique sobre el estado más reciente según `edicion-tiempo-real`.

#### Scenario: Operación sobre estado reciente
- **WHEN** un Editor cambia la duración de una tarea cuyo nombre otro usuario cambió un instante antes
- **THEN** el servidor aplica solo la duración y el nombre nuevo se conserva
