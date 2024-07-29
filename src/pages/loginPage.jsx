import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Group,
  Modal,
} from '@mantine/core';
import GoogleButton from '../components/GoogleButton';
import { ToastMessages, DefaultTexts } from "./messages/loginTexts"; // Adjust the path as necessary
import { URLs } from './messages/apiUrls'; // Import the URLs

export default function AuthenticationImage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      window.location.href = '/';
    }
  }, []);

  function getTokenFromCookie() {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));

    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    } else {
      return null;
    }
  }

  const handleSubmit = async () => {
    try {
      if (!userName) {
        toast.error(ToastMessages.USERNAME_REQUIRED);
        return;
      }

      const response = await fetch(URLs.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userName, password }),
      });
      if (response.ok) {
        window.location.href = '/';
      } else {
        let errorText = '';
        switch (response.status) {
          case 401:
            errorText = ToastMessages.INCORRECT_USERNAME_PASSWORD;
            break;
          case 404:
            errorText = ToastMessages.USER_NOT_FOUND;
            break;
          default:
            errorText = ToastMessages.LOGIN_ERROR;
        }
        toast.error(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error(ToastMessages.LOGIN_ERROR);
    }
  };

  const handleForgotPassword = async () => {
    try {
      if (!forgotPasswordEmail) {
        toast.error(ToastMessages.EMAIL_REQUIRED);
        return;
      }

      const checkResponse = await fetch(URLs.CHECK_USER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (!checkResponse.ok) {
        toast.error(ToastMessages.USER_NOT_FOUND_OR_EMAIL_NOT_VERIFIED);
        return;
      }

      const response = await fetch(URLs.FORGOT_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (response.ok) {
        toast.success(ToastMessages.PASSWORD_RECOVERY_EMAIL_SENT);
        setModalOpened(false);
      } else {
        toast.error(ToastMessages.PASSWORD_RECOVERY_ERROR);
      }
    } catch (error) {
      console.error('Error during password recovery:', error);
      toast.error(ToastMessages.PASSWORD_RECOVERY_ERROR);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper className={'form'} radius={0} p={30} w={'50%'} h={'100%'}>
        <Title order={2} className={'title'} ta="center" mt="md" mb={50}>
          {DefaultTexts.FORM_TITLE}
        </Title>

        <Group grow mb={20} mt={20}>
          <GoogleButton radius="xl">Google</GoogleButton>
        </Group>

        <TextInput
          label="Username"
          placeholder="Enter your username"
          size="lg"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          size="lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Checkbox label="Keep me logged in" mt="lg" size="md" />
        <Button fullWidth mt="lg" size="lg" onClick={handleSubmit}>
          {DefaultTexts.LOGIN_BUTTON}
        </Button>

        {/* <Text ta="center" mt="md">
          <Link to="/register">{DefaultTexts.REGISTER_PROMPT}</Link>
        </Text> */}

        <Text ta="center" mt="md">
          <span onClick={() => setModalOpened(true)} style={{ color: 'blue', cursor: 'pointer' }}>
            {DefaultTexts.FORGOT_PASSWORD_PROMPT}
          </span>
        </Text>

        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title={DefaultTexts.PASSWORD_RECOVERY_TITLE}>
          <TextInput
            label="Email address"
            placeholder="@gmail.com"
            size="lg"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
          />
          <Button fullWidth mt="lg" size="lg" onClick={handleForgotPassword}>
            {DefaultTexts.PASSWORD_RECOVERY_BUTTON}
          </Button>
        </Modal>

        <ToastContainer />
      </Paper>
    </div>
  );
}
