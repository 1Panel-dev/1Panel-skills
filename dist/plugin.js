import { OnePanelClient } from './scripts/client.js';
import { getModule, listModules } from './scripts/index.js';
function createClientFromPluginConfig(config) {
    return new OnePanelClient({
        baseUrl: config.baseUrl || process.env.ONEPANEL_BASE_URL || '',
        apiKey: config.apiKey || process.env.ONEPANEL_API_KEY || '',
        timeoutMs: config.timeoutMs ?? readTimeoutFromEnv(),
        skipTlsVerify: config.skipTlsVerify ?? /^(1|true|yes)$/i.test(process.env.ONEPANEL_SKIP_TLS_VERIFY || ''),
    });
}
function readTimeoutFromEnv() {
    const raw = process.env.ONEPANEL_TIMEOUT_MS;
    const parsed = raw ? Number.parseInt(raw, 10) : 30_000;
    return Number.isFinite(parsed) ? parsed : 30_000;
}
function asRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function textResult(payload) {
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(payload, null, 2),
            },
        ],
    };
}
export default {
    id: 'openclaw-1panel',
    name: '1Panel Ops',
    configSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
            baseUrl: { type: 'string', minLength: 1 },
            apiKey: { type: 'string', minLength: 1 },
            timeoutMs: { type: 'integer', minimum: 1000 },
            skipTlsVerify: { type: 'boolean' },
        },
    },
    register(api) {
        api.registerTool({
            name: 'openclaw_1panel',
            description: 'Query a 1Panel instance through signed API calls. Supports listing modules, listing actions, running a module action, or making a raw signed request.',
            parameters: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    mode: {
                        type: 'string',
                        enum: ['modules', 'actions', 'run', 'request'],
                    },
                    module: {
                        type: 'string',
                    },
                    action: {
                        type: 'string',
                    },
                    input: {
                        type: 'object',
                        additionalProperties: true,
                    },
                    operateNode: {
                        type: 'string',
                    },
                    method: {
                        type: 'string',
                        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                    },
                    path: {
                        type: 'string',
                    },
                    body: {
                        type: 'object',
                        additionalProperties: true,
                    },
                    query: {
                        type: 'object',
                        additionalProperties: true,
                    },
                },
                required: ['mode'],
            },
            async execute(_id, params) {
                const client = createClientFromPluginConfig(api.config || {});
                const mode = params.mode;
                if (mode === 'modules') {
                    return textResult(listModules().map((moduleDef) => ({
                        id: moduleDef.id,
                        title: moduleDef.title,
                        description: moduleDef.description,
                    })));
                }
                if (mode === 'actions') {
                    const moduleId = typeof params.module === 'string' ? params.module : '';
                    const moduleDef = getModule(moduleId);
                    if (!moduleDef) {
                        throw new Error(`Unknown module: ${moduleId}`);
                    }
                    return textResult({
                        module: moduleDef.id,
                        actions: Object.values(moduleDef.actions).map((item) => ({
                            id: item.id,
                            summary: item.summary,
                            method: item.method,
                            path: item.path,
                            nodeAware: Boolean(item.nodeAware),
                        })),
                        reservedMutations: moduleDef.reservedMutations,
                    });
                }
                if (mode === 'run') {
                    const moduleId = typeof params.module === 'string' ? params.module : '';
                    const actionId = typeof params.action === 'string' ? params.action : '';
                    const moduleDef = getModule(moduleId);
                    if (!moduleDef) {
                        throw new Error(`Unknown module: ${moduleId}`);
                    }
                    const action = moduleDef.actions[actionId];
                    if (!action) {
                        throw new Error(`Unknown action "${actionId}" in module "${moduleId}"`);
                    }
                    const input = asRecord(params.input) ? params.input : {};
                    const operateNode = typeof params.operateNode === 'string' ? params.operateNode : undefined;
                    const finalInput = operateNode
                        ? {
                            ...input,
                            operateNode,
                        }
                        : input;
                    const response = await action.execute(client, finalInput);
                    return textResult({
                        status: response.status,
                        ok: response.status >= 200 && response.status < 300,
                        data: response.data,
                    });
                }
                if (mode === 'request') {
                    const method = typeof params.method === 'string' ? params.method : '';
                    const path = typeof params.path === 'string' ? params.path : '';
                    if (!method || !path) {
                        throw new Error('mode=request requires method and path');
                    }
                    const response = await client.request({
                        method: method,
                        path,
                        body: asRecord(params.body) ? params.body : undefined,
                        query: asRecord(params.query)
                            ? params.query
                            : undefined,
                        operateNode: typeof params.operateNode === 'string' ? params.operateNode : undefined,
                    });
                    return textResult({
                        status: response.status,
                        ok: response.status >= 200 && response.status < 300,
                        data: response.data,
                    });
                }
                throw new Error(`Unsupported mode: ${String(mode)}`);
            },
        }, { optional: true });
    },
};
