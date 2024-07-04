import React, { useEffect, useState } from 'react';
import { Container, Flex, ActionIcon, Divider, Text, Button, Group } from '@mantine/core';
import ResponseCard from '../components/ResponsePage/ResponseCard';
import Header from '../components/header';
import { IconFileSpreadsheet } from '@tabler/icons-react';
import { useLocation } from "react-router-dom";
import { saveAs } from 'file-saver';
import { ToastMessages, DefaultTexts } from "./messages/ResponseTexts";
import BarChart from "../components/bar"; // Adjust the import path as needed

const ResponsePage = () => {
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        const response = await fetch('http://localhost:5000/getResponse', {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 'FormId': id })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data);
          
          const groupedResponses = [];
          const values = Object.values(data.data);
          values.forEach(subArray => {
            subArray.forEach(item => {
              const existingResponse = groupedResponses.find(response => response.title === item.title);
              if (existingResponse) {
                existingResponse.answers.push(item.answer);
              } else {
                groupedResponses.push({ name: item.name, title: item.title, answers: [item.answer] });
              }
            });
          });
          console.log(groupedResponses);
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

  const downloadCSV = () => {
    const csvData = [];
    const headers = ['Question Title', 'Answer'];
    csvData.push(headers.join(','));

    responses.forEach(response => {
      response.answers.forEach(answer => {
        csvData.push(`${response.title},${answer}`);
      });
    });

    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, DefaultTexts.CSV_FILENAME);
  };

  const getChartData = (response) => {
    const answerCounts = {};
    response.answers.forEach(answer => {
      answerCounts[answer] = (answerCounts[answer] || 0) + 1;
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

  return (
    <div>
      <Header />
      <Container fluid p={20} bg={'#e6e6e6'}>
        <Flex direction='row' justify={'center'} align={'center'} wrap={'nowrap'}>
          <Container>
            <h4>{isLoading ? DefaultTexts.LOADING_RESPONSES : DefaultTexts.RESPONSES}</h4>
          </Container>
          <Container>
            <ActionIcon variant="filled" ml={'md'} size={'lg'} color='green' onClick={downloadCSV}>
              <IconFileSpreadsheet style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            <Group>
              <Button color='orange' variant={type === "Questions" ? 'filled' : 'outline'} onClick={() => { setType("Questions") }}>Questions</Button>
              <Button color='orange' variant={type === "Summary" ? 'filled' : 'outline'} onClick={() => { setType("Summary") }}>Summary</Button>
              <Button color='orange' variant={type === "Settings" ? 'filled' : 'outline'} onClick={() => { setType("Settings") }}>Settings</Button>
            </Group>
          </Container>
        </Flex>
      </Container>
      <Divider color='grey' />

      {isLoading ? (
        <Text>{DefaultTexts.LOADING}</Text>
      ) : (
        <>
          {type === "Questions" && (
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
          {type === "Summary" && (
            responses.map((response, index) => (
              <div key={index}>
                <BarChart data={getChartData(response)} />
              </div>
            ))
          )}
          {type === "Settings" && (
            <Text>Settings Content</Text>
          )}
        </>
      )}
    </div>
  );
};

export default ResponsePage;
