export interface Request<T> {
    value: T;
    headers: Record<string, any>;
}

export type ConfigRequest<T> = Request<T> | T;