export const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true,
  questionTypes: ["text", "comment", "checkbox", "radiogroup", "dropdown", "boolean", "ranking"]
};

export const defaultJson = {
  // your default JSON structure
};

export const apiEndpoints = {
  encryptId: `${process.env.REACT_APP_API_BASE_URL}/encryptId`,
  updateLink: `${process.env.REACT_APP_API_BASE_URL}/updateLink`,
  formSave: `${process.env.REACT_APP_API_BASE_URL}/formSave`
};

export const messages = {
  successFormSave: "Your form has been saved successfully!",
  errorFormSave: "Failed to save the form data. Please try again later.",
  errorEncryptId: "Failed to encrypt ID.",
  errorSaveLink: "Failed to save the form link. Please try again later.",
  errorGeneral: "An error occurred while saving the form data.",
  errorDateRange: "Please provide both start and end dates."
};

export const formTypes = [
  { value: 'open', label: 'Open' },
  { value: 'one-time', label: 'One-time' },
  { value: 'recurring', label: 'Recurring' }
];
