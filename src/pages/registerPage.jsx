import React, { useState, useEffect } from 'react';
import { Paper, TextInput, PasswordInput, Checkbox, Button, Title, Text, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import { ToastMessages, DefaultTexts } from "./messages/registerTexts";
import {URLs} from "./messages/apiUrls";

export default function AuthenticationImage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/';
    }
  }, []);

  const handleRegister = async () => {
    try {
      const response = await fetch(URLs.RESGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log(ToastMessages.REGISTRATION_SUCCESS);
        window.location.href = '/login';
      } else {
        console.error(ToastMessages.REGISTRATION_FAILURE);
      }
    } catch (error) {
      console.error(ToastMessages.REGISTRATION_ERROR, error);
    }
  };

  return (
    <div className={'wrapper'}>
      <Paper className={'form'} radius={0} p={30} w={'50%'} h={'50%'}>
        <Title order={2} className={'title'} ta="center" mt="md" mb={50}>
          {DefaultTexts.FORM_TITLE}
        </Title>
        
        <Group grow mb="md" mt="md">
        </Group>

        <TextInput label="Email address" placeholder="hello@gmail.com" size="md" value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md" onClick={handleRegister}>
          {DefaultTexts.REGISTER_BUTTON}
        </Button>

        <Text ta="center" mt="md">
          {DefaultTexts.LOGIN_PROMPT} <Link to="/">Login</Link> {/* Link to the login page */}
        </Text>
      </Paper>
    </div>
  );
}
