import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import surveyData from "./templatesData"; // Assuming surveyData.js is in the same directory
import { Modal, Button, TextInput } from '@mantine/core';

// Function to get survey by title from local surveyData
function getSurveyByTitle(formName) {
  if (!formName) {
    throw new Error("Missing 'formName' parameter in URL");
  }

  const survey = surveyData.find(survey => survey.TemplateName === formName);
  return survey ? JSON.parse(survey.TemplateData) : null;
}

// Function to get token from cookies
function getTokenFromCookie() {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
}

export default function SurveyCreatorWidget() {
  const [load, setLoad] = useState(false);
  const [creator, setCreator] = useState(null); // State to store SurveyCreator instance
  const [formData, setFormData] = useState(null); // State to store form data
  const [error, setError] = useState(null); // State to store error message
  const location = useLocation(); // Get current location
  const navigate = useNavigate(); // Get navigate function from React Router

  useEffect(() => {
    const initializeSurveyCreator = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const name = params.get('formName');
        let survey = getSurveyByTitle(name);
        
        if (!survey) {
          // If not found locally, make a fetch request with a token
          const token = getTokenFromCookie();
          if (token) {
            const response = await fetch('http://localhost:5000/getTemplates', {
              method: "POST",
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const fetchedData = await response.json();
              
              // Handle the structure of fetched data properly
              if (fetchedData && fetchedData.templateData && Array.isArray(fetchedData.templateData)) {
                const matchingSurvey = fetchedData.templateData.find(item => item.TemplateName === name);
                
                if (matchingSurvey) {
                  survey = matchingSurvey.TemplateData;
                } else {
                  throw new Error('No matching survey found in fetched data');
                }
              } else {
                throw new Error('Fetched data is not structured as expected');
              }
            } else {
              throw new Error('Failed to fetch data from server');
            }
          } else {
            throw new Error('Token not found in cookies');
          }
        }
        
        if (survey) {
          const surveyCreator = new SurveyCreator({ showLogicTab: true, isAutoSave: true });
          surveyCreator.text = survey;
          setFormData(survey); 
          setCreator(surveyCreator);
          setLoad(true);
        } else {
          console.warn("No survey found with the name:", name);
          setError("No survey found with the provided name."); // Inform user
        }
      } catch (error) {
        console.error("Error:", error.message);
        setError("An error occurred while fetching the survey data."); // Handle generic errors
      }
    };

    initializeSurveyCreator();
  }, [location.search]);

  // Save template data function
  const saveTemplateData = async (isDraft) => {
    try {
      const token = getTokenFromCookie();
      const creatorJSON = JSON.parse(creator.text);
      const response = await fetch('http://localhost:5000/templateSave', {
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
        toast.success("Your template has been saved successfully!", {
          onClose: () => navigate('/') // Navigate to home.jsx after successful toast
        });
        let res = await response.json();
      } else {
        toast.error("Failed to save the template data. Please try again later.");
      }
    } catch (error) {
      console.error("Error saving template data:", error);
      toast.error("An error occurred while saving the template data.");
    }
  };

  // Function to handle navigation back to home page
  const handleBack = () => {
    navigate("/");
  };

  // Function to handle save button click
  const handleSaveButtonClick = () => {
    saveTemplateData(false);
  };
  const handleSaveDraftButtonClick=()=>
    {
      saveTemplateData(true);
    }

  // Improved conditional rendering with error handling
  return (
    <div>
      {error ? (
        <p>Error: {error}</p> // Display error message to the user
      ) : load && creator && formData ? (
        <div>
          <SurveyCreatorComponent creator={creator} />
          <Button onClick={handleSaveButtonClick}>Save Template</Button>
          <Button onClick={handleSaveDraftButtonClick}>Save as Draft</Button>
          <ToastContainer />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
