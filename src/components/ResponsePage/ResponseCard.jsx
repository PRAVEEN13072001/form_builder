import React from 'react';
import { Container, Paper, Text, Divider } from '@mantine/core';

export default function ResponseCard({ title, responseJson }) {
  console.log("ResponseCard rendered");
  console.log(responseJson);

  return (
    <div>
      <Container mb={20} mt={20}>
        <Paper p={5} m={5} radius="sm" shadow="lg" style={{ border: '1.5px solid #bababa' }}>
          <Container fluid p={5} m={5}>
            <h2>{title}</h2>
          </Container>
          <Divider my="xs" size="sm" />
          <Container>
            {responseJson && responseJson.length > 0 && (
              responseJson.map((answerArray, index) => (
                <Paper 
                  key={index}
                  p={15} 
                  m={5} 
                  shadow="xs" 
                  radius="sm" 
                  style={{ border: '1px solid #f0f0f0', marginBottom: '10px' }}
                >
                  {answerArray.map((answer, idx) => (
                    <Text key={idx}>{answer}</Text>
                  ))}
                </Paper>
              ))
            )}
          </Container>
        </Paper>
      </Container>
    </div>
  );
}
