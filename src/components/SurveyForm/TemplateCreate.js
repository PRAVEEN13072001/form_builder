import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Modal, Button, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { SAVE_TEMPLATE_URL, MESSAGES } from '../messages.js/templateCreateTexts'; // Import constants and messages from config.js

const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true,
  questionTypes: ["text", "comment", "checkbox", "radiogroup", "dropdown", "boolean", "ranking"]
};
const defaultJson = {
  title: 'Template Title',
  pages: [{
    name: "Name",
    elements: [{
      name: "FirstName",
      title: "Enter your first name:",
      type: "text"
    },{
      name: "LastName",
      title: "Enter your last name:",
      type: "text"
    }]
  }]
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function TemplateCreatorWidget() {
  const [link, setLink] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const creator = new SurveyCreator(creatorOptions);
  creator.text = window.localStorage.getItem("survey-json") || JSON.stringify(defaultJson);

  useEffect(() => {
    setModalIsOpen(true); // Open modal on component mount for template creation
  }, []);

  const saveTemplateData = async (isDraft) => {
    try {
      const token = getCookie('token');
      const creatorJSON = JSON.parse(creator.text);
      const response = await fetch(SAVE_TEMPLATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          TemplateData: creatorJSON,
          TemplateName: creatorJSON['title'],
          isDraft: isDraft
        })
      });
      if (response.ok) {
        toast.success(MESSAGES.SUCCESS_SAVE, {
          onClose: () => navigate('/') // Navigate to home.jsx after successful toast
        });
        let res = await response.json();
      } else {
        toast.error(MESSAGES.ERROR_SAVE_FAIL);
      }
    } catch (error) {
      console.error("Error saving template data:", error);
      toast.error(MESSAGES.ERROR_SAVE);
    }
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleSubmitModal = () => {
    setModalIsOpen(false);
  };

  const handleSaveButtonClick = () => {
    saveTemplateData(false);
  };

  const handleSaveDraftButtonClick = () => {
    saveTemplateData(true);
  };

  return (
    <div>
      <SurveyCreatorComponent creator={creator} />
      <Button onClick={handleSaveButtonClick}>Save Template</Button>
      <Button onClick={handleSaveDraftButtonClick}>Save as Draft</Button>
      <ToastContainer />
    </div>
  );
}
