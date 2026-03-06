import { createHash } from 'node:crypto';
import http from 'node:http';
import https from 'node:https';
export class OnePanelClient {
    baseUrl;
    apiKey;
    timeoutMs;
    skipTlsVerify;
    defaultHeaders;
    constructor(config) {
        this.baseUrl = new URL(config.baseUrl);
        this.apiKey = config.apiKey;
        this.timeoutMs = config.timeoutMs ?? 30_000;
        this.skipTlsVerify = config.skipTlsVerify ?? false;
        this.defaultHeaders = config.defaultHeaders ?? {};
    }
    static fromEnv(env) {
        const baseUrl = env.ONEPANEL_BASE_URL?.trim();
        const apiKey = env.ONEPANEL_API_KEY?.trim();
        if (!baseUrl) {
            throw new Error('Missing ONEPANEL_BASE_URL');
        }
        if (!apiKey) {
            throw new Error('Missing ONEPANEL_API_KEY');
        }
        return new OnePanelClient({
            baseUrl,
            apiKey,
            timeoutMs: Number.parseInt(env.ONEPANEL_TIMEOUT_MS || '30000', 10),
            skipTlsVerify: /^(1|true|yes)$/i.test(env.ONEPANEL_SKIP_TLS_VERIFY || ''),
        });
    }
    async request(options) {
        const url = this.buildUrl(options.path, options.query, options.operateNode);
        const body = options.body === undefined ? undefined : JSON.stringify(options.body);
        const headers = this.buildHeaders(body);
        const isHttps = url.protocol === 'https:';
        const transport = isHttps ? https : http;
        return new Promise((resolve, reject) => {
            const request = transport.request({
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port || (isHttps ? 443 : 80),
                path: `${url.pathname}${url.search}`,
                method: options.method,
                headers,
                rejectUnauthorized: !this.skipTlsVerify,
                timeout: this.timeoutMs,
            }, (response) => {
                const chunks = [];
                response.on('data', (chunk) => {
                    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
                });
                response.on('end', () => {
                    const rawBody = Buffer.concat(chunks).toString('utf8');
                    const normalizedHeaders = normalizeHeaders(response.headers);
                    const data = parseResponseBody(rawBody, normalizedHeaders['content-type']);
                    resolve({
                        status: response.statusCode ?? 0,
                        headers: normalizedHeaders,
                        data,
                        rawBody,
                    });
                });
            });
            request.on('timeout', () => {
                request.destroy(new Error(`1Panel request timed out after ${this.timeoutMs}ms`));
            });
            request.on('error', reject);
            if (body !== undefined) {
                request.write(body);
            }
            request.end();
        });
    }
    buildUrl(path, query, operateNode) {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const url = new URL(normalizedPath, this.baseUrl);
        for (const [key, value] of Object.entries(query ?? {})) {
            if (value === undefined || value === null || value === '') {
                continue;
            }
            url.searchParams.set(key, String(value));
        }
        if (operateNode) {
            url.searchParams.set('operateNode', operateNode);
        }
        return url;
    }
    buildHeaders(body) {
        const timestamp = `${Math.floor(Date.now() / 1000)}`;
        const token = createHash('md5')
            .update(`1panel${this.apiKey}${timestamp}`)
            .digest('hex');
        return {
            Accept: 'application/json, text/plain, text/event-stream',
            'Content-Type': 'application/json',
            '1Panel-Token': token,
            '1Panel-Timestamp': timestamp,
            'Content-Length': body ? `${Buffer.byteLength(body)}` : '0',
            ...this.defaultHeaders,
        };
    }
}
function normalizeHeaders(headers) {
    const normalized = {};
    for (const [key, value] of Object.entries(headers)) {
        if (Array.isArray(value)) {
            normalized[key] = value.join(', ');
            continue;
        }
        if (value !== undefined) {
            normalized[key] = value;
        }
    }
    return normalized;
}
function parseResponseBody(rawBody, contentType) {
    if (contentType?.includes('application/json')) {
        return JSON.parse(rawBody);
    }
    try {
        return JSON.parse(rawBody);
    }
    catch {
        return rawBody;
    }
}
