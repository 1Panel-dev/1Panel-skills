import type { ModuleDefinition, OnePanelClientLike, PageInput } from '../types.js';

export interface DashboardCurrentInput {
  ioOption: string;
  netOption: string;
}

export interface MonitorHistoryInput {
  param: string;
  io: string;
  network: string;
  startTime: string;
  endTime: string;
}

export interface GpuHistoryInput {
  productName: string;
  startTime: string;
  endTime: string;
}

async function getOsInfo(client: OnePanelClientLike) {
  return client.request({
    method: 'GET',
    path: '/api/v2/dashboard/base/os',
  });
}

async function getBaseInfo(client: OnePanelClientLike, input: DashboardCurrentInput) {
  return client.request({
    method: 'GET',
    path: `/api/v2/dashboard/base/${input.ioOption}/${input.netOption}`,
  });
}

async function getCurrentInfo(client: OnePanelClientLike, input: DashboardCurrentInput) {
  return client.request({
    method: 'GET',
    path: `/api/v2/dashboard/current/${input.ioOption}/${input.netOption}`,
  });
}

async function getCurrentNode(client: OnePanelClientLike) {
  return client.request({
    method: 'GET',
    path: '/api/v2/dashboard/current/node',
  });
}

async function getTopCpu(client: OnePanelClientLike) {
  return client.request({
    method: 'GET',
    path: '/api/v2/dashboard/current/top/cpu',
  });
}

async function getTopMem(client: OnePanelClientLike) {
  return client.request({
    method: 'GET',
    path: '/api/v2/dashboard/current/top/mem',
  });
}

async function getMonitorSetting(client: OnePanelClientLike) {
  return client.request({
    method: 'GET',
    path: '/api/v2/hosts/monitor/setting',
  });
}

async function searchMonitorHistory(client: OnePanelClientLike, input: MonitorHistoryInput) {
  return client.request({
    method: 'POST',
    path: '/api/v2/hosts/monitor/search',
    body: input,
  });
}

async function getGpuOptions(client: OnePanelClientLike) {
  return client.request({
    method: 'GET',
    path: '/api/v2/hosts/monitor/gpuoptions',
  });
}

async function searchGpuHistory(client: OnePanelClientLike, input: GpuHistoryInput) {
  return client.request({
    method: 'POST',
    path: '/api/v2/hosts/monitor/gpu/search',
    body: input,
  });
}

export const monitoringModule: ModuleDefinition = {
  id: 'monitoring',
  title: 'Monitoring',
  description: 'Resource monitoring, dashboard current status, top processes, and GPU history.',
  actions: {
    getOsInfo: {
      id: 'getOsInfo',
      summary: 'Read OS and disk summary from the dashboard base endpoint.',
      method: 'GET',
      path: '/api/v2/dashboard/base/os',
      execute: (client) => getOsInfo(client),
    },
    getBaseInfo: {
      id: 'getBaseInfo',
      summary: 'Read dashboard base metrics for the selected IO and network options.',
      method: 'GET',
      path: '/api/v2/dashboard/base/:ioOption/:netOption',
      execute: getBaseInfo,
    },
    getCurrentInfo: {
      id: 'getCurrentInfo',
      summary: 'Read live dashboard metrics for the selected IO and network options.',
      method: 'GET',
      path: '/api/v2/dashboard/current/:ioOption/:netOption',
      execute: getCurrentInfo,
    },
    getCurrentNode: {
      id: 'getCurrentNode',
      summary: 'Read the current node summary for node-management and simple dashboard views.',
      method: 'GET',
      path: '/api/v2/dashboard/current/node',
      execute: (client) => getCurrentNode(client),
    },
    getTopCpu: {
      id: 'getTopCpu',
      summary: 'Read top CPU processes.',
      method: 'GET',
      path: '/api/v2/dashboard/current/top/cpu',
      execute: (client) => getTopCpu(client),
    },
    getTopMem: {
      id: 'getTopMem',
      summary: 'Read top memory-consuming processes.',
      method: 'GET',
      path: '/api/v2/dashboard/current/top/mem',
      execute: (client) => getTopMem(client),
    },
    getMonitorSetting: {
      id: 'getMonitorSetting',
      summary: 'Read monitor retention and default chart settings.',
      method: 'GET',
      path: '/api/v2/hosts/monitor/setting',
      execute: (client) => getMonitorSetting(client),
    },
    searchMonitorHistory: {
      id: 'searchMonitorHistory',
      summary: 'Read historical monitor series data.',
      method: 'POST',
      path: '/api/v2/hosts/monitor/search',
      execute: searchMonitorHistory,
    },
    getGpuOptions: {
      id: 'getGpuOptions',
      summary: 'Read GPU option metadata for historical charts.',
      method: 'GET',
      path: '/api/v2/hosts/monitor/gpuoptions',
      execute: (client) => getGpuOptions(client),
    },
    searchGpuHistory: {
      id: 'searchGpuHistory',
      summary: 'Read historical GPU monitoring data.',
      method: 'POST',
      path: '/api/v2/hosts/monitor/gpu/search',
      execute: searchGpuHistory,
    },
  },
  reservedMutations: [
    {
      id: 'updateMonitorSetting',
      method: 'POST',
      path: '/api/v2/hosts/monitor/setting/update',
      note: 'Reserved for future monitor policy changes.',
    },
    {
      id: 'cleanMonitorData',
      method: 'POST',
      path: '/api/v2/hosts/monitor/clean',
      note: 'Reserved for future historical monitor cleanup.',
    },
  ],
};
