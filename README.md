# 1Panel Skills

[English](./README.md) | [简体中文](./README.zh-CN.md)

TypeScript-based 1Panel operations skill for agent runtimes such as Hermes and OpenClaw.

## Features

- **Resource monitoring**: current node metrics, dashboard metrics, top CPU and memory processes, monitor history, GPU history
- **Website inspection**: website list and detail, Nginx config reads, domain reads, HTTPS config reads, SSL certificate reads, website log reads
- **Application inspection**: app catalog reads, installed app status checks, service reads, port and connection info reads
- **Container inspection**: container list, status, inspect, stats, and log reads
- **Log inspection**: operation logs, login logs, system log file list, generic log file reads
- **Cronjob inspection**: cronjob list and detail, next-run preview, execution records, record log reads
- **Task center inspection**: task center records and executing count
- **Node inspection**: node list, simple node list, node options, and node status reads
- **Future write operations reserved**: module-grouped mutation definitions are already reserved for create, update, delete, restart, and other managed actions

## Project Layout

```text
1Panel-skills/
├── SKILL.md                  # Skill instructions
├── README.md                 # English README
├── README.zh-CN.md           # Chinese README
├── package.json              # Node package metadata
├── tsconfig.json             # TypeScript typecheck config
├── tsconfig.build.json       # TypeScript build config
├── agents/
│   └── openai.yaml           # UI metadata
├── dist/                     # Prebuilt runtime files used by runtimes and CLI
│   ├── plugin.js
│   └── scripts/
│       ├── cli.js
│       ├── client.js
│       ├── index.js
│       └── modules/
├── references/
│   └── module-groups.md      # Module overview and API notes
└── scripts/
    ├── cli.ts                # Local CLI entry
    ├── client.ts             # Signed 1Panel API client
    ├── index.ts              # Module registry
    ├── types.ts              # Shared types
    └── modules/
        ├── monitoring.ts
        ├── websites.ts
        ├── apps.ts
        ├── containers.ts
        ├── logs.ts
        ├── cronjobs.ts
        ├── task-center.ts
        └── nodes.ts
```

## Skill Overview

### 1panel-skills

General-purpose 1Panel operations skill for agent runtimes. The current implementation focuses on inspection and status-check interfaces while keeping grouped mutation endpoints reserved for future expansion.

#### Modules

| Module | Scope |
|------|------|
| `monitoring` | Dashboard metrics, current node status, top processes, monitor history, GPU history |
| `websites` | Website list/detail, config reads, HTTPS reads, certificate reads, website log reads |
| `apps` | App catalog reads, installed app status checks, service reads, port and connection info |
| `containers` | Container list, status, inspect, stats, and log reads |
| `logs` | Operation logs, login logs, system log files, generic log reads |
| `cronjobs` | Cronjob list/detail, next-run preview, records, record logs, script options |
| `task-center` | Task center record reads and executing count |
| `nodes` | Node list, node options, simple list, and node status |

## Quick Start

### 1. Requirements

- Node.js 18 or newer recommended
- A reachable 1Panel instance
- A valid 1Panel API key

### 2. Configure 1Panel API Access

1. Log in to 1Panel.
2. Open **Settings** -> **API Interface**.
3. Enable the API interface.
4. Copy the API key.
5. Add your client IP or allow all for testing:
   - IPv4: `0.0.0.0/0`
   - IPv6: `::/0`

1Panel API authentication requires:

- `1Panel-Timestamp`
- `1Panel-Token = md5("1panel" + API_KEY + TIMESTAMP)`

### 3. Install into a Runtime

Recommended local install:

```bash
mkdir -p ~/.openclaw/skills
ln -s /path/to/1Panel-skills ~/.openclaw/skills/1panel-skills
```

The repository already includes prebuilt runtime files under `dist/`, so normal use does not require rebuilding before loading the skill.

### 4. Configure Runtime Variables

```bash
export ONEPANEL_BASE_URL="http://192.168.1.2:9999"
export ONEPANEL_API_KEY="YOUR_1PANEL_API_KEY"
export ONEPANEL_TIMEOUT_MS="30000"
export ONEPANEL_SKIP_TLS_VERIFY="false"
```

## CLI Usage

List supported modules:

```bash
node dist/scripts/cli.js modules
```

List actions in one module:

```bash
node dist/scripts/cli.js actions monitoring
```

Send a raw signed request:

```bash
node dist/scripts/cli.js request GET /api/v2/dashboard/base/os
```

Run a grouped module action:

```bash
node dist/scripts/cli.js run monitoring getCurrentNode
node dist/scripts/cli.js run websites searchWebsites --input-json '{"page":1,"pageSize":20}'
```

Print the current auth headers:

```bash
node dist/scripts/cli.js sign
```

## Runtime Integration

This repository exposes one runtime entrypoint:

- `dist/scripts/cli.js`: signed CLI for direct local execution

Agent runtimes should call the CLI or use the TypeScript resources in `scripts/` as the source of truth.

## Development

Install dependencies:

```bash
npm install
```

Typecheck:

```bash
npm run typecheck
```

Rebuild only after changing TypeScript source files:

```bash
npm run build
```

## Notes

1. Do not commit real API keys into version control.
2. If you receive `{"code":401,"message":"API 接口密钥错误"}`, first verify the copied key and confirm the 1Panel API settings were saved.
3. If you receive an IP-related auth error, verify the whitelist and the actual outbound IP of the runtime.
4. Some node-related endpoints may require 1Panel Pro or XPack.

## License

MIT
