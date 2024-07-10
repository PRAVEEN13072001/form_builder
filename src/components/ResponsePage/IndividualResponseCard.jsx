import React from 'react';
import { Container, Paper, Text, Divider } from '@mantine/core';

export default function ResponseCard({ title, answer }) {

  return (
    <div>
      <Container mb={20} mt={20}>
        <Paper p={5} m={5} radius="sm" shadow="lg" style={{ border: '1.5px solid #bababa' }}>
          <Container fluid p={5} m={5}>
            <h2>{title}</h2>
          </Container>
          <Divider my="xs" size="sm" />
          <Container>
            {answer}
          </Container>
        </Paper>
      </Container>
    </div>
  );
}
