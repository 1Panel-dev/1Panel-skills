async function searchContainers(client, input = {}) {
    return client.request({
        method: 'POST',
        path: '/api/v2/containers/search',
        body: {
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 20,
            name: input.name ?? '',
            state: input.state ?? '',
            filters: input.filters ?? '',
            orderBy: input.orderBy ?? 'created_at',
            order: input.order ?? 'descending',
        },
    });
}
async function listContainers(client) {
    return client.request({
        method: 'POST',
        path: '/api/v2/containers/list',
        body: {},
    });
}
async function getContainerStatus(client) {
    return client.request({
        method: 'GET',
        path: '/api/v2/containers/status',
    });
}
async function getResourceLimit(client) {
    return client.request({
        method: 'GET',
        path: '/api/v2/containers/limit',
    });
}
async function getContainerInfo(client, input) {
    return client.request({
        method: 'POST',
        path: '/api/v2/containers/info',
        body: input,
    });
}
async function inspectContainer(client, input) {
    return client.request({
        method: 'POST',
        path: '/api/v2/containers/inspect',
        body: input,
    });
}
async function getContainerStats(client, input) {
    return client.request({
        method: 'GET',
        path: `/api/v2/containers/stats/${input.id}`,
    });
}
async function getContainerListStats(client) {
    return client.request({
        method: 'GET',
        path: '/api/v2/containers/list/stats',
    });
}
async function streamContainerLogs(client, input) {
    return client.request({
        method: 'GET',
        path: '/api/v2/containers/search/log',
        operateNode: input.operateNode,
        query: {
            container: input.container,
            compose: input.compose,
            since: input.since,
            follow: input.follow ?? false,
            tail: input.tail ?? '200',
            timestamp: input.timestamp ?? false,
        },
    });
}
export const containersModule = {
    id: 'containers',
    title: 'Containers',
    description: 'Container status reads, inspect reads, resource stats, and streaming log reads.',
    actions: {
        searchContainers: {
            id: 'searchContainers',
            summary: 'Read paginated container rows and state fields.',
            method: 'POST',
            path: '/api/v2/containers/search',
            execute: searchContainers,
        },
        listContainers: {
            id: 'listContainers',
            summary: 'Read simple container options.',
            method: 'POST',
            path: '/api/v2/containers/list',
            execute: (client) => listContainers(client),
        },
        getContainerStatus: {
            id: 'getContainerStatus',
            summary: 'Read Docker and container aggregate status.',
            method: 'GET',
            path: '/api/v2/containers/status',
            execute: (client) => getContainerStatus(client),
        },
        getResourceLimit: {
            id: 'getResourceLimit',
            summary: 'Read CPU and memory limits available for containers.',
            method: 'GET',
            path: '/api/v2/containers/limit',
            execute: (client) => getResourceLimit(client),
        },
        getContainerInfo: {
            id: 'getContainerInfo',
            summary: 'Read one container detail by name.',
            method: 'POST',
            path: '/api/v2/containers/info',
            execute: getContainerInfo,
        },
        inspectContainer: {
            id: 'inspectContainer',
            summary: 'Read raw inspect output for a container or related object.',
            method: 'POST',
            path: '/api/v2/containers/inspect',
            execute: inspectContainer,
        },
        getContainerStats: {
            id: 'getContainerStats',
            summary: 'Read live metrics for one container ID.',
            method: 'GET',
            path: '/api/v2/containers/stats/:id',
            execute: getContainerStats,
        },
        getContainerListStats: {
            id: 'getContainerListStats',
            summary: 'Read summarized live metrics for all listed containers.',
            method: 'GET',
            path: '/api/v2/containers/list/stats',
            execute: (client) => getContainerListStats(client),
        },
        streamContainerLogs: {
            id: 'streamContainerLogs',
            summary: 'Read container or compose logs as text. Use container or compose to target the source.',
            method: 'GET',
            path: '/api/v2/containers/search/log',
            nodeAware: true,
            execute: streamContainerLogs,
        },
    },
    reservedMutations: [
        {
            id: 'createContainer',
            method: 'POST',
            path: '/api/v2/containers',
            note: 'Reserved for future container creation.',
        },
        {
            id: 'updateContainer',
            method: 'POST',
            path: '/api/v2/containers/update',
            note: 'Reserved for future container updates.',
        },
        {
            id: 'operateContainer',
            method: 'POST',
            path: '/api/v2/containers/operate',
            note: 'Reserved for start/stop/restart/remove operations.',
        },
    ],
};
