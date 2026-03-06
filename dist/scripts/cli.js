#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { OnePanelClient } from './client.js';
import { getModule, listModules } from './index.js';
async function main() {
    const args = process.argv.slice(2);
    const [command, ...rest] = args;
    if (!command || command === '--help' || command === '-h' || command === 'help') {
        printHelp();
        return;
    }
    switch (command) {
        case 'modules':
            handleModules();
            return;
        case 'actions':
            handleActions(rest);
            return;
        case 'sign':
            handleSign(rest);
            return;
        case 'request':
            await handleRequest(rest);
            return;
        case 'run':
            await handleRun(rest);
            return;
        default:
            throw new Error(`Unknown command: ${command}`);
    }
}
function printHelp() {
    console.log(`openclaw-1panel

Usage:
  openclaw-1panel modules
  openclaw-1panel actions <module>
  openclaw-1panel sign [--base-url URL] [--api-key KEY]
  openclaw-1panel request <METHOD> <PATH> [--body-json JSON] [--query-json JSON] [--node NODE]
  openclaw-1panel run <module> <action> [--input-json JSON] [--input-file FILE] [--node NODE]

Environment:
  ONEPANEL_BASE_URL
  ONEPANEL_API_KEY
  ONEPANEL_TIMEOUT_MS
  ONEPANEL_SKIP_TLS_VERIFY

Examples:
  openclaw-1panel modules
  openclaw-1panel actions monitoring
  openclaw-1panel request GET /api/v2/dashboard/base/os
  openclaw-1panel run monitoring getCurrentNode
  openclaw-1panel run websites searchWebsites --input-json '{"page":1,"pageSize":20}'
`);
}
function handleModules() {
    console.log(JSON.stringify(listModules().map((moduleDef) => ({
        id: moduleDef.id,
        title: moduleDef.title,
        description: moduleDef.description,
    })), null, 2));
}
function handleActions(args) {
    const [moduleId] = args;
    if (!moduleId) {
        throw new Error('Missing module name');
    }
    const moduleDef = getRequiredModule(moduleId);
    console.log(JSON.stringify({
        module: moduleDef.id,
        actions: Object.values(moduleDef.actions).map((action) => ({
            id: action.id,
            summary: action.summary,
            method: action.method,
            path: action.path,
            nodeAware: Boolean(action.nodeAware),
        })),
        reservedMutations: moduleDef.reservedMutations,
    }, null, 2));
}
function handleSign(args) {
    const { flags } = parseArgs(args);
    const config = resolveClientConfig(flags);
    const timestamp = `${Math.floor(Date.now() / 1000)}`;
    const token = computeToken(config.apiKey, timestamp);
    console.log(JSON.stringify({
        baseUrl: config.baseUrl,
        headers: {
            '1Panel-Timestamp': timestamp,
            '1Panel-Token': token,
        },
    }, null, 2));
}
async function handleRequest(args) {
    const [method, path, ...rest] = args;
    if (!method || !path) {
        throw new Error('Usage: request <METHOD> <PATH> [--body-json JSON] [--query-json JSON] [--node NODE]');
    }
    const { flags } = parseArgs(rest);
    const client = createClient(flags);
    const body = parseOptionalJson(flags['body-json']);
    const query = parseOptionalJson(flags['query-json']);
    const operateNode = readOptionalString(flags.node);
    const response = await client.request({
        method: method.toUpperCase(),
        path,
        body,
        query: isRecord(query) ? query : undefined,
        operateNode,
    });
    printResponse(response.status, response.data, response.rawBody);
}
async function handleRun(args) {
    const [moduleId, actionId, ...rest] = args;
    if (!moduleId || !actionId) {
        throw new Error('Usage: run <module> <action> [--input-json JSON] [--input-file FILE] [--node NODE]');
    }
    const { flags } = parseArgs(rest);
    const moduleDef = getRequiredModule(moduleId);
    const action = moduleDef.actions[actionId];
    if (!action) {
        throw new Error(`Unknown action "${actionId}" in module "${moduleId}"`);
    }
    const input = await loadInput(flags);
    const operateNode = readOptionalString(flags.node);
    const finalInput = mergeOperateNode(input, operateNode);
    const client = createClient(flags);
    const response = await action.execute(client, finalInput);
    printResponse(response.status, response.data, response.rawBody);
}
function parseArgs(args) {
    const positionals = [];
    const flags = {};
    for (let index = 0; index < args.length; index += 1) {
        const current = args[index];
        if (!current.startsWith('--')) {
            positionals.push(current);
            continue;
        }
        const key = current.slice(2);
        const next = args[index + 1];
        if (!next || next.startsWith('--')) {
            flags[key] = true;
            continue;
        }
        flags[key] = next;
        index += 1;
    }
    return { positionals, flags };
}
function resolveClientConfig(flags) {
    const baseUrl = readOptionalString(flags['base-url']) || process.env.ONEPANEL_BASE_URL;
    const apiKey = readOptionalString(flags['api-key']) || process.env.ONEPANEL_API_KEY;
    if (!baseUrl) {
        throw new Error('Missing ONEPANEL_BASE_URL or --base-url');
    }
    if (!apiKey) {
        throw new Error('Missing ONEPANEL_API_KEY or --api-key');
    }
    return { baseUrl, apiKey };
}
function createClient(flags) {
    const config = resolveClientConfig(flags);
    return OnePanelClient.fromEnv({
        ...process.env,
        ONEPANEL_BASE_URL: config.baseUrl,
        ONEPANEL_API_KEY: config.apiKey,
    });
}
function computeToken(apiKey, timestamp) {
    return createHash('md5').update(`1panel${apiKey}${timestamp}`).digest('hex');
}
async function loadInput(flags) {
    const inputFile = readOptionalString(flags['input-file']);
    const inputJson = readOptionalString(flags['input-json']);
    if (inputFile && inputJson) {
        throw new Error('Use only one of --input-file or --input-json');
    }
    if (inputFile) {
        const fs = await import('node:fs/promises');
        const content = await fs.readFile(inputFile, 'utf8');
        return JSON.parse(content);
    }
    if (inputJson) {
        return JSON.parse(inputJson);
    }
    return {};
}
function mergeOperateNode(input, operateNode) {
    if (!operateNode) {
        return input;
    }
    if (!isRecord(input)) {
        return { operateNode };
    }
    return {
        ...input,
        operateNode,
    };
}
function parseOptionalJson(value) {
    const stringValue = readOptionalString(value);
    if (!stringValue) {
        return undefined;
    }
    return JSON.parse(stringValue);
}
function readOptionalString(value) {
    return typeof value === 'string' ? value : undefined;
}
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function getRequiredModule(moduleId) {
    const moduleDef = getModule(moduleId);
    if (!moduleDef) {
        throw new Error(`Unknown module: ${moduleId}`);
    }
    return moduleDef;
}
function printResponse(status, data, rawBody) {
    const output = {
        status,
        ok: status >= 200 && status < 300,
        data,
    };
    console.log(JSON.stringify(output, null, 2));
    if (status >= 400) {
        if (!data && rawBody) {
            console.error(rawBody);
        }
        process.exitCode = 1;
    }
}
main().catch((error) => {
    console.error(JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : String(error),
    }, null, 2));
    process.exit(1);
});
