// PARAM
export const PARAM = {
    ACTIVO: '1',
    INACTIVO: '0',
    SI: '1',
    NO: '0',
    UNDEFINED: '-1',
    VACIO: '',
};

export const SI = '1';
export const NO = '0';

// HTTP RESPONSE
export const HTTP_RESPONSE = {
    SUCCESS: '1',
    WARNING: '2',
    ERROR: '3',
    INFO: '4',
    HTTP_200_OK: 200,
    HTTP_CREATED: 201,
    BAD_REQUEST: 400,
    PERMISION_ERROR: '401',
    CODE_NOT_DEFINED: '601',
    MALFORMED_JSON: '701',
    ACCESS_DENIED: '403'
};

export enum ACTION_CRUD {
    CREATE = '1',
    READ = '2',
    UPDATE = '3',
    DELETE = '4',
}

export enum ORDER_ARRAY {
    ASC = 0,
    DESC = 1,
}
