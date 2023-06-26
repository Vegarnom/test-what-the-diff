// SET DEFAULT NUMBER FOR GENERATING HASH PASSWORD OR SOMETHING ...
export const SALT_OR_ROUNDS = 10;

export const JWT_CONSTANT = 'genkisystem-2018';

// TOGGLE:88  -  LOCK:82   -   UNLOCK:83
export const SESAME_CMD_CODE = {
  TOGGLE: 88,
  LOCK: 82,
  UNLOCK: 83,
};

export const SESAME_API_KEY = 'UW2JMvQ9nm52MxWOmDHWN9PliZSWn7179UkrAyu5';

export const TYPE_DATA = ['int', 'double', 'string', 'date', 'object', 'array', 'response_code'];

export const TYPE_DATA_FUNCTION = {
  int: (data) => {
    return data ? parseInt(data) : data;
  },
  double: (data) => {
    return data ? parseFloat(data) : data;
  },
  string: (data) => {
    return data ? '' + data : data;
  },
  date: (data) => {
    return data ? new Date(data).toISOString() : data;
  },
};

export const METHOD = ['POST', 'GET', 'PUT', 'DELETE'];

export const UsagePlanKioskId = 'b5be2i';

export const DeploymentRestApiNeedKey = {
  restApiId: process.env.AWS_NEED_KEY_REST_API_ID,
  stage: process.env.STAGE_NEED_KEY_REST_API,
}

export const DeploymentRestApiNoKey = {
  restApiId: process.env.AWS_NO_KEY_REST_API_ID,
  stage: process.env.STAGE_NO_KEY_REST_API,
}