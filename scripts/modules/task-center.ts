import type { ModuleDefinition, OnePanelClientLike, PageInput } from '../types.js';

export interface TaskCenterSearchInput extends PageInput {
  type?: string;
  status?: string;
  operateNode?: string;
}

async function searchTasks(
  client: OnePanelClientLike,
  input: TaskCenterSearchInput = {},
) {
  return client.request({
    method: 'POST',
    path: '/api/v2/logs/tasks/search',
    operateNode: input.operateNode,
    body: {
      page: input.page ?? 1,
      pageSize: input.pageSize ?? 20,
      type: input.type ?? '',
      status: input.status ?? '',
    },
  });
}

async function countExecutingTasks(client: OnePanelClientLike) {
  return client.request({
    method: 'GET',
    path: '/api/v2/logs/tasks/executing/count',
  });
}

export const taskCenterModule: ModuleDefinition = {
  id: 'task-center',
  title: 'Task Center',
  description: '1Panel task-center reads and executing-count inspection.',
  actions: {
    searchTasks: {
      id: 'searchTasks',
      summary: 'Read 1Panel task-center rows and status fields.',
      method: 'POST',
      path: '/api/v2/logs/tasks/search',
      nodeAware: true,
      execute: searchTasks,
    },
    countExecutingTasks: {
      id: 'countExecutingTasks',
      summary: 'Read the number of currently executing tasks.',
      method: 'GET',
      path: '/api/v2/logs/tasks/executing/count',
      execute: (client) => countExecutingTasks(client),
    },
  },
  reservedMutations: [],
};
