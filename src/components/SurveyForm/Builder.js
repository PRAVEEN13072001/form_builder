import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Modal, Button, Select, TextInput } from '@mantine/core';
import { useNavigate } from "react-router-dom";

const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true,
  questionTypes: ["text", "comment", "checkbox", "radiogroup", "dropdown", "boolean", "ranking"]
};

const defaultJson = {

};

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
    // Get token from cookies
    const token = getCookie('token');

    // Encrypt the ID
    const encryptResponse = await fetch('http://localhost:5000/encryptId', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ id })
    });

    if (!encryptResponse.ok) {
      throw new Error('Failed to encrypt ID');
    }

    const { encryptedId } = await encryptResponse.json();

    // Update the link with the encrypted ID
    const updateResponse = await fetch('http://localhost:5000/updateLink', {
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
      toast.success("Your form has been saved successfully!");
      setLink(`${baseUrl}/forms?id=${encryptedId}`);
      Navigate("/");
    } else {
      toast.error("Failed to save the form link. Please try again later.");
    }
  } catch (error) {
    console.error("Error saving form LINK:", error);
    toast.error("An error occurred while saving the form LINK.");
  }
};


  const publishForm = async (isDraft = false) => {
    if (!isDraft && (type === "one-time" || type === "recurring") && (!startDate || !endDate)) {
      toast.error("Please provide both start and end dates.");
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
          DateRange: !(type==='open') ? [new Date(startDate).toISOString(), new Date(endDate).toISOString()] : [],
          isDraft: isDraft
        })
      });
      if (response.ok) {
        toast.success("Your form has been saved successfully!");
        let res = await response.json();
        if (!isDraft) {
          updateLink(res.savedFormData.id);
        }
      } else {
        toast.error("Failed to save the form data. Please try again later.");
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      toast.error("An error occurred while saving the form data.");
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
        <Button onClick={handleSubmitModal}>Submit</Button>
      </Modal>
      <ToastContainer />
    </div>
  );
}
