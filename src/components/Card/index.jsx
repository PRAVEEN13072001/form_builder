import React, { useEffect, useState } from 'react';
import { Card, Image, Text, ActionIcon, Menu, Tooltip, Badge } from '@mantine/core';
import { IconDots, IconTrash, IconExternalLink, IconArchive, IconArchiveOff, IconSend, IconRestore, IconFile } from '@tabler/icons-react';
import file from '../../assets/file.png';
import { useNavigate } from 'react-router-dom';

export default function FormCard({ formName, formDescription, id, onDelete, onArchive, offArchive, handleSend, Template, handleRestore, Trash, buitInTemplate, TemplateForm, isDraft, apiEndpoints, messages }) {
  const navigate = useNavigate();
  const [encryptedId, setEncryptedId] = useState(null);

  // Function to get the token from cookies
  function getTokenFromCookie() {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }

  // Encrypt the ID when the component mounts
  useEffect(() => {
    async function encryptId() {
      try {
        const token = getTokenFromCookie();  // Use the function to get the token
    
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/encryptId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ id }),
        });
    
        if (!response.ok) {
          throw new Error("error encrypting id");
        }
        const data = await response.json();
        setEncryptedId(data.encryptedId);
      } catch (error) {
        console.error("Error encrypting ID:", error);
      }
    }

    encryptId();
  }, [id,formName]);

  // Function to handle navigation using the encrypted ID
  function handleExternalLink() {
    if (!encryptedId) return;
    if (TemplateForm) {
      navigate(`/viewForm?TemplateId=${encryptedId}`);
    } else if (Template) {
      navigate(`/buildTemplate?formName=${formName}`);
    } else {
      navigate(`/viewForm?id=${encryptedId}`);
    }
  }

  function handleResponses() {
    if (!encryptedId) return;
    navigate(`/Responses?formId=${encryptedId}`);
  }

  // Tooltip text variables
  const deleteTooltip = Template ? "Delete Template" : "Delete Form";
  const viewTooltip = Template ? "View Template" : "View Form";
  const archiveTooltip = Template ? "Archive Template" : "Archive Form";
  const unarchiveTooltip = Template ? "Unarchive Template" : "Unarchive Form";
  const restoreTooltip = "Restore Form";
  const sendTooltip = "Send Form";
  const responsesTooltip = "Responses";

  return (
    <div>
      <Card
        shadow="sm"
        padding="xl"
        m="xs"
        w={300}
        h={250}
        component="a"
        bg={'#fce8cc'}
        position="relative"
      >
        {Template && (
          <Tooltip label="Template" position="top" withArrow>
            <Badge
              color="blue"
              size="lg"
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                fontSize: '1rem',
                lineHeight: '1rem'
              }}
            >
              T
            </Badge>
          </Tooltip>
        )}

        <Card.Section h={180} bg={'white'}>
          <Image
            src={file}
            w={70}
            h={70}
            alt="Form Icon"
            styles={{
              root: {
                position: 'absolute',
                top: 25,
                left: 120
              }
            }}
          />
        </Card.Section>

        <Text fw={500} size="lg" mt="md">
          {formName}
        </Text>

        <Text mt="xs" c="dimmed" size="sm">
          {formDescription}
        </Text>

        <Menu shadow="md" width={200} position="absolute">
          <Menu.Target>
            <ActionIcon 
              variant="light" 
              style={{ position: 'absolute', top: 10, right: 10 }}
            >
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {!buitInTemplate && (
              <Menu.Item icon={<IconTrash size={14} colour="orange" />} onClick={onDelete} rightSection={<IconTrash  color='red'/>}>
                {deleteTooltip}
              </Menu.Item>
            )}
            <Menu.Item icon={<IconExternalLink size={14} />} onClick={handleExternalLink} rightSection={<IconExternalLink  color='#2596be'/>}>
              {viewTooltip}
            </Menu.Item>
            {!buitInTemplate && (
              <Menu.Item icon={offArchive ? <IconArchiveOff size={14} /> : <IconArchive size={14} />} onClick={offArchive ? offArchive : onArchive} rightSection={offArchive ? <IconArchiveOff color='#2596be' /> : <IconArchive color='#2596be' />}>
                {offArchive ? unarchiveTooltip : archiveTooltip}
              </Menu.Item>
            )}
            {Trash && (
              <Menu.Item icon={<IconRestore size={14} />} onClick={() => handleRestore(id)} rightSection={<IconRestore  color='#2596be'/>}>
                {restoreTooltip}
              </Menu.Item>
            )}
            {!isDraft && !Template && !Trash && (
              <Menu.Item icon={<IconSend size={14} />} onClick={() => handleSend(id)} rightSection={<IconSend color='#2596be'/>}>
                {sendTooltip}
              </Menu.Item>
            )}
            {!Template && !isDraft && (
              <Menu.Item icon={<IconFile size={14} />} onClick={handleResponses} rightSection={<IconFile color='#2596be'/>}>
                {responsesTooltip}
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Card>
    </div>
  );
}
