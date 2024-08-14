/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { IconFile, IconArchive, IconTrash, IconArrowRight, IconArrowLeft,IconTemplate } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Container, Divider,Tooltip,ActionIcon } from '@mantine/core';

const data = [
  { link: '', label: 'My Forms', icon: IconFile },
  {link:'',label:'Templates',icon:IconTemplate},
  { link: '', label: 'Trash', icon: IconTrash },
  { link: '', label: 'Archive', icon: IconArchive }
];

export default function Navbar({setnavItem,setTemplateOpen}) {
  const [active, setActive] = useState('My Forms');
  const [isCollapse, setIsCollapse] = useState(false);

  const navigate = useNavigate();

  const handleLinkClick = (item) => {
    setActive(item.label);
    setnavItem(item.label);
    if (item.link) {
   
      navigate(item.link);
    }
  };

  return (
    <div>
      <aside style={{ width: isCollapse ? '5vw' : '20vw', height: '90.1vh', backgroundColor: '#f7f6f5',borderRight:'1px solid black' }}>
      <nav style={{ padding: '0px' }}>
        <Container size={'xl'} h={'40'} mr={'0'} ml={'0'} fluid styles={{
          root: {
            textAlign: isCollapse ? 'center' :'end',
          }
        }}>
          <a
              
              style={{
                display: 'flex',
                justifyContent:isCollapse?'center' :'space-between',
              cursor: 'pointer',
              fontWeight:'900',// Ensure cursor changes to pointer on hover
              fontSize:'1.5rem'
              }}
              
              
            >
            {isCollapse ? <div></div> : <span>Welcome </span>}
             <Tooltip label="Collapse Navbar" position="top" withArrow>
            <ActionIcon mt={'2'} variant="outline" size={'lg'} color='black' onClick={()=>{ setIsCollapse(!isCollapse)}}>
              {isCollapse ? <IconArrowRight style={{ width: '70%', height: '70%' }} stroke={1.5} />:<IconArrowLeft style={{ width: '70%', height: '70%' }} stroke={1.5} />}
            </ActionIcon>
          </Tooltip>
            </a>
         
        </Container>
        <Divider m={'0'} color='black'  />

        <div style={{ display: 'flex', flexDirection: 'column',marginTop:'0.25rem' }}>
          {data.map((item) => (
            <Container styles={{
              root: {
                margin:isCollapse ? 'auto' :'0',
                textAlign: isCollapse ? 'center' :'start',
                alignItems: isCollapse ? 'center' :'start',
              }
            }}
              m={0}
              p={0}
            fluid
            >
            <a
              key={item.label}
              style={{
                display: 'flex',
                padding: '10px',
                justifyContent:isCollapse?'center' :'',
                color: item.label === active?'white':'black',
                textDecoration: 'none',
                backgroundColor:item.label === active ? '#ff9354':'transparent',
                fontWeight: item.label === active ? 'bold' : 'normal',
                cursor: 'pointer', // Ensure cursor changes to pointer on hover
              }}
              onClick={() => handleLinkClick(item)}
              
            >
              <item.icon style={{ marginRight: '10px' }} stroke={1.5} />
              {isCollapse ? <div></div>:<span>{item.label}</span>}
            </a>
              </Container>
          ))}
        </div>
      </nav>
    </aside>
    </div>
    
  );
}
