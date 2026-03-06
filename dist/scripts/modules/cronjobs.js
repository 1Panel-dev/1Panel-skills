async function searchCronjobs(client, input = {}) {
    return client.request({
        method: 'POST',
        path: '/api/v2/cronjobs/search',
        operateNode: input.operateNode,
        body: {
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 20,
            info: input.info ?? '',
            groupIDs: input.groupIDs ?? [],
            orderBy: input.orderBy ?? 'created_at',
            order: input.order ?? 'descending',
        },
    });
}
async function loadCronjobInfo(client, input) {
    return client.request({
        method: 'POST',
        path: '/api/v2/cronjobs/load/info',
        body: input,
    });
}
async function loadNextHandle(client, input) {
    return client.request({
        method: 'POST',
        path: '/api/v2/cronjobs/next',
        body: input,
    });
}
async function searchCronjobRecords(client, input) {
    return client.request({
        method: 'POST',
        path: '/api/v2/cronjobs/search/records',
        body: {
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 20,
            cronjobID: input.cronjobID,
            startTime: input.startTime ?? '',
            endTime: input.endTime ?? '',
            status: input.status ?? '',
        },
    });
}
async function getCronjobRecordLog(client, input) {
    return client.request({
        method: 'POST',
        path: '/api/v2/cronjobs/records/log',
        body: input,
    });
}
async function loadScriptOptions(client) {
    return client.request({
        method: 'GET',
        path: '/api/v2/cronjobs/script/options',
    });
}
async function searchScriptLibrary(client, input = {}) {
    return client.request({
        method: 'POST',
        path: '/api/v2/core/script/search',
        body: {
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 20,
        },
    });
}
export const cronjobsModule = {
    id: 'cronjobs',
    title: 'Cronjobs',
    description: 'Cronjob reads, next-run preview, record inspection, and script library reads.',
    actions: {
        searchCronjobs: {
            id: 'searchCronjobs',
            summary: 'Read paginated cronjob rows and their status.',
            method: 'POST',
            path: '/api/v2/cronjobs/search',
            nodeAware: true,
            execute: searchCronjobs,
        },
        loadCronjobInfo: {
            id: 'loadCronjobInfo',
            summary: 'Read one cronjob configuration in detail.',
            method: 'POST',
            path: '/api/v2/cronjobs/load/info',
            execute: loadCronjobInfo,
        },
        loadNextHandle: {
            id: 'loadNextHandle',
            summary: 'Preview upcoming execution times for a cron spec.',
            method: 'POST',
            path: '/api/v2/cronjobs/next',
            execute: loadNextHandle,
        },
        searchCronjobRecords: {
            id: 'searchCronjobRecords',
            summary: 'Read cronjob execution records and their status.',
            method: 'POST',
            path: '/api/v2/cronjobs/search/records',
            execute: searchCronjobRecords,
        },
        getCronjobRecordLog: {
            id: 'getCronjobRecordLog',
            summary: 'Read the log of one cronjob execution record.',
            method: 'POST',
            path: '/api/v2/cronjobs/records/log',
            execute: getCronjobRecordLog,
        },
        loadScriptOptions: {
            id: 'loadScriptOptions',
            summary: 'Read available script options for cronjob bindings.',
            method: 'GET',
            path: '/api/v2/cronjobs/script/options',
            execute: (client) => loadScriptOptions(client),
        },
        searchScriptLibrary: {
            id: 'searchScriptLibrary',
            summary: 'Read script-library rows for cronjob references.',
            method: 'POST',
            path: '/api/v2/core/script/search',
            execute: searchScriptLibrary,
        },
    },
    reservedMutations: [
        {
            id: 'createCronjob',
            method: 'POST',
            path: '/api/v2/cronjobs',
            note: 'Reserved for future cronjob creation.',
        },
        {
            id: 'updateCronjob',
            method: 'POST',
            path: '/api/v2/cronjobs/update',
            note: 'Reserved for future cronjob changes.',
        },
        {
            id: 'updateCronjobStatus',
            method: 'POST',
            path: '/api/v2/cronjobs/status',
            note: 'Reserved for enable/disable operations.',
        },
        {
            id: 'handleCronjobOnce',
            method: 'POST',
            path: '/api/v2/cronjobs/handle',
            note: 'Reserved for manual trigger operations.',
        },
    ],
};
