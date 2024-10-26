export interface ApiResponse {
    code: number;
    status: boolean;
    msg: string;
    data?: string | object;
    total?: number;
}