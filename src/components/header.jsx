import React, { useEffect, useState } from 'react';
import { Container, Image, Flex, Menu, MenuItem, Avatar, Modal, PasswordInput, TextInput, Button } from '@mantine/core';
import './header.css';
import logo from '../assets/logo.png'; // Replace with your logo path
import profile from '../assets/profile.jpeg';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'react-toastify';

const unauthLinks = [
  { link: '/login', label: 'Login' },
  { link: '/signup', label: 'SignUp' },
];

export default function HeaderSimple() {
  const [profileEmail,setProfileEmail]=useState(''); 
  const [profileDepartment,setProfileDepartment]=useState(''); 
  const [profileVertical,setProfileVertical]=useState(''); 
  const [profileJobTitle,setProfileJobTitle]=useState('');  
  function getTokenFromCookie() {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    } else {
      return null;
    }
  }

  const [profileInfo, setProfileInfo] = useState([]);
  useEffect(() => {
    const token = getTokenFromCookie();

    if (token) {
      fetch('http://localhost:5000/ProfileInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.organizations[0]);
          setProfileDepartment(data.organizations[0].department);
          setProfileEmail(data.primaryEmail);
          setProfileVertical(data.organizations[0].costCenter);
          setProfileJobTitle(data.organizations[0].title);
          setProfileInfo(data);
        })
        .catch(error => {
          console.error('Error fetching profile info:', error);
        });
    }
  }, []);

  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [changePasswordOpened, { open: openChangePassword, close: closeChangePassword }] = useDisclosure(false);
  const [profileOpened, { open: openProfile, close: closeProfile }] = useDisclosure(false);

  useEffect(() => {
    const token = getTokenFromCookie();

    if (token) {
      fetch('http://localhost:5000/getUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
        
          if (data.user) {
            setUserName(data.user.userName || ''); // Set to empty string if userName is null
          }
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    }
  }, [userName]);

  // State and validation for create user/password form
  const [createUserForm, setCreateUserForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    errors: {
      username: '',
      password: '',
      confirmPassword: '',
    }
  });

  const handleCreateUserChange = (e) => {
    const { name, value } = e.target;
    setCreateUserForm({
      ...createUserForm,
      [name]: value,
      errors: {
        ...createUserForm.errors,
        [name]: name === 'username' && value.trim().length === 0 ? 'Username is required' : '',
        [name]: name === 'password' && value.length < 8 ? 'Password must be at least 8 characters long' : '',
        [name]: name === 'confirmPassword' && value !== createUserForm.password ? 'Passwords do not match' : '',
      }
    });
  };

  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = createUserForm;

    // Validate form fields
    if (username.trim().length === 0 || password.length < 8 || confirmPassword !== password) {
      setCreateUserForm({
        ...createUserForm,
        errors: {
          username: username.trim().length === 0 ? 'Username is required' : '',
          password: password.length < 8 ? 'Password must be at least 8 characters long' : '',
          confirmPassword: confirmPassword !== password ? 'Passwords do not match' : '',
        }
      });
      return;
    }

    // Proceed with form submission logic (API calls, etc.)
    const token = getTokenFromCookie();
    if (token) {
      fetch('http://localhost:5000/addUserNameAndPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Username and password added successfully') {
            close(); // Close modal after successful submission
            // Optionally, update state or show success message
            toast.success('Username and password added successfully');
          } else {
            toast.error('Failed to add username and password');
            console.error(data.error);
          }
        })
        .catch(error => {
          toast.error('Error adding username and password');
          console.error('Error adding username and password:', error);
        });
    }
  };

  // State and validation for change password form
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    errors: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }
  });

  const handleChangePasswordChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordForm({
      ...changePasswordForm,
      [name]: value,
      errors: {
        ...changePasswordForm.errors,
        [name]: name === 'currentPassword' && value.length < 8 ? 'Password must be at least 8 characters long' : '',
        [name]: name === 'newPassword' && value.length < 8 ? 'Password must be at least 8 characters long' : '',
        [name]: name === 'confirmNewPassword' && value !== changePasswordForm.newPassword ? 'Passwords do not match' : '',
      }
    });
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = changePasswordForm;

    // Validate form fields
    if (currentPassword.length < 8 || newPassword.length < 8 || confirmNewPassword !== newPassword) {
      setChangePasswordForm({
        ...changePasswordForm,
        errors: {
          currentPassword: currentPassword.length < 8 ? 'Password must be at least 8 characters long' : '',
          newPassword: newPassword.length < 8 ? 'Password must be at least 8 characters long' : '',
          confirmNewPassword: confirmNewPassword !== newPassword ? 'Passwords do not match' : '',
        }
      });
      return;
    }

    // Proceed with form submission logic (API calls, etc.)
    const token = getTokenFromCookie();
    if (token) {
      fetch('http://localhost:5000/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Password changed successfully') {
            closeChangePassword(); // Close modal after successful submission
            // Optionally, update state or show success message
            toast.success('Password changed successfully');
          } else {
            toast.error('Failed to change password');
            console.error(data.error);
          }
        })
        .catch(error => {
          console.error('Error changing password:', error);
        });
    }
  };

  const handleMenuClick = () => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    navigate('/login');
  };

  const links = [
    { link: openProfile, label: 'Profile' }, // New profile link
    { link: userName ? openChangePassword : open, label: userName ? 'Change Password' : 'Create Username and Password' },
    { link: handleMenuClick, label: 'Logout' },
  ];

  return (
    <div style={{ margin: '0', padding: '0' }}>
      <Container m={0} p={0} h={70} bg={'white'} size={'xl'} fluid styles={{
        root: {
          borderBottom: '1px solid black'
        }
      }}>
        <Flex direction="row" align="center" justify="space-between" h="100%">
          <Flex align="center">
            <Image src={logo} height={50} width={50} />
          </Flex>
          <Flex align="center">
            <Menu
              control={<Avatar size="sm" src="https://via.placeholder.com/150" />} // Placeholder image
              transition="pop"
              transitionDuration={150}
              transitionTimingFunction="ease"
            >
              <Menu.Target>
                <Image src={profile} height={50} width={50} />
              </Menu.Target>
              <Menu.Dropdown position="top" gutter={10}>
                {links.map((item, index) => (
                  <MenuItem key={index} onClick={item.link}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Flex>
      </Container>

      <Modal opened={opened} onClose={close} title="Create Username and Password" centered>
        <form onSubmit={handleCreateUserSubmit}>
          <TextInput
            mt="sm"
            label="Username"
            placeholder="Username"
            name="username"
            value={createUserForm.username}
            onChange={handleCreateUserChange}
            error={createUserForm.errors.username}
          />
          <PasswordInput
            label="Password"
            placeholder="Password"
            name="password"
            value={createUserForm.password}
            onChange={handleCreateUserChange}
            error={createUserForm.errors.password}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={createUserForm.confirmPassword}
            onChange={handleCreateUserChange}
            error={createUserForm.errors.confirmPassword}
          />

          <Button type="submit" mt="sm">
            Submit
          </Button>
        </form>
      </Modal>

      <Modal opened={changePasswordOpened} onClose={closeChangePassword} title="Change Password" centered>
        <form onSubmit={handleChangePasswordSubmit}>
          <PasswordInput
            mt="sm"
            label="Current Password"
            placeholder="Current Password"
            name="currentPassword"
            value={changePasswordForm.currentPassword}
            onChange={handleChangePasswordChange}
            error={changePasswordForm.errors.currentPassword}
          />
          <PasswordInput
            label="New Password"
            placeholder="New Password"
            name="newPassword"
            value={changePasswordForm.newPassword}
            onChange={handleChangePasswordChange}
            error={changePasswordForm.errors.newPassword}
          />
          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm New Password"
            name="confirmNewPassword"
            value={changePasswordForm.confirmNewPassword}
            onChange={handleChangePasswordChange}
            error={changePasswordForm.errors.confirmNewPassword}
          />
          <Button type="submit" mt="sm">
            Submit
          </Button>
        </form>
      </Modal>

      <Modal opened={profileOpened} onClose={closeProfile} title="Profile Information" centered>
        <div>
          <p>Email: {profileEmail || ''}</p>
          <p>Employee ID: {profileInfo.id || ''}</p>
          <p>Vertical: {profileVertical|| ''}</p>
          <p>Department: {profileDepartment || ''}</p>
          <p>Job Title: {profileJobTitle || ''}</p>
        </div>
      </Modal>
    </div>
  );
}
