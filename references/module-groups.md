# Module Groups

This skill is organized as a general 1Panel operation skill.

## Authentication

The TypeScript client signs every request with:

- `1Panel-Timestamp`
- `1Panel-Token = md5("1panel" + API_KEY + TIMESTAMP)`

Environment variables:

- `ONEPANEL_BASE_URL`
- `ONEPANEL_API_KEY`
- optional: `ONEPANEL_TIMEOUT_MS`
- optional: `ONEPANEL_SKIP_TLS_VERIFY=true`

## Modules

### monitoring

- Dashboard OS and live resource status
- Current node summary
- Historical monitor series
- GPU monitor options and GPU history

Primary endpoints:

- `GET /api/v2/dashboard/base/os`
- `GET /api/v2/dashboard/base/:ioOption/:netOption`
- `GET /api/v2/dashboard/current/node`
- `GET /api/v2/dashboard/current/:ioOption/:netOption`
- `GET /api/v2/dashboard/current/top/cpu`
- `GET /api/v2/dashboard/current/top/mem`
- `GET /api/v2/hosts/monitor/setting`
- `POST /api/v2/hosts/monitor/search`
- `GET /api/v2/hosts/monitor/gpuoptions`
- `POST /api/v2/hosts/monitor/gpu/search`

### websites

- Website list and detail reads
- Nginx config reads
- Domain list
- HTTPS config reads
- SSL certificate list/detail reads
- Website log line reads through the generic file-log endpoint

Primary endpoints:

- `POST /api/v2/websites/search`
- `GET /api/v2/websites/list`
- `GET /api/v2/websites/:id`
- `GET /api/v2/websites/:id/config/:type`
- `GET /api/v2/websites/domains/:id`
- `GET /api/v2/websites/:id/https`
- `POST /api/v2/websites/ssl/search`
- `POST /api/v2/websites/ssl/list`
- `GET /api/v2/websites/ssl/:id`
- `POST /api/v2/files/read`

Reserved mutations are kept for create/update/delete/operate, SSL changes, and domain changes.

### apps

- Installed app list and detail
- App catalog lookup
- App version detail lookup
- Service/port/connection info reads

Primary endpoints:

- `POST /api/v2/apps/installed/search`
- `GET /api/v2/apps/installed/list`
- `GET /api/v2/apps/installed/info/:installId`
- `POST /api/v2/apps/search`
- `GET /api/v2/apps/:key`
- `GET /api/v2/apps/detail/:appId/:version/:type`
- `GET /api/v2/apps/services/:key`
- `POST /api/v2/apps/installed/loadport`
- `POST /api/v2/apps/installed/conninfo`

Use the installed app detail to resolve app status. Use the container module for app runtime logs.

### containers

- Container list and detail
- Docker status and resource limit
- Inspect and stats
- Streaming log reads

Primary endpoints:

- `POST /api/v2/containers/search`
- `POST /api/v2/containers/list`
- `GET /api/v2/containers/status`
- `GET /api/v2/containers/limit`
- `POST /api/v2/containers/info`
- `POST /api/v2/containers/inspect`
- `GET /api/v2/containers/stats/:id`
- `GET /api/v2/containers/list/stats`
- `GET /api/v2/containers/search/log`

### logs

- Core panel operation logs
- Core panel login logs
- System log file list
- Generic line-by-line log reads

Primary endpoints:

- `POST /api/v2/core/logs/operation`
- `POST /api/v2/core/logs/login`
- `GET /api/v2/logs/system/files`
- `POST /api/v2/files/read`

Common `files/read` log types:

- `website`
- `system`
- `task`

### cronjobs

- Cronjob list and detail
- Next run preview
- Execution record list
- Record log reads
- Script library reads

Primary endpoints:

- `POST /api/v2/cronjobs/search`
- `POST /api/v2/cronjobs/load/info`
- `POST /api/v2/cronjobs/next`
- `POST /api/v2/cronjobs/search/records`
- `POST /api/v2/cronjobs/records/log`
- `GET /api/v2/cronjobs/script/options`
- `POST /api/v2/core/script/search`

### task-center

- Task-center list and executing count

Primary endpoints:

- `POST /api/v2/logs/tasks/search`
- `GET /api/v2/logs/tasks/executing/count`

### nodes

- Node option list
- Full node list
- Simple node list
- App update counts by node
- Current node summary

Primary endpoints:

- `POST /api/v2/core/nodes/list`
- `GET /api/v2/core/nodes/all`
- `GET /api/v2/core/nodes/simple/all`
- `GET /api/v2/core/xpack/nodes/apps/update`
- `GET /api/v2/dashboard/current/node`

`core/nodes/*` and `core/xpack/*` may not exist on OSS-only deployments. Treat `404` or `403` as a capability boundary, not as a malformed request.
