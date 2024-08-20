import React from 'react';
import { Card, Image, Text, ActionIcon, SimpleGrid, Tooltip, Badge } from '@mantine/core';
import { IconTrash, IconExternalLink, IconArchive, IconArchiveOff, IconSend, IconRestore, IconFile } from '@tabler/icons-react';
import file from '../../assets/file.png';
import { useNavigate } from 'react-router-dom';

export default function FormCard({ formName, formDescription, id, onDelete, onArchive, offArchive, handleSend, Template, handleRestore, Trash, buitInTemplate, TemplateForm, isDraft }) {
  const navigate = useNavigate();


  async function handleExternalLink() {
    if (TemplateForm) {
      navigate(`/viewForm?TemplateId=${id}`);
    } else if (Template) {
      navigate(`/buildTemplate?formName=${formName}`);
    } else {
      navigate(`/viewForm?id=${id}`);
    }
  }

  async function handleResponses() {
    navigate(`/Responses?formId=${id}`);
  }

  // Define tooltip text variables
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
        h={300}
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

        <Card.Section h={120} bg={'white'}>
          <Image
            src={file}
            w={70}
            h={70}
            alt="No way!"
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

        <SimpleGrid cols={3} styles={{
          root: {
            textAlign: 'center',
            alignItems: 'center',
            margin: 'auto',
            marginTop: '0.25rem'
          }
        }}>
          {Template ? (
            <>
              {(!buitInTemplate) && (
                <Tooltip label={deleteTooltip} position="top" withArrow>
                  <ActionIcon variant="filled" size={'lg'} color='orange' onClick={onDelete}>
                    <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              )}
              <Tooltip label={viewTooltip} position="top" withArrow>
                <ActionIcon variant="filled" size={'lg'} color='orange' onClick={handleExternalLink}>
                  <IconExternalLink style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
              {(!buitInTemplate) && (
                <Tooltip label={offArchive ? unarchiveTooltip : archiveTooltip} position="top" withArrow>
                  <ActionIcon variant="filled" size={'lg'} color='orange' onClick={offArchive ? offArchive : onArchive}>
                    {offArchive ? <IconArchiveOff style={{ width: '70%', height: '70%' }} stroke={1.5} /> : <IconArchive style={{ width: '70%', height: '70%' }} stroke={1.5} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </>
          ) : (
            <>
              {onDelete != null && (
                <Tooltip label={deleteTooltip} position="top" withArrow>
                  <ActionIcon variant="filled" size={'lg'} color='orange' onClick={onDelete}>
                    <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              )}
              <Tooltip label={viewTooltip} position="top" withArrow>
                <ActionIcon variant="filled" size={'lg'} color='orange' onClick={handleExternalLink}>
                  <IconExternalLink style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
              {(onArchive || offArchive) && (
                <Tooltip label={offArchive ? unarchiveTooltip : archiveTooltip} position="top" withArrow>
                  <ActionIcon variant="filled" size={'lg'} color='orange' onClick={offArchive ? offArchive : onArchive}>
                    {offArchive ? <IconArchiveOff style={{ width: '70%', height: '70%' }} stroke={1.5} /> : <IconArchive style={{ width: '70%', height: '70%' }} stroke={1.5} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </>
          )}
          {Trash && (
            <Tooltip label={restoreTooltip} position="top" withArrow>
              <ActionIcon variant="filled" size={'lg'} color='orange' onClick={() => handleRestore(id)}>
                <IconRestore style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          )}
          {(!isDraft && !Template && !Trash) && (
            <Tooltip label={sendTooltip} position="top" withArrow>
              <ActionIcon variant="filled" size={'lg'} color='orange' onClick={() => handleSend(id)}>
                <IconSend style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          )}
          {(!Template && !isDraft) && (
            <Tooltip label={responsesTooltip} position="top" withArrow>
              <ActionIcon variant="filled" size={'lg'} color='orange' onClick={handleResponses}>
                <IconFile style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          )}
        </SimpleGrid>
      </Card>
    </div>
  );
}
