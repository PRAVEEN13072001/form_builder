export const FETCH_TEMPLATE_URL = `${process.env.REACT_APP_API_BASE_URL}/getTemplates`;
export const SAVE_TEMPLATE_URL = `${process.env.REACT_APP_API_BASE_URL}/templateSave`;

export const SUCCESS_MESSAGE = "Your template has been saved successfully!";
export const ERROR_MESSAGE_FETCH = "An error occurred while fetching the survey data.";
export const ERROR_MESSAGE_SAVE = "An error occurred while saving the template data.";
export const WARNING_NO_SURVEY = "No survey found with the provided name.";
export const ERROR_NO_TOKEN = "Token not found in cookies";
export const ERROR_FETCH_FAIL = "Failed to fetch data from server";
export const ERROR_SAVE_FAIL = "Failed to save the template data. Please try again later.";
