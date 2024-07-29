import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Modal, Button, Select, TextInput } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import { creatorOptions, defaultJson, apiEndpoints, messages, formTypes } from './messages.js/BuilderTexts';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function SurveyCreatorWidget() {
  const Navigate = useNavigate();
  const [link, setLink] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const creator = new SurveyCreator(creatorOptions);
  creator.text = window.localStorage.getItem("survey-json") || JSON.stringify(defaultJson);

 const updateLink = async (id) => {
  const currentUrl = window.location.href;
  const baseUrl = new URL(currentUrl).origin;

  try {
    const token = getCookie('token');

    const encryptResponse = await fetch(apiEndpoints.encryptId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ id })
    });

    if (!encryptResponse.ok) {
      throw new Error(messages.errorEncryptId);
    }

    const { encryptedId } = await encryptResponse.json();

    const updateResponse = await fetch(apiEndpoints.updateLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({
        formId: id,
        formLink: `${baseUrl}/forms?id=${encryptedId}`
      })
    });

    if (updateResponse.ok) {
      toast.success(messages.successFormSave);
      setLink(`${baseUrl}/forms?id=${encryptedId}`);
      Navigate("/");
    } else {
      toast.error(messages.errorSaveLink);
    }
  } catch (error) {
    console.error("Error saving form LINK:", error);
    toast.error(messages.errorGeneral);
  }
};

  const publishForm = async (isDraft = false) => {
    if (!isDraft && (type === "one-time" || type === "recurring") && (!startDate || !endDate)) {
      toast.error(messages.errorDateRange);
      return;
    }

    try {
      const token = getCookie('token');
      const creatorJSON = JSON.parse(creator.text);
      console.log(creatorJSON);
      const response = await fetch(apiEndpoints.formSave, {
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
          DateRange: !(type==='open') ? [new Date(startDate).toISOString(), new Date(endDate).toISOString()] : [],
          isDraft: isDraft
        })
      });
      if (response.ok) {
        toast.success(messages.successFormSave);
        let res = await response.json();
        if (!isDraft) {
          updateLink(res.savedFormData.id);
        }
      } else {
        toast.error(messages.errorFormSave);
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      toast.error(messages.errorGeneral);
    }
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleSubmitModal = () => {
    if (type === "one-time" || type === "recurring") {
      if (!startDate || !endDate) {
        toast.error(messages.errorDateRange);
        return;
      }
    } else if (type === "open") {
      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);
      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(nextYear.toISOString().split('T')[0]);
    }
    publishForm(false);
    setModalIsOpen(false);
  };
  const handlePublishButtonClick = () => {
    window.localStorage.setItem("survey-json", creator.text);
      setModalIsOpen(true);
  };
  const handleSaveDraftButtonClick = () => {
    publishForm(true);
  };

  return (
    <div>
      <SurveyCreatorComponent creator={creator} />
      <Button onClick={handlePublishButtonClick} style={{ marginRight: '10px' }}>Publish Form</Button>
      <Button onClick={handleSaveDraftButtonClick}>Save as Draft</Button>
      {link && <p>Form Link: <a href={link}>{link}</a></p>}
      <Modal opened={modalIsOpen} onClose={handleModalClose} title="Choose Type">
        <Select
          label="Form Type"
          placeholder="Pick one"
          data={formTypes}
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
        <Button onClick={handleSubmitModal}>Submit</Button>
      </Modal>
      <ToastContainer />
    </div>
  );
}
