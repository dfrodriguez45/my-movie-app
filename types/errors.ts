export interface TMDBError {
  status_code: number;
  status_message: string;
  success: boolean;
}

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public statusMessage: string,
    public originalError?: any
  ) {
    super(statusMessage);
    this.name = 'APIError';
  }
}

export const ERROR_MESSAGES = {
  1: 'Internal error: Something went wrong, contact TMDb.',
  2: 'The service is temporarily unavailable, try again later.',
  3: 'Authentication failed: You do not have permissions to access the service.',
  4: 'The resource you requested could not be found.',
  5: 'Invalid format: This service doesn\'t exist in that format.',
  6: 'Invalid parameters: Your request parameters are incorrect.',
  7: 'Invalid API key: You must be granted a valid key.',
  8: 'Duplicate entry: The data you tried to submit already exists.',
  9: 'Service offline: This service is temporarily offline, try again later.',
  10: 'Suspended API key: Access to your account has been suspended, contact TMDb.',
  11: 'Internal error: Something went wrong, contact TMDb.',
  12: 'The item/record was updated successfully.',
  13: 'The item/record was deleted successfully.',
  14: 'Authentication failed.',
  15: 'Failed.',
  16: 'Device denied.',
  17: 'Session denied.',
  18: 'Validation failed.',
  19: 'Invalid date range: Should be a range no longer than 14 days.',
  20: 'Invalid page: Pages start at 1 and max at 1000.',
  21: 'Invalid date: Format needs to be YYYY-MM-DD.',
  22: 'Invalid timezone: Please consult the documentation for a valid timezone.',
  23: 'Your request count (#) is over the allowed limit of (40).',
  24: 'Your request count (#) is over the allowed limit of (40).',
  25: 'Provided API key is invalid.',
  26: 'The filter is invalid.',
  27: 'Invalid username and/or password: You did not provide a valid login.',
  28: 'The resource you requested could not be found.',
  29: 'Your account is no longer active. Contact TMDb if this is an error.',
  30: 'Authentication failed: You do not have permissions to access the service.',
  31: 'There was an error validating your request.',
  32: 'The image you are trying to upload is too large.',
  33: 'Invalid image: File does not appear to be a valid image file.',
  34: 'The request limit for this resource has been reached for the primary translation.',
  35: 'Invalid date range: Should be a range no longer than 14 days.',
  36: 'The daily file download limit has been exceeded; file can be downloaded tomorrow.',
  37: 'The requested number of items to return for the request is invalid.',
  38: 'There was an error validating your request.',
  39: 'Invalid username and/or password: You did not provide a valid login.',
  40: 'The request token is either expired or invalid.',
  41: 'This token hasn\'t been granted write permission by the user.',
  42: 'The requested session could not be found.',
  43: 'You don\'t have permission to edit this resource.',
  44: 'The resource you requested could not be found.',
  45: 'This user has been suspended.',
  46: 'The API is undergoing maintenance. Try again later.',
  47: 'The input is not valid.',
  48: 'The status code is invalid.',
  49: 'The request token is either expired or invalid.',
  50: 'The session id is invalid.',
  51: 'You don\'t have permission to access this resource.',
  52: 'This user has been suspended.',
  53: 'This API key has been revoked.',
};