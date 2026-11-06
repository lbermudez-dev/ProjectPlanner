## Purpose

Permitir que las personas creen una cuenta con su correo electrónico y se autentiquen para gestionar proyectos en ProjectPlanner.

## ADDED Requirements

### Requirement: Registro con correo electrónico
El sistema SHALL permitir registrarse con nombre, correo electrónico y contraseña. El correo MUST ser único (sin distinguir mayúsculas) y la contraseña MUST tener al menos 10 caracteres.

#### Scenario: Registro válido
- **WHEN** una persona se registra con un correo no usado y una contraseña válida
- **THEN** el sistema crea la cuenta en estado pendiente de verificación y envía un correo con un enlace de verificación

#### Scenario: Correo ya registrado
- **WHEN** una persona intenta registrarse con un correo que ya existe
- **THEN** el sistema rechaza el registro sin revelar datos de la cuenta existente

### Requirement: Verificación de correo
El sistema MUST exigir que el correo esté verificado antes de permitir iniciar sesión. El enlace de verificación MUST caducar a las 24 horas.

#### Scenario: Verificación exitosa
- **WHEN** la persona abre un enlace de verificación vigente
- **THEN** la cuenta queda verificada y puede iniciar sesión

#### Scenario: Enlace caducado
- **WHEN** la persona abre un enlace de verificación con más de 24 horas
- **THEN** el sistema lo rechaza y ofrece reenviar un enlace nuevo

### Requirement: Inicio y cierre de sesión
El sistema SHALL autenticar con correo y contraseña y mantener la sesión mediante un token de acceso de corta duración y un token de refresco revocable.

#### Scenario: Credenciales correctas
- **WHEN** un usuario verificado ingresa correo y contraseña correctos
- **THEN** el sistema inicia la sesión y muestra sus proyectos

#### Scenario: Credenciales incorrectas
- **WHEN** el correo o la contraseña no coinciden
- **THEN** el sistema muestra un mensaje genérico sin indicar cuál de los dos falló

#### Scenario: Cierre de sesión
- **WHEN** el usuario cierra sesión
- **THEN** el token de refresco queda revocado y la sesión no puede reanudarse

### Requirement: Bloqueo por intentos fallidos
El sistema MUST bloquear temporalmente el inicio de sesión de una cuenta durante 15 minutos tras 5 intentos fallidos consecutivos.

#### Scenario: Quinto intento fallido
- **WHEN** se registra el quinto intento fallido consecutivo para una cuenta
- **THEN** el sistema rechaza nuevos intentos de esa cuenta durante 15 minutos

### Requirement: Recuperación de contraseña
El sistema SHALL permitir restablecer la contraseña mediante un enlace de un solo uso enviado al correo, válido por 1 hora.

#### Scenario: Solicitud de recuperación
- **WHEN** una persona solicita recuperar la contraseña de un correo
- **THEN** el sistema responde lo mismo exista o no la cuenta, y si existe envía el enlace

#### Scenario: Restablecimiento
- **WHEN** la persona usa un enlace vigente y define una contraseña válida
- **THEN** la contraseña se actualiza, el enlace deja de ser válido y se cierran las demás sesiones
