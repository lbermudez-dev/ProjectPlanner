## Purpose

Permitir que varias personas trabajen sobre el mismo proyecto a la vez viendo al instante los cambios de los demás y sabiendo quién está conectado y qué está editando.

## ADDED Requirements

### Requirement: Propagación de cambios
Cuando un usuario guarda un cambio en un proyecto, el sistema SHALL enviar el resultado (incluidas las fechas recalculadas) a todos los usuarios con el proyecto abierto, que MUST verlo sin recargar en menos de 2 segundos en condiciones normales de red.

#### Scenario: Dos editores conectados
- **WHEN** un Editor cambia la duración de una tarea
- **THEN** otro Editor con el proyecto abierto ve la nueva duración y las sucesoras desplazadas sin recargar

### Requirement: Presencia de usuarios
El sistema SHALL mostrar quiénes tienen el proyecto abierto y qué tarea está editando cada uno en ese momento.

#### Scenario: Editando la misma tarea
- **WHEN** un usuario empieza a editar una tarea que otro ya está editando
- **THEN** ve un indicador con el nombre de la otra persona sobre esa tarea

### Requirement: Resolución de ediciones simultáneas
El servidor MUST aplicar los cambios de un proyecto de uno en uno, en orden de llegada y sobre el estado más reciente. Cambios a campos distintos MUST conservarse todos; si dos cambios afectan al mismo campo, prevalece el último y ambos usuarios ven el valor final. Un cambio sobre una tarea eliminada MUST rechazarse y notificarse.

#### Scenario: Campos distintos
- **WHEN** un usuario cambia el nombre de una tarea y otro, a la vez, su duración
- **THEN** la tarea queda con el nombre y la duración nuevos

#### Scenario: Tarea eliminada por otro
- **WHEN** un usuario guarda un cambio sobre una tarea que otro acaba de eliminar
- **THEN** el cambio se rechaza y el usuario ve que la tarea fue eliminada

### Requirement: Permisos en tiempo real
Los cambios propagados MUST respetar los permisos de cada receptor: los datos de costos no se envían a Lectores ni a la vista pública. Si a un usuario se le quita el acceso, el sistema MUST cerrar su conexión al proyecto de inmediato.

#### Scenario: Miembro removido mientras mira
- **WHEN** el administrador quita a un miembro que tiene el proyecto abierto
- **THEN** ese usuario deja de recibir cambios y ve que ya no tiene acceso

### Requirement: Reconexión
Si la conexión se interrumpe, el cliente SHALL indicar que está desconectado, impedir nuevas ediciones y, al reconectar, MUST ponerse al día con los cambios ocurridos mientras tanto.

#### Scenario: Corte de red breve
- **WHEN** un usuario pierde la conexión 30 segundos y la recupera
- **THEN** ve los cambios que hicieron otros en ese tiempo y puede volver a editar

### Requirement: Historial de cambios
El sistema SHALL registrar cada cambio con autor, fecha y hora, y valores anterior y nuevo, y permitir a los miembros consultar el historial de una tarea.

#### Scenario: Consultar historial
- **WHEN** un miembro abre el historial de una tarea
- **THEN** ve quién cambió qué y cuándo
