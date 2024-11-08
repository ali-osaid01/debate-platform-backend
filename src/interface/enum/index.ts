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
    ACTIVE = 'active',           
    CANCELED = 'canceled',       
    STARTED = 'started',
    COMPLETED = 'completed',     
}

export enum ApprovalStatus {
    PENDING = 'pending',       
    APPROVED = 'approved',     
    REJECTED = 'rejected',   
}

export enum ParticipantStatus {
    CONFIRMED = "confirmed",
    DECLINED = "declined",
    PENDING = "pending"
  }

  export enum ENOTIFICATION_TYPES {
    EVENT_ACCEPTED = 1,
    EVENT_INVITATION = 2,
    EVENT_REJECTED = 3,
    EVENT_CANCELLED = 4,
    EVENT_DELETED = 5,
  }