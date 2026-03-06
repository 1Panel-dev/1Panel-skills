export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  body?: unknown;
  query?: Record<string, QueryValue>;
  operateNode?: string;
}

export interface OnePanelResponse<T> {
  status: number;
  headers: Record<string, string>;
  data: T;
  rawBody: string;
}

export interface OnePanelClientLike {
  request<T = unknown>(options: RequestOptions): Promise<OnePanelResponse<T>>;
}

export interface PageInput {
  page?: number;
  pageSize?: number;
}

export interface ReservedMutation {
  id: string;
  method: HttpMethod;
  path: string;
  note: string;
}

export interface ModuleAction<Input = void, Output = unknown> {
  id: string;
  summary: string;
  method: HttpMethod;
  path: string;
  nodeAware?: boolean;
  execute(client: OnePanelClientLike, input: Input): Promise<OnePanelResponse<Output>>;
}

export interface ModuleDefinition {
  id: string;
  title: string;
  description: string;
  actions: Record<string, ModuleAction<any, any>>;
  reservedMutations: ReservedMutation[];
}
