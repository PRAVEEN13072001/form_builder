export const API_URLS = {
  DECRYPT_ID: `${process.env.REACT_APP_API_BASE_URL}/decryptId`,
  ARRAY_FORM: `${process.env.REACT_APP_API_BASE_URL}/ArrayForm`,
  RESPONSE_SAVE: `${process.env.REACT_APP_API_BASE_URL}/ResponseSave`
};

export const MESSAGES = {
  DECRYPT_ID_FAIL: 'Failed to decrypt ID',
  FETCH_FORM_FAIL: 'Failed to fetch form data',
  SAVE_RESPONSE_SUCCESS: 'Response saved successfully!',
  SAVE_RESPONSE_FAIL: 'Failed to save response data'
};
