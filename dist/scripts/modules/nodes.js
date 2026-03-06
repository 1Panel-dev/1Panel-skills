async function listNodeOptions(client, input) {
    return client.request({
        method: 'POST',
        path: '/api/v2/core/nodes/list',
        body: input,
    });
}
async function listAllNodes(client) {
    return client.request({
        method: 'GET',
        path: '/api/v2/core/nodes/all',
    });
}
async function listAllSimpleNodes(client) {
    return client.request({
        method: 'GET',
        path: '/api/v2/core/nodes/simple/all',
    });
}
async function listAppNodes(client) {
    return client.request({
        method: 'GET',
        path: '/api/v2/core/xpack/nodes/apps/update',
    });
}
async function getCurrentNodeSummary(client) {
    return client.request({
        method: 'GET',
        path: '/api/v2/dashboard/current/node',
    });
}
export const nodesModule = {
    id: 'nodes',
    title: 'Nodes',
    description: 'Node-management list and status reads. Some endpoints may require Pro or XPack.',
    actions: {
        listNodeOptions: {
            id: 'listNodeOptions',
            summary: 'Read node options for a given type.',
            method: 'POST',
            path: '/api/v2/core/nodes/list',
            execute: listNodeOptions,
        },
        listAllNodes: {
            id: 'listAllNodes',
            summary: 'Read the full node list and status.',
            method: 'GET',
            path: '/api/v2/core/nodes/all',
            execute: (client) => listAllNodes(client),
        },
        listAllSimpleNodes: {
            id: 'listAllSimpleNodes',
            summary: 'Read lightweight node cards for dashboard-style views.',
            method: 'GET',
            path: '/api/v2/core/nodes/simple/all',
            execute: (client) => listAllSimpleNodes(client),
        },
        listAppNodes: {
            id: 'listAppNodes',
            summary: 'Read node app-update counts. This is typically XPack-only.',
            method: 'GET',
            path: '/api/v2/core/xpack/nodes/apps/update',
            execute: (client) => listAppNodes(client),
        },
        getCurrentNodeSummary: {
            id: 'getCurrentNodeSummary',
            summary: 'Read current node resource summary.',
            method: 'GET',
            path: '/api/v2/dashboard/current/node',
            execute: (client) => getCurrentNodeSummary(client),
        },
    },
    reservedMutations: [
        {
            id: 'changeBind',
            method: 'POST',
            path: '/api/v2/core/licenses/bind/free',
            note: 'Reserved for future node-license binding changes.',
        },
    ],
};
