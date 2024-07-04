import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Select, TextInput } from '@mantine/core';
import * as messages from './messages/viewFormText';
const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true,
  questionTypes: ["text", "comment", "checkbox", "radiogroup", "dropdown", "boolean", "ranking"]
};

const defaultJson = {
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

export default function SurveyCreatorWidget() {
  const [formData, setFormData] = useState(null);
  const [load, setLoad] = useState(false);
  const [creator, setCreator] = useState(null);
  const [link, setLink] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const location = useLocation();
  const [templateData, setTemplateData] = useState(null);

  useEffect(() => {
    const initializeSurveyCreator = async () => {
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      const TemplateId = params.get("TemplateId");

      const getTokenFromCookie = () => {
        const cookies = document.cookie.split(";");
        const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("token="));
        if (tokenCookie) {
          return tokenCookie.split("=")[1];
        } else {
          return null;
        }
      };

      const token = getTokenFromCookie();
      console.log(token);

      try {
        let template = null;
        if (TemplateId) {
          const templateResponse = await fetch("http://localhost:5000/getTemplate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ TemplateId }),
          });

          if (templateResponse.ok) {
            template = await templateResponse.json();
            setTemplateData(template.templateData);
            console.log(template);
          } else {
            console.error("Failed to fetch template data");
          }
        }
        let formDataResponse;
        if (template) {
          const surveyCreator = new SurveyCreator({ showLogicTab: true, isAutoSave: true });
          surveyCreator.text = template.existingTemplate.TemplateData;
          setCreator(surveyCreator);
          setLoad(true);
          setFormData(template); // Assuming template contains necessary form data structure
        } else if (id) {
          formDataResponse = await fetch(`http://localhost:5000/ArrayForm?id=${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (formDataResponse.ok) {
            const data = await formDataResponse.json();
            console.log("Form Data:", data);
            const surveyCreator = new SurveyCreator({ showLogicTab: true, isAutoSave: true });
            surveyCreator.text = data.formData;
            setLoad(true);
            setFormData(data);
            setCreator(surveyCreator);
          } else {
            console.error("Failed to fetch form data");
          }
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    initializeSurveyCreator();
  }, [location.search]);

  const saveFormData = async (isDraft) => {
    try {
      const token = getCookie('token');
      const creatorJSON = JSON.parse(creator.text);
      const response = await fetch('http://localhost:5000/formSave', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          formData: creatorJSON,
          formName: creatorJSON['title'],
          type: type,
          DateRange: !isDraft ? [new Date(startDate).toISOString(), new Date(endDate).toISOString()] : [],
          isDraft: isDraft
        })
      });

      if (response.ok) {
        toast.success(messages.saveFormSuccessMessage);
        let res = await response.json();
        const currentUrl = window.location.href;
        const baseUrl = new URL(currentUrl).origin;
       if(!isDraft)setLink(`${baseUrl}/forms?id=${res.savedFormData.id}`);
      } else {
        toast.error(messages.saveFormErrorMessage);
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      toast.error(messages.saveFormErrorMessage);
    }
  };

  const handleSaveButtonClick = () => {
    if (creator) {
      creator.saveSurvey();
      saveFormData(true);
    } else {
      toast.error("Survey creator is not initialized.");
    }
  };

  const handlePublishButtonClick = () => {
    if (type === "open") {
      publishForm(false);
    } else if (!startDate && !endDate) {
      setModalIsOpen(true);
    } else {
      publishForm(false);
    }
  };

  const publishForm = async (isDraft = false) => {
    if (!isDraft && (type === "one-time" || type === "recurring") && (!startDate || !endDate)) {
      toast.error(messages.endDateMissingMessage);
      return;
    }

    try {
      const token = getCookie('token');
      const creatorJSON = JSON.parse(creator.text);
      const response = await fetch('http://localhost:5000/formSave', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          formData: creatorJSON,
          formName: creatorJSON['title'],
          type: type,
          DateRange: !isDraft ? [new Date(startDate).toISOString(), new Date(endDate).toISOString()] : [],
          isDraft: isDraft
        })
      });
      if (response.ok) {
        toast.success(messages.saveFormLinkSuccessMessage);
        let res = await response.json();
        if (!isDraft) {
          console.log("dasd");
          updateLink(res.savedFormData.id);
        }
      } else {
        toast.error(messages.saveFormErrorMessage);
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      toast.error(messages.saveFormErrorMessage);
    }
  };

  const updateLink = async (id) => {
    const currentUrl = window.location.href;
    const baseUrl = new URL(currentUrl).origin;
    
    try {
      const token = getCookie('token');
      const response = await fetch('http://localhost:5000/updateLink', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          formId: id,
          formLink: `${baseUrl}/forms?id=${id}`
        })
      });
      if (response.ok) {
        let res = await response.json();
        setLink(`${baseUrl}/forms?id=${id}`);
      } else {
        toast.error("Failed to save the form link. Please try again later.");
      }
    } catch (error) {
      console.error("Error saving form link:", error);
      toast.error("An error occurred while saving the form link.");
    }
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleSubmitModal = () => {
    if (type === "one-time" || type === "recurring") {
      if (!startDate || !endDate) {
        toast.error("Please provide both start and end dates.");
        return;
      }
    } else if (type === "open") {
      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);
      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(nextYear.toISOString().split('T')[0]);
    }
    setModalIsOpen(false);
  };

  return (
    <div>
      {load && formData && creator ? (
        <>
          <SurveyCreatorComponent creator={creator} />
          <Button onClick={handleSaveButtonClick} style={{marginRight: '10px'}}>Save as draft</Button>
          <Button onClick={handlePublishButtonClick}>Publish Form</Button>
          {link && <p>Form Link: <a href={link}>{link}</a></p>}
          <Modal opened={modalIsOpen} onClose={handleModalClose} title="Choose Type">
            <Select
              label="Form Type"
              placeholder="Pick one"
              data={[
                               { value: 'open', label: 'Open' },
                { value: 'one-time', label: 'One-time' },
                { value: 'recurring', label: 'Recurring' }
              ]}
              value={type}
              onChange={setType}
            />
            {(type === "one-time" || type === "recurring") && (
              <>
                <TextInput
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.currentTarget.value)}
                />
                <TextInput
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.currentTarget.value)}
                />
              </>
            )}
            <Button onClick={handleSubmitModal}>submit</Button>
          </Modal>
          <ToastContainer />
        </>
      ) : (
        <p>{messages.loadingMessage}</p>
      )}
      <Modal
        opened={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        title="Oops"
      >
        <p>{messages.formClosedMessage}</p>
      </Modal>
    </div>
  );
}

