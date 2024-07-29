import React, { useEffect, useState } from 'react';
import { Container, Flex, ActionIcon, Divider, Text, Button, Group } from '@mantine/core';
import ResponseCard from '../components/ResponsePage/ResponseCard';
import Header from '../components/header';
import { IconFileSpreadsheet } from '@tabler/icons-react';
import { useLocation } from "react-router-dom";
import { saveAs } from 'file-saver';
import { ToastMessages, DefaultTexts, typeTexts } from "./messages/ResponseTexts";
import BarChart from "../components/bar"; // Adjust the import path as needed
import IndividualResponseCard from "../components/ResponsePage/IndividualResponseCard";
import { URLs } from './messages/apiUrls';

const ResponsePage = () => {
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [individualResponses, setIndividualResponses] = useState([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [type, setType] = useState("Questions");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("formId");

  useEffect(() => {
    async function fetchResponses() {
      function getTokenFromCookie() {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
        if (tokenCookie) {
          return tokenCookie.split('=')[1];
        } else {
          return null;
        }
      }
      const token = getTokenFromCookie();
      try {
        const response = await fetch(URLs.RESPONSES, {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 'formId': id })
        });

        if (response.ok) {
          const data = await response.json();
          const val = data.data;
              
          const groupedResponses = [];
          const values = Object.values(val);
          values.forEach(subArray => {
            subArray.forEach(item => {
              const existingResponse = groupedResponses.find(response => response.title === item.title);
              if (existingResponse) {
                existingResponse.answers.push(item.answer);
              } else {
                groupedResponses.push({ name: item.name, title: item.title, answers: [item.answer], type :item.type });
              }
            });
          });
       
          setResponses(groupedResponses);
          setIsLoading(false);
        } else {
          console.error(ToastMessages.FETCH_RESPONSE_FAILURE);
        }
      } catch (error) {
        console.error(ToastMessages.FETCH_RESPONSE_ERROR, error);
      }
    }
    fetchResponses();
  }, [id]);

  useEffect(() => {
    async function fetchIndividualResponses() {
      function getTokenFromCookie() {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
        if (tokenCookie) {
          return tokenCookie.split('=')[1];
        } else {
          return null;
        }
      }
      const token = getTokenFromCookie();
      try {
        const response = await fetch(URLs.INDIVIDUAL_RESPONSE, {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 'formId': id })
        });

        if (response.ok) {
          const data = await response.json();
          setIndividualResponses(data.data[0].formData);
        } else {
          console.error(ToastMessages.FETCH_INDIVIDUAL_RESPONSES_FAILURE);
        }
      } catch (error) {
        console.error(ToastMessages.FETCH_INDIVIDUAL_RESPONSES_ERROR, error);
      }
    }
    if (type === "Individual") {
      fetchIndividualResponses();
    }
  }, [id, type]);

  const downloadCSV = () => {
    const csvData = [];
    const headers = responses.map(response => response.title);
    csvData.push(headers.join(','));

    const maxAnswers = Math.max(...responses.map(response => response.answers.length));

    for (let i = 0; i < maxAnswers; i++) {
      const row = responses.map(response => response.answers[i] || '');
      csvData.push(row.join(','));
    }

    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, DefaultTexts.CSV_FILENAME);
  };

  const getChartData = (response) => {
    
    const answerCounts = {};
    response.answers.forEach(answer => {
      if (answer.split(' ').length <= 2) {
        answerCounts[answer] = (answerCounts[answer] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(answerCounts),
      datasets: [{
        label: `Count for "${response.title}"`,
        data: Object.values(answerCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    };
  };

  const handleNextResponse = () => {
    if (currentResponseIndex < individualResponses.length - 1) {
      setCurrentResponseIndex(currentResponseIndex + 1);
    }
  };

  const handlePreviousResponse = () => {
   
    if (currentResponseIndex > 0) {
      setCurrentResponseIndex(currentResponseIndex - 1);
    }
  };

  return (
    <div>
      <Header />
      <Container fluid p={20} bg={'#e6e6e6'}>
        <Flex direction='row' justify={'center'} align={'center'} wrap={'nowrap'}>
          <Container>
            <h4>{isLoading ? DefaultTexts.LOADING_RESPONSES : DefaultTexts.RESPONSES}</h4>
          </Container>
          <Container>
            <Group>
              <Button color='orange' variant={type === "Questions" ? 'filled' : 'outline'} onClick={() => { setType("Questions") }}>Questions</Button>
              <Button color='orange' variant={type === "Summary" ? 'filled' : 'outline'} onClick={() => { setType("Summary") }}>Summary</Button>
              <Button color='orange' variant={type === "Individual" ? 'filled' : 'outline'} onClick={() => { setType("Individual") }}>Individual</Button>
              <ActionIcon variant="filled" ml={'md'} size={'lg'} color='green' onClick={downloadCSV}>
              <IconFileSpreadsheet style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            </Group>
          </Container>
        </Flex>
      </Container>
      <Divider color='grey' />

      {isLoading ? (
        <Text>{DefaultTexts.LOADING}</Text>
      ) : (
        <>
          {type === typeTexts.questions && (
            responses.length === 0 ? (
              <Text>{DefaultTexts.NO_RESPONSES}</Text>
            ) : (
              responses.map((response, index) => (
                <div key={index}>
                  <ResponseCard title={response.title} responseJson={[response.answers]} />
                </div>
              ))
            )
          )}
          {type === typeTexts.summary && (
            responses.map((response, index) => (
              <div key={index}>
                <BarChart data={getChartData(response)} flag ={response.type ==='dropdown'}/>
              </div>
            ))
          )}
          {type === typeTexts.individualType && (
            individualResponses.length === 0 ? (
              <Text>{DefaultTexts.NO_RESPONSES}</Text>
            ) : (
              <>
                {individualResponses[currentResponseIndex].map((response, index) => (
                  <IndividualResponseCard 
                    key={response.title} 
                    title={response.title} 
                    answer={response.answer} 
                  />
                ))}
                <Group position="center" mt="md">
                  <Button 
                    onClick={handlePreviousResponse} 
                    disabled={currentResponseIndex === 0}
                  >
                    &lt; Previous
                  </Button>
                  <Button 
                    onClick={handleNextResponse} 
                    disabled={currentResponseIndex === individualResponses.length - 1}
                  >
                    Next &gt;
                  </Button>
                </Group>
              </>
            )
          )}
        </>
      )}
    </div>
  );
};

export default ResponsePage;
