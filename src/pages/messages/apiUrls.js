// apiUrls.js
export const BASE_URL = 'http://localhost:5000';

export const URLs = {
    REGISTER :`${BASE_URL}/register`,
    INDIVIDUAL_RESPONSE :`${BASE_URL}/individualResponses`,
    RESPONSES :`${BASE_URL}/getResponse`,
    LOGIN: `${BASE_URL}/loginUserName`,
  CHECK_USER: `${BASE_URL}/checkUser`,
  FORGOT_PASSWORD: `${BASE_URL}/forgot-password`,
  GET_FORM: `${BASE_URL}/getForm`,
  GET_TEMPLATES: `${BASE_URL}/getTemplates`,
  DELETE_FORM: `${BASE_URL}/deleteForm`,
  PERMANENT_DELETE_FORM: `${BASE_URL}/permenantdeleteForm`,
  ARCHIVE_FORM: `${BASE_URL}/archiveForm`,
  ARCHIVE_OFF_FORM: `${BASE_URL}/ArchiveOff`,
  RETRIEVE_FORM: `${BASE_URL}/retriveForm`,
  SEND_FORM_LINK_MAIL: `${BASE_URL}/sendFormLinkMail`,
  DELETE_TEMPLATE: `${BASE_URL}/DeleteTemplate`,
  PERMANENT_DELETE_TEMPLATE: `${BASE_URL}/PermenantDeleteTemplate`,
  ARCHIVE_TEMPLATE: `${BASE_URL}/archiveTemplate`,
  ARCHIVE_OFF_TEMPLATE: `${BASE_URL}/archiveOffTemplate`,
  RESTORE_TEMPLATE: `${BASE_URL}/restoreTemplate`,
};

export const URL_GET_TEMPLATE = `${BASE_URL}/getTemplate`;
export const URL_ARRAY_FORM = (id) => `${BASE_URL}/ArrayForm?id=${id}`;
export const URL_FORM_SAVE = `${BASE_URL}/formSave`;
export const URL_UPDATE_LINK = `${BASE_URL}/updateLink`;

