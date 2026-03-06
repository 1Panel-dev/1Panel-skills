---
name: openclaw-1panel
description: 1Panel operation skill for OpenClaw. Use when the user wants OpenClaw to interact with a 1Panel instance for resource monitoring, websites, certificates, app status, container status, logs, cronjobs, task-center records, node-management status, and future management actions. The current implementation focuses on query and inspection interfaces and keeps module-grouped mutation definitions reserved for later expansion.
---

# OpenClaw 1Panel

## Overview

Use this skill to interact with a 1Panel instance through authenticated HTTP API calls. The bundled resources are TypeScript source files grouped by module, with query-oriented actions implemented now and mutation endpoints reserved for later expansion.

## Requirements

- Require a 1Panel API key with access to the target instance.
- Require these environment variables when executing the TypeScript resources in an OpenClaw runtime:
  - `ONEPANEL_BASE_URL`
  - `ONEPANEL_API_KEY`
  - optional: `ONEPANEL_TIMEOUT_MS`
  - optional: `ONEPANEL_SKIP_TLS_VERIFY=true`

## Workflow

1. Choose the module that matches the user's request.
2. Start with a list or search action to identify the exact target.
3. Read detail, status, or logs only after the target is confirmed.
4. If the user asks for create, update, delete, restart, stop, or any other mutation:
   - do not fabricate or guess a write workflow
   - surface the matching reserved mutation endpoint from the module
   - implement the write path only when that behavior is intentionally added to the skill

## Module Groups

- `monitoring`
  Resource monitoring, dashboard current status, top processes, historical monitor data, GPU history.
- `websites`
  Website list/detail, Nginx config reads, domain list, HTTPS config, SSL certificate reads, website log reads.
- `apps`
  App catalog lookup, installed app list, installed app detail, service list, port/connection info.
- `containers`
  Container list/status/detail, inspect, stats, streaming log reads.
- `logs`
  Operation logs, login logs, system log file list, generic line-by-line log reads.
- `cronjobs`
  Cronjob list/detail, next execution preview, execution records, record log reads.
- `task-center`
  1Panel task-center list and executing count.
- `nodes`
  Node list, simple node list, node options, node summary. Some endpoints may require Pro/XPack.

## Resources

- [references/module-groups.md](references/module-groups.md)
  Human-readable overview of module boundaries, common entrypoints, and reserved write scope.
- [scripts/client.ts](scripts/client.ts)
  Shared authenticated 1Panel client.
- [scripts/cli.ts](scripts/cli.ts)
  Executable CLI entry for OpenClaw or shell-based tool calls.
- [scripts/index.ts](scripts/index.ts)
  Registry of all module definitions.
- `scripts/modules/*.ts`
  Module-specific actions and reserved mutation endpoint definitions.

## Execution Notes

- Prefer the CLI instead of letting the model construct signed HTTP requests itself.
- The repository can ship prebuilt runtime files under `dist/`, so normal use should call `node dist/scripts/cli.js ...` directly without rebuilding first.
- Run `npm run build` only after changing TypeScript source files such as `plugin.ts` or `scripts/**/*.ts`.
- OpenClaw plugin loading should target the compiled entry at `dist/plugin.js`, not the TypeScript source file.
- If the OpenClaw runtime can execute TypeScript directly, import from [scripts/index.ts](scripts/index.ts) and call the module actions.
- If the runtime cannot execute TypeScript directly, use the TypeScript files as the source of truth for methods, paths, query parameters, and request payload shapes.
- The current implementation focuses on query and inspection actions; extend the reserved mutation definitions when you intentionally add managed write flows.
