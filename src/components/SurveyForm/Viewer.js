import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Survey, Model } from 'survey-react-ui';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal'; // Import the Modal component
import { API_URLS, MESSAGES } from '../messages.js/viewerTexts'; // Import constants and messages from config.js

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
      const response = await fetch(API_URLS.DECRYPT_ID, {
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
        throw new Error(MESSAGES.DECRYPT_ID_FAIL);
      }

      const decryptedData = await response.json();
     
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
      const response = await fetch(`${API_URLS.ARRAY_FORM}?id=${formId}`, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(MESSAGES.FETCH_FORM_FAIL);
      }

      const formData = await response.json();
     
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
    const ele=sender.jsonObj.pages[0].elements;
    
    
    try {
      

      const searchParams = new URLSearchParams(location.search);
      const encryptedId = searchParams.get('id');
      const decryptedId = await fetchDecryptedId(encryptedId);

      const token = getTokenFromCookie();

      // Construct response data including question titles and types
    const responseData = Object.keys(sender.data).map((questionName) => {
    const question = sender.getQuestionByName(questionName);

    if (question.getType() === 'boolean') {
        // Get the boolean value
        const answer = sender.data[questionName];

        // Convert boolean to "yes" or "no"
        return {
            name: questionName,
            title: question.title,
            type: question.getType(), // Add question type
            answer: answer ? 'yes' : 'no'
        };
    }
 if (question.getType() === 'ranking') {
    const questionData = ele.find(e => e.name === questionName);
    

    // Assuming sender.data[questionName] is an array of values representing the ranking order
    const answer = sender.data[questionName].map(value => {
        const choice = questionData.choices.find(a => a.value === value);
        return choice ? choice.text : 'Unknown'; // Handle unknown choices
    }).join(', '); // Join the text values with commas


    return {
        name: questionName,
        title: question.title,
        type: question.getType(), // Add question type
        answer: answer
    };
}


    if (question.getType() === 'dropdown' ) {
        const questionData = ele.find(e => e.name === questionName);
       
        const answer = questionData.choices.find(a => a.value === sender.data[questionName]);
    
        return {
            name: questionName,
            title: question.title,
            type: question.getType(), // Add question type
            answer: answer? answer.text : sender.data[questionName]
        };
    }

    return {
        name: questionName,
        title: question.title,
        type: question.getType(), // Add question type
        answer: sender.data[questionName]
    };
});


      const response = await fetch(API_URLS.RESPONSE_SAVE, {
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
        throw new Error(MESSAGES.SAVE_RESPONSE_FAIL);
      }

      const savedResponseData = await response.json();
      // Show toast notification on successful save
      toast.success(MESSAGES.SAVE_RESPONSE_SUCCESS);

    } catch (error) {
      console.error('Error saving response data:', error);
      toast.error(MESSAGES.SAVE_RESPONSE_FAIL);
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
