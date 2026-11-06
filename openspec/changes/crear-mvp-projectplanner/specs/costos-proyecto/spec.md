## Purpose

Calcular y controlar el costo de un proyecto al estilo Microsoft Project: tarifas de recursos, costos fijos, presupuesto, costo real, línea base de costos y valor ganado.

## ADDED Requirements

### Requirement: Moneda y jornada del proyecto
Cada proyecto SHALL tener una moneda (código ISO 4217, elegida al crearlo) y una jornada laboral en horas por día (por defecto 8). Todos los importes del proyecto MUST expresarse en esa moneda.

#### Scenario: Proyecto en córdobas
- **WHEN** el administrador crea un proyecto con moneda NIO
- **THEN** todos los costos del proyecto se muestran en NIO

### Requirement: Permisos sobre costos
Solo el Administrador de proyecto SHALL poder editar tarifas, costos fijos, presupuesto y costos reales. Los Editores MUST poder ver los costos sin editarlos. Los Lectores y la vista pública MUST NOT ver ningún dato de costos.

#### Scenario: Lector abre el proyecto
- **WHEN** un Lector abre un proyecto con costos
- **THEN** no ve columnas, totales ni indicadores de costo

#### Scenario: Editor intenta cambiar una tarifa
- **WHEN** un Editor intenta modificar la tarifa de un recurso
- **THEN** el sistema rechaza la operación con un error de permisos

### Requirement: Tarifas de recursos
Cada recurso SHALL poder tener una tarifa estándar por hora y un costo por uso (importe único por cada tarea a la que se asigna).

#### Scenario: Definir tarifa
- **WHEN** el administrador fija a un recurso una tarifa de 20 por hora
- **THEN** el costo de sus tareas asignadas se recalcula con esa tarifa

### Requirement: Costo planificado de tareas
El costo de una tarea no resumen MUST ser la suma, por cada asignación, de duración × jornada × dedicación × tarifa más costo por uso, más el costo fijo de la tarea. El costo de una tarea resumen MUST ser la suma de sus subtareas más su propio costo fijo, y el del proyecto la suma de todo.

#### Scenario: Cálculo de una tarea
- **WHEN** una tarea de 2 días con jornada de 8 h tiene un recurso al 50 % con tarifa 10 y un costo fijo de 100
- **THEN** el costo planificado de la tarea es 180

### Requirement: Presupuesto
El Administrador de proyecto SHALL poder fijar un presupuesto total del proyecto. El sistema MUST mostrar la diferencia entre el presupuesto y el costo planificado y advertir cuando el costo lo supera.

#### Scenario: Costo por encima del presupuesto
- **WHEN** el costo planificado supera el presupuesto
- **THEN** el sistema muestra la diferencia en rojo con un aviso

### Requirement: Costo real
El costo real de una tarea MUST calcularse por defecto como costo planificado × % completado. El Administrador de proyecto SHALL poder sustituirlo por un importe real registrado manualmente.

#### Scenario: Costo real manual
- **WHEN** el administrador registra un costo real de 250 en una tarea planificada en 200
- **THEN** la tarea muestra costo real 250 y una variación de +50

### Requirement: Línea base de costos
Al guardar una línea base, el sistema MUST guardar también el costo planificado de cada tarea y del proyecto, y mostrar la variación de costo frente a ella.

#### Scenario: Variación de costo
- **WHEN** después de guardar la línea base se sube una tarifa
- **THEN** el sistema muestra la diferencia entre el costo actual y el de la línea base

### Requirement: Valor ganado
Para una fecha de estado elegida, el sistema SHALL calcular sobre la línea base el valor planificado (PV), el valor ganado (EV), el costo real (AC), las variaciones de costo y cronograma, y los índices CPI y SPI. Sin línea base, el sistema MUST indicar que se necesita una para este análisis.

#### Scenario: Proyecto con sobrecosto
- **WHEN** a la fecha de estado el costo real es mayor que el valor ganado
- **THEN** el CPI es menor que 1 y se muestra como desfavorable

#### Scenario: Sin línea base
- **WHEN** se abre el análisis de valor ganado en un proyecto sin línea base
- **THEN** el sistema indica que primero hay que guardar una línea base
