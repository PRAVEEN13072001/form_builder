import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Survey, Model } from 'survey-react-ui';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal'; // Import the Modal component

export default function App() {
  const [formArray, setFormArray] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const location = useLocation();

  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));

    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    } else {
      return null;
    }
  };

  // Function to fetch decrypted formId from API
  const fetchDecryptedId = async (encryptedId) => {
    try {
      const token = getTokenFromCookie();
      const response = await fetch('http://localhost:5000/decryptId', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encryptedId: encryptedId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to decrypt ID');
      }

      const decryptedData = await response.json();
      console.log('Decrypted ID:', decryptedData.decryptedId);
      return decryptedData.decryptedId;
    } catch (error) {
      console.error('Error decrypting ID:', error);
      throw error;
    }
  };

  const checkFormValidity = async (data) => {
    const currentDate = new Date();
    const startDate = new Date(data.dateRange[0]);
    const endDate = new Date(data.dateRange[1]);
    
    return currentDate >= startDate && currentDate <= endDate;
  };

  const checkForm = async (formId) => {
    try {
      const token = getTokenFromCookie();
      const response = await fetch('http://localhost:5000/ArrayForm?id=' + formId, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch form data');
      }

      const formData = await response.json();
      console.log(formData);
      const isValid = await checkFormValidity(formData);
      
      if (!isValid && formData.type !== 'open') {
        setShowModal(true);
      }

      setFormArray(formData.formData);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const alertResults = useCallback(async (sender) => {
    console.log(sender);
    try {
      console.log("Survey completed:", sender.data);

      const searchParams = new URLSearchParams(location.search);
      const encryptedId = searchParams.get('id');
      const decryptedId = await fetchDecryptedId(encryptedId);

      const token = getTokenFromCookie();

      // Construct response data including question titles
      const responseData = Object.keys(sender.data).map((questionName) => {
        const question = sender.getQuestionByName(questionName);
        return {
          name: questionName,
          title: question.title,
          answer: sender.data[questionName]
        };
      });

      const response = await fetch('http://localhost:5000/ResponseSave', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: decryptedId,
          data: responseData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save response data');
      }

      const savedResponseData = await response.json();
      console.log('Response saved:', savedResponseData);

      // Show toast notification on successful save
      toast.success('Response saved successfully!');

    } catch (error) {
      console.error('Error saving response data:', error);
      toast.error('Failed to save response data');
    }
  }, [location.search, getTokenFromCookie]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const encryptedId = searchParams.get('id');
        const decryptedId = await fetchDecryptedId(encryptedId);
        await checkForm(decryptedId);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    fetchData();
  }, [location.search]);

  let survey = null;
  if (formArray) {
    survey = new Model(formArray);
    survey.onComplete.add(alertResults);
  }

  return (
    <div>
      <ToastContainer />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} /> {/* Modal component */}
      {survey && <Survey model={survey} />}
    </div>
  );
}
