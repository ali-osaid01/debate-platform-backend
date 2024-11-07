export enum EUserRole {
    USER = 'user',
    ADMIN = 'admin'
}

export enum STATUS_CODES {
    SUCCESS = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500
}

export enum EventStatus {
    CANCELED = 'canceled',       
    ACTIVE = 'active',           
    STARTED = 'started',
    COMPLETED = 'completed',     
}

export enum ApprovalStatus {
    PENDING = 'pending',       
    APPROVED = 'approved',     
    REJECTED = 'rejected',   
}