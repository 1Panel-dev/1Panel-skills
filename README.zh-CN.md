# 1Panel Skills

[English](./README.md) | [简体中文](./README.zh-CN.md)

面向 Hermes、OpenClaw 等 Agent 运行时的 1Panel 运维技能包，基于 TypeScript 实现。

## 功能特性

- **资源监控**：当前节点状态、仪表盘指标、CPU/内存 Top 进程、监控历史、GPU 历史
- **网站检查**：网站列表与详情、Nginx 配置读取、域名读取、HTTPS 配置读取、SSL 证书读取、网站日志读取
- **应用检查**：应用市场读取、已安装应用状态检查、服务信息读取、端口与连接信息读取
- **容器检查**：容器列表、状态、Inspect、资源统计、日志读取
- **日志检查**：操作日志、登录日志、系统日志文件列表、通用日志文件读取
- **定时任务检查**：定时任务列表与详情、下次执行预览、执行记录、记录日志读取
- **任务中心检查**：任务中心记录与执行中数量
- **节点检查**：节点列表、简化节点列表、节点选项、节点状态读取
- **预留写操作**：已经按模块预留创建、更新、删除、重启等变更接口定义，后续可继续扩展

## 目录结构

```text
1Panel-skills/
├── SKILL.md                  # 技能说明
├── README.md                 # 英文 README
├── README.zh-CN.md           # 中文 README
├── package.json              # Node 包元数据
├── tsconfig.json             # TypeScript 类型检查配置
├── tsconfig.build.json       # TypeScript 构建配置
├── agents/
│   └── openai.yaml           # UI 元数据
├── dist/                     # 运行时与 CLI 使用的预编译产物
│   ├── plugin.js
│   └── scripts/
│       ├── cli.js
│       ├── client.js
│       ├── index.js
│       └── modules/
├── references/
│   └── module-groups.md      # 模块说明与 API 备注
└── scripts/
    ├── cli.ts                # 本地 CLI 入口
    ├── client.ts             # 1Panel 签名客户端
    ├── index.ts              # 模块注册表
    ├── types.ts              # 公共类型
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

## 技能说明

### 1panel-skills

这是一个通用的 1Panel 操作技能，可供 OpenClaw、Hermes 等 Agent 运行时调用。当前实现以查询、读取、状态校验为主，同时保留了按模块分组的写操作预留定义，后续可以继续扩展。

#### 模块列表

| 模块 | 说明 |
|------|------|
| `monitoring` | 仪表盘指标、当前节点状态、Top 进程、监控历史、GPU 历史 |
| `websites` | 网站列表/详情、配置读取、HTTPS 读取、证书读取、网站日志读取 |
| `apps` | 应用市场读取、已安装应用状态检查、服务读取、端口与连接信息 |
| `containers` | 容器列表、状态、Inspect、资源统计、日志读取 |
| `logs` | 操作日志、登录日志、系统日志文件、通用日志读取 |
| `cronjobs` | 定时任务列表/详情、下次执行预览、记录、记录日志、脚本选项 |
| `task-center` | 任务中心记录与执行中数量 |
| `nodes` | 节点列表、节点选项、简化节点列表、节点状态 |

## 快速开始

### 1. 环境要求

- 建议使用 Node.js 18 或更高版本
- 可访问的 1Panel 实例
- 可用的 1Panel API Key

### 2. 配置 1Panel API

1. 登录 1Panel。
2. 进入 **设置** -> **API 接口**。
3. 开启 API 接口。
4. 复制 API Key。
5. 测试时建议放通客户端 IP：
   - IPv4: `0.0.0.0/0`
   - IPv6: `::/0`

1Panel API 鉴权需要这两个 Header：

- `1Panel-Timestamp`
- `1Panel-Token = md5("1panel" + API_KEY + TIMESTAMP)`

### 3. 安装到运行时

推荐本地安装方式：

```bash
mkdir -p ~/.openclaw/skills
ln -s /path/to/1Panel-skills ~/.openclaw/skills/1panel-skills
```

仓库已经包含 `dist/` 下的预编译运行产物，正常使用时不需要先手动重新构建。

### 4. 配置运行环境变量

```bash
export ONEPANEL_BASE_URL="http://192.168.1.2:9999"
export ONEPANEL_API_KEY="你的 1Panel API Key"
export ONEPANEL_TIMEOUT_MS="30000"
export ONEPANEL_SKIP_TLS_VERIFY="false"
```

## CLI 用法

查看支持的模块：

```bash
node dist/scripts/cli.js modules
```

查看某个模块的动作：

```bash
node dist/scripts/cli.js actions monitoring
```

发一个原始签名请求：

```bash
node dist/scripts/cli.js request GET /api/v2/dashboard/base/os
```

执行模块化动作：

```bash
node dist/scripts/cli.js run monitoring getCurrentNode
node dist/scripts/cli.js run websites searchWebsites --input-json '{"page":1,"pageSize":20}'
```

打印当前签名 Header：

```bash
node dist/scripts/cli.js sign
```

## 运行时集成

这个仓库提供一个运行时入口：

- `dist/scripts/cli.js`：可直接执行的本地签名 CLI

Agent 运行时可以调用 CLI，或者直接把 `scripts/` 下的 TypeScript 资源作为接口定义来源。

## 开发

安装依赖：

```bash
npm install
```

类型检查：

```bash
npm run typecheck
```

只有修改了 TypeScript 源码后才需要重新构建：

```bash
npm run build
```

## 注意事项

1. 不要把真实 API Key 提交到版本控制。
2. 如果返回 `{"code":401,"message":"API 接口密钥错误"}`，优先检查复制的 Key 是否正确，以及 1Panel API 设置是否已经点击“确认”保存。
3. 如果返回 IP 相关鉴权错误，检查白名单配置和运行环境的真实出口 IP。
4. 某些节点相关接口可能要求 1Panel Pro 或 XPack。

## 许可证

MIT
