async function searchWebsites(client, input = {}) {
    return client.request({
        method: 'POST',
        path: '/api/v2/websites/search',
        operateNode: input.operateNode,
        body: {
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 20,
            name: input.name ?? '',
            websiteGroupId: input.websiteGroupId ?? 0,
            orderBy: input.orderBy ?? 'created_at',
            order: input.order ?? 'descending',
        },
    });
}
async function listWebsites(client) {
    return client.request({
        method: 'GET',
        path: '/api/v2/websites/list',
    });
}
async function getWebsite(client, input) {
    return client.request({
        method: 'GET',
        path: `/api/v2/websites/${input.id}`,
    });
}
async function getWebsiteConfig(client, input) {
    return client.request({
        method: 'GET',
        path: `/api/v2/websites/${input.id}/config/${input.type}`,
    });
}
async function listDomains(client, input) {
    return client.request({
        method: 'GET',
        path: `/api/v2/websites/domains/${input.id}`,
    });
}
async function getHttpsConfig(client, input) {
    return client.request({
        method: 'GET',
        path: `/api/v2/websites/${input.id}/https`,
    });
}
async function searchCertificates(client, input = {}) {
    return client.request({
        method: 'POST',
        path: '/api/v2/websites/ssl/search',
        body: {
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 20,
            name: input.name ?? '',
            acmeAccountID: input.acmeAccountID ?? '',
        },
    });
}
async function listCertificates(client, input = {}) {
    return client.request({
        method: 'POST',
        path: '/api/v2/websites/ssl/list',
        body: {
            name: input.name ?? '',
            acmeAccountID: input.acmeAccountID ?? '',
        },
    });
}
async function getCertificate(client, input) {
    return client.request({
        method: 'GET',
        path: `/api/v2/websites/ssl/${input.id}`,
    });
}
async function readWebsiteLogLines(client, input) {
    return client.request({
        method: 'POST',
        path: '/api/v2/files/read',
        operateNode: input.operateNode,
        body: {
            id: input.id,
            type: 'website',
            name: input.logName,
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 200,
        },
    });
}
export const websitesModule = {
    id: 'websites',
    title: 'Websites',
    description: 'Website list/detail reads, HTTPS and certificate reads, and website log reads.',
    actions: {
        searchWebsites: {
            id: 'searchWebsites',
            summary: 'Read paginated website rows and status fields.',
            method: 'POST',
            path: '/api/v2/websites/search',
            nodeAware: true,
            execute: searchWebsites,
        },
        listWebsites: {
            id: 'listWebsites',
            summary: 'Read simple website options.',
            method: 'GET',
            path: '/api/v2/websites/list',
            execute: (client) => listWebsites(client),
        },
        getWebsite: {
            id: 'getWebsite',
            summary: 'Read one website detail, including runtime and log-path metadata.',
            method: 'GET',
            path: '/api/v2/websites/:id',
            execute: getWebsite,
        },
        getWebsiteConfig: {
            id: 'getWebsiteConfig',
            summary: 'Read one website config file by config type.',
            method: 'GET',
            path: '/api/v2/websites/:id/config/:type',
            execute: getWebsiteConfig,
        },
        listDomains: {
            id: 'listDomains',
            summary: 'Read the domains bound to a website.',
            method: 'GET',
            path: '/api/v2/websites/domains/:id',
            execute: listDomains,
        },
        getHttpsConfig: {
            id: 'getHttpsConfig',
            summary: 'Read HTTPS config for one website.',
            method: 'GET',
            path: '/api/v2/websites/:id/https',
            execute: getHttpsConfig,
        },
        searchCertificates: {
            id: 'searchCertificates',
            summary: 'Read paginated SSL certificate rows.',
            method: 'POST',
            path: '/api/v2/websites/ssl/search',
            execute: searchCertificates,
        },
        listCertificates: {
            id: 'listCertificates',
            summary: 'Read SSL certificate options.',
            method: 'POST',
            path: '/api/v2/websites/ssl/list',
            execute: listCertificates,
        },
        getCertificate: {
            id: 'getCertificate',
            summary: 'Read one SSL certificate in detail.',
            method: 'GET',
            path: '/api/v2/websites/ssl/:id',
            execute: getCertificate,
        },
        readWebsiteLogLines: {
            id: 'readWebsiteLogLines',
            summary: 'Read website log lines through the generic file-log endpoint. Common names are access.log and error.log.',
            method: 'POST',
            path: '/api/v2/files/read',
            nodeAware: true,
            execute: readWebsiteLogLines,
        },
    },
    reservedMutations: [
        {
            id: 'createWebsite',
            method: 'POST',
            path: '/api/v2/websites',
            note: 'Reserved for future website creation.',
        },
        {
            id: 'updateWebsite',
            method: 'POST',
            path: '/api/v2/websites/update',
            note: 'Reserved for future website updates.',
        },
        {
            id: 'operateWebsite',
            method: 'POST',
            path: '/api/v2/websites/operate',
            note: 'Reserved for start/stop/restart operations.',
        },
        {
            id: 'deleteWebsite',
            method: 'POST',
            path: '/api/v2/websites/del',
            note: 'Reserved for future deletion.',
        },
        {
            id: 'updateHttpsConfig',
            method: 'POST',
            path: '/api/v2/websites/:id/https',
            note: 'Reserved for HTTPS and certificate changes.',
        },
        {
            id: 'updateCertificate',
            method: 'POST',
            path: '/api/v2/websites/ssl/update',
            note: 'Reserved for SSL mutations.',
        },
    ],
};
