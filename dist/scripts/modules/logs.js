async function getOperationLogs(client, input = {}) {
    return client.request({
        method: 'POST',
        path: '/api/v2/core/logs/operation',
        body: {
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 20,
            source: input.source ?? '',
            status: input.status ?? '',
            operation: input.operation ?? '',
        },
    });
}
async function getLoginLogs(client, input = {}) {
    return client.request({
        method: 'POST',
        path: '/api/v2/core/logs/login',
        body: {
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 20,
            ip: input.ip ?? '',
            status: input.status ?? '',
        },
    });
}
async function getSystemFiles(client, input = {}) {
    return client.request({
        method: 'GET',
        path: '/api/v2/logs/system/files',
        operateNode: input.operateNode,
    });
}
async function readLogLines(client, input) {
    return client.request({
        method: 'POST',
        path: '/api/v2/files/read',
        operateNode: input.operateNode,
        body: {
            id: input.id,
            type: input.type,
            name: input.name,
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 200,
            taskID: input.taskID,
            taskType: input.taskType,
            taskOperate: input.taskOperate,
            resourceID: input.resourceID,
        },
    });
}
export const logsModule = {
    id: 'logs',
    title: 'Logs',
    description: 'Core login/operation logs, system log file lists, and generic line-by-line log reads.',
    actions: {
        getOperationLogs: {
            id: 'getOperationLogs',
            summary: 'Read panel operation logs.',
            method: 'POST',
            path: '/api/v2/core/logs/operation',
            execute: getOperationLogs,
        },
        getLoginLogs: {
            id: 'getLoginLogs',
            summary: 'Read panel login logs.',
            method: 'POST',
            path: '/api/v2/core/logs/login',
            execute: getLoginLogs,
        },
        getSystemFiles: {
            id: 'getSystemFiles',
            summary: 'Read the list of available system log files.',
            method: 'GET',
            path: '/api/v2/logs/system/files',
            nodeAware: true,
            execute: getSystemFiles,
        },
        readLogLines: {
            id: 'readLogLines',
            summary: 'Read log lines by type and name. Useful for system, task, and website logs.',
            method: 'POST',
            path: '/api/v2/files/read',
            nodeAware: true,
            execute: readLogLines,
        },
    },
    reservedMutations: [
        {
            id: 'cleanLogs',
            method: 'POST',
            path: '/api/v2/core/logs/clean',
            note: 'Reserved for future log cleanup operations.',
        },
    ],
};
