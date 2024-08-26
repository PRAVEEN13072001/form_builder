import React, { useEffect, useState } from 'react';
import {
  Container,
  Flex,
  ActionIcon,
  Divider,
  Text,
  Button,
  Group,
  Menu,
  Modal,
  Table,
} from '@mantine/core';
import ResponseCard from '../components/ResponsePage/ResponseCard';
import Header from '../components/header';
import { IconFileSpreadsheet, IconDownload, IconEye,IconArrowLeft } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { ToastMessages, DefaultTexts, typeTexts } from './messages/ResponseTexts';
import BarChart from '../components/bar'; // Adjust the import path as needed
import IndividualResponseCard from '../components/ResponsePage/IndividualResponseCard';
import { URLs } from './messages/apiUrls';
import { useNavigate } from 'react-router-dom';

const ResponsePage =() => {  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [individualResponses, setIndividualResponses] = useState([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [type, setType] = useState('Questions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  
const [id,SetID]=useState('');
   function getTokenFromCookie() {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('token='));
        if (tokenCookie) {
          return tokenCookie.split('=')[1];
        } else {
          return null;
        }
      }
  const fetchDecryptedId = async (encryptedId) => {
    try {
      const token = getTokenFromCookie();
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/decryptId`, {
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
        throw new Error("Failed to decrypt ID");
      }

      const decryptedData = await response.json();
     
      return decryptedData.decryptedId;
    } catch (error) {
      console.error('Error decrypting ID:', error);
      throw error;
    }
  };
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const ID = params.get('formId');
  const fetchId=async ()=>
    {
  const id=await fetchDecryptedId(ID);
  SetID(id);
    }
    async function fetchResponses() {
   
      const token = getTokenFromCookie();
      try {
       
        const response = await fetch(URLs.RESPONSES, {
          method: 'post',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formId: id }),
        });

        if (response.ok) {
          const data = await response.json();
          const val = data.data;
         
          const groupedResponses = [];
          const values = Object.values(val);
          values.forEach((subArray) => {
            subArray.forEach((item) => {
              const existingResponse = groupedResponses.find((response) => response.title === item.title);
              if (existingResponse) {
                existingResponse.answers.push(item.answer);
              } else {
                groupedResponses.push({ name: item.name, title: item.title, answers: [item.answer], type: item.type });
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
  useEffect(() => {
       fetchId();
       if(id)
       {
fetchResponses();
       }
    
    
  }, [id]);

  useEffect(() => {
    async function fetchIndividualResponses() {
      function getTokenFromCookie() {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('token='));
        if (tokenCookie) {
          return tokenCookie.split('=')[1];
        } else {
          return null;
        }
      }
      const token = getTokenFromCookie();
      try {
        const response = await fetch(URLs.INDIVIDUAL_RESPONSE, {
          method: 'post',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formId: id }),
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
    if (type === 'Individual') {
      fetchIndividualResponses();
    }
  }, [id, type]);

  const downloadCSV = () => {
    const csvData = [];
    const headers = responses.map((response) => response.title);
    csvData.push(headers.join(','));

    const maxAnswers = Math.max(...responses.map((response) => response.answers.length));

    for (let i = 0; i < maxAnswers; i++) {
      const row = responses.map((response) => response.answers[i] || '');
      csvData.push(row.join(','));
    }

    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, DefaultTexts.CSV_FILENAME);
  };

  const viewInWeb = () => {
    const csvData = [];
    const headers = responses.map((response) => response.title);
    csvData.push(headers.join(','));

    const maxAnswers = Math.max(...responses.map((response) => response.answers.length));

    for (let i = 0; i < maxAnswers; i++) {
      const row = responses.map((response) => response.answers[i] || '');
      csvData.push(row.join(','));
    }

    const csvContent = csvData.join('\n');
    navigate(`/csv-table?formId=${id}`, { state: { csvContent } });
  };

  const getChartData = (response) => {
    const answerCounts = {};
    response.answers.forEach((answer) => {
      if (answer.split(' ').length <= 2) {
        answerCounts[answer] = (answerCounts[answer] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(answerCounts),
      datasets: [
        {
          label: `Count for "${response.title}"`,
          data: Object.values(answerCounts),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
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

  const renderCSVTable = () => {
    if (!csvContent) return null;

    const rows = csvContent.split('\n').map((row) => row.split(','));

    return (
      <Table>
        <thead>
          <tr>
            {rows[0].map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

 return (
    <div>
      <Header />
      <Container fluid p={20} bg={'#e6e6e6'}>
        <Flex direction="row" justify={'space-between'} align={'center'} wrap={'nowrap'}>
          <Button
            variant="subtle"
            leftIcon={<IconArrowLeft />}
            onClick={() => navigate("/")}
            color="dark"
          >
            Back
          </Button>
          <Container>
            <h4>{isLoading ? DefaultTexts.LOADING_RESPONSES : DefaultTexts.RESPONSES}</h4>
          </Container>
          <Container>
            <Group>
              <Button color="orange" variant={type === 'Questions' ? 'filled' : 'outline'} onClick={() => setType('Questions')}>
                Questions
              </Button>
              <Button color="orange" variant={type === 'Summary' ? 'filled' : 'outline'} onClick={() => setType('Summary')}>
                Summary
              </Button>
              <Button color="orange" variant={type === 'Individual' ? 'filled' : 'outline'} onClick={() => setType('Individual')}>
                Individual
              </Button>
              <Menu>
                <Menu.Target>
                  <ActionIcon variant="filled" ml={'md'} size={'lg'} color="green">
                    <IconFileSpreadsheet style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<IconDownload size={14} />} onClick={downloadCSV}>
                    Download CSV
                  </Menu.Item>
                  <Menu.Item icon={<IconDownload size={14} />} onClick={viewInWeb}>
                   view
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Container>
        </Flex>
      </Container>
      <Divider color="grey" />
      {isLoading ? (
        <Text>{DefaultTexts.LOADING}</Text>
      ) : (
        <div>
          {type === typeTexts.questions && (
            responses.length === 0 ? (
              <Text>{DefaultTexts.NO_RESPONSES}</Text>
            ) : (
              responses.map((response, index) => (
                <div key={index}>
                  <ResponseCard key ={index} title={response.title} responseJson={[response.answers]} />
                </div>
              ))
            )
          )}
          {type === typeTexts.summary && (
            responses.map((response, index) => (
              <div key={index}>
                <BarChart  key ={index} data={getChartData(response)} flag={response.type === 'dropdown'} />
              </div>
            ))
          )}
          {type === typeTexts.individualType && (
            individualResponses.length === 0 ? (
              <Text>{DefaultTexts.NO_RESPONSES}</Text>
            ) : (
              <div>
                {individualResponses[currentResponseIndex].map((response, index) => (
                  <IndividualResponseCard 
                    key={index} 
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
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ResponsePage;
