import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
} from '@mantine/core';

// Import messages
import * as messages from './messages/forgotPasswordTexts';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    // Email format validation
    if (!email || !email.includes('@gmail.com')) {
      toast.error(messages.invalidEmailFormatMessage);
      return;
    }

    // Passwords match validation
    if (newPassword !== confirmPassword) {
      toast.error(messages.passwordsDoNotMatchMessage);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });
      if (response.ok) {
        toast.success(messages.passwordResetSuccessMessage);
        // Optionally redirect to login page after successful password reset
        window.location.href = '/login';
      } else {
        toast.error(messages.passwordResetErrorMessage);
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      toast.error(messages.passwordResetErrorGenericMessage);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper className={'form'} radius={0} p={30} w={'50%'} h={'100%'}>
        <Title order={2} className={'title'} ta="center" mt="md" mb={50}>
          Reset Your Password
        </Title>

        <TextInput
          label="Email address"
          placeholder="@gmail.com"
          size="lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label="New Password"
          placeholder="Your new password"
          size="lg"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your new password"
          size="lg"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button fullWidth mt="lg" size="lg" onClick={handleSubmit}>
          Reset Password
        </Button>

        <ToastContainer />
      </Paper>
    </div>
  );
}
