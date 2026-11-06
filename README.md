# ProjectPlanner

Proyecto gestionado con [OpenSpec](https://github.com/Fission-AI/OpenSpec): cada funcionalidad se acuerda primero como spec y luego se implementa.

## Requisitos

- Node.js 22.12 o superior
- OpenSpec CLI: `npm install -g @fission-ai/openspec@latest`
- Claude Code
- Opcional: desactivar telemetría con `openspec config set telemetry.enabled false`

## Flujo de trabajo (en Claude Code)

1. `/opsx:explore`: conversar la idea sin compromiso.
2. `/opsx:propose <nombre-del-cambio>`: crea `openspec/changes/<nombre>/` con proposal, specs, design y tasks. Revisar antes de seguir.
3. `/opsx:apply`: implementa las tareas.
4. `/opsx:archive`: fusiona las specs en `openspec/specs/` y archiva el cambio.

## Comandos útiles en terminal

```bash
openspec list              # cambios en curso
openspec list --specs      # capacidades ya especificadas
openspec status --change <nombre>
openspec validate <nombre> --strict
openspec view              # dashboard
```

## Estructura

```
openspec/
  config.yaml      # contexto y reglas que la IA aplica a cada artefacto
  specs/           # verdad actual del sistema
  changes/         # cambios en curso (y archive/ con los terminados)
.claude/           # comandos /opsx y skills de OpenSpec para Claude Code
```
