
import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavbarHome';
import Header from '../components/header';
import FormCard from '../components/Card'; // Assuming FormCard is defined elsewhere
import { Flex, ScrollArea,Group,Container,Text,Badge,Modal,Input,ActionIcon,Tooltip,Button } from '@mantine/core';
import './home.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDisclosure } from '@mantine/hooks';
import { IconCopy, IconPlus } from '@tabler/icons-react';
import surveyData from '../components/SurveyForm/templatesData';
import { useNavigate } from 'react-router-dom';
import { FooterCentered } from '../components/Footer';
import { ToastMessages,TextMessages } from './messages/homeTexts';
import { URLs } from './messages/apiUrls';


export default function Home() {
  const Navigate = useNavigate();
  const [templateOpen, setTemplateOpen] = useState(false);

  const [type, setType] = useState("All");

  const [parsedForms, setParsedForms] = useState([

 ]);
 const [parsedTemplates,setParsedTemplates]=useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [Link,SetLink] =useState(""); // Use parsedForms consistently
  const [opened, { open, close }] = useDisclosure(false);
  const [navItem, setnavItem] = useState('My Forms');
   const [showIcon, setShowIcon] = useState(false);
  const [templatesFetched, setTemplatesFetched] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
const [recipientEmail, setRecipientEmail] = useState('');

  function getTokenFromCookie() {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    } else {
      return null;
    }
  }
  
  
  useEffect(() => {
  const token = getTokenFromCookie();
  if (!token) {
    window.location.href = '/login';
  } else {
    fetchData();
    toggleIconVisibility();
    fetchTemplate();
  }
}, []);

const fetchData = () => {
  const token = getTokenFromCookie();
  if (token) {
    fetch(URLs.GET_FORM, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.formData) {
          const parsedForms = data.formData.map(form => ({
            ...form,
            formData: form.formData,
          }));
          setParsedForms(parsedForms); // Update state with parsed data
        } else {
          console.error('Invalid data format:', data);
        }
      })
      .catch(error => console.error('Error fetching forms:', error));
  }
};

const fetchTemplate = () => {
  const token = getTokenFromCookie();
  if (token) {
    fetch(URLs.GET_TEMPLATES, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.templateData) {
          const parsedTemplate = data.templateData.map(template => ({
            ...template,
            TemplateData: JSON.parse(template.TemplateData),
          }));
        

          // Extract only the TemplateData from each parsedTemplate object
       
          setParsedTemplates(parsedTemplate);
     
        
        }
      })
      .catch(error => {
        console.error('Error fetching templates:', error);
      });
  }
};



const handleDelete = async (id) => {
  const token = getTokenFromCookie();
  const endpoint = navItem === 'Trash' ? 'permenantdeleteForm' : 'deleteForm';
  const url = `${process.env.REACT_APP_API_BASE_URL}/${endpoint}`;
  if (token) {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'id': id })
    })
      .then(async (response) => {
        if (response.ok) {
          toast.success(ToastMessages.deleteFormSuccess);
          fetchData();
        } else {
          toast.error(ToastMessages.deleteFormError);
        }
      })
      .catch(error => {
        console.error('Error deleting form:', error);
        toast.error(ToastMessages.deleteFormError);
      });
  }
};
   const archiveForm = async (id) => {
    const token =getTokenFromCookie();
    if (token) {
      await fetch(URLs.ARCHIVE_FORM, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Add Content-Type header
        },
        body: JSON.stringify({ 'id': id })
      })
        .then(async (response) => {
          if (response.ok) {
            toast.success(ToastMessages.archiveFormSuccess);
            fetchData();
            // Optionally, update the forms state after successful archiving
           // Refresh the forms data after archiving
          } else {
            toast.error(ToastMessages.archiveFormError);
          }
        })
        .catch(error => {
          console.error('Error archiving form:', error);
          toast.error(ToastMessages.archiveFormError);
        });
    }
  };
  const ArchiveOff=async(id)=>
  {const token =getTokenFromCookie();
    if (token) {
      await fetch(URLs.ARCHIVE_OFF_FORM, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Add Content-Type header
        },
        body: JSON.stringify({ 'id': id })
      })
        .then(async (response) => {
          if (response.ok) {
            toast.success(ToastMessages.unarchiveFormSuccess);
            fetchData();
            // Optionally, update the forms state after successful archiving
           // Refresh the forms data after archiving
          } else {
            toast.error(ToastMessages.unarchiveFormError);
          }
        })
        .catch(error => {
          console.error('Error unarchiving form:', error);
          toast.error(ToastMessages.unarchiveFormError);
        });
    }

  }
  const handleSend =async(id)=>
    {
      const form = parsedForms.find(form => form.id === id); 
  
      if(form)
        {
          
          SetLink(form.formLink);
          open();
        }
        else {
    // Handle case where form with given ID is not found
    console.error('Form with ID', id, 'not found');
    // You can show a toast or any other appropriate error handling here
  }
    }
    const handleRestore=async(id)=>
  {const token =getTokenFromCookie();
    if (token) {
      await fetch(URLs.RETRIEVE_FORM, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Add Content-Type header
        },
        body: JSON.stringify({ 'id': id })
      })
        .then(async (response) => {
          if (response.ok) {
            toast.success(ToastMessages.retrieveFormSuccess);
            fetchData();
            // Optionally, update the forms state after successful archiving
           // Refresh the forms data after archiving
          } else {
            toast.error(ToastMessages.retrieveFormError);
          }
        })
        .catch(error => {
          console.error('Error retriving form:', error);
          toast.error(ToastMessages.retrieveFormError);
        });
    }

  }
 const sendMail = async (email) => {

    try {
      const response = await fetch(URLs.SEND_FORM_LINK_MAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, link: Link }),
      });
      if (response.ok) {
        toast.success("Email sent successfully");
        setEmailModalOpen(false);
      } else {
        toast.error("Failed to send email");
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Failed to send email");
    }
  
};

    const CreateTemplate=async()=>
      {
        Navigate('/createTemplate');
      }
     const handleAddClick = () => {
      if(navItem=='Templates')CreateTemplate();
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleStartFromScratch = () => {
  Navigate('/build');
    // Handle navigation to '/build' or any other logic
  };

  const handleChooseTemplate = () => {
    setTemplateOpen(true);
     setModalOpen(false);
  };
  const toggleIconVisibility = () => {
    if (navItem === 'Templates' || navItem === 'My Forms') {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }
  };
///////////////////////////////////////////////////////////////////////////////

const handleTemplateDelete = async (id) => {
  const token = getTokenFromCookie();
   const endpoint = navItem === 'Trash' ? 'PermenantDeleteTemplate' : 'DeleteTemplate';
     const url = `${process.env.REACT_APP_API_BASE_URL}/${endpoint}`;
    if (token) {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'id': id })
      })
      .then(async (response) => {
        if (response.ok) {
          toast.success(ToastMessages.templateDeletedSuccess);
          fetchData();
          fetchTemplate();
        } else {
          toast.error(ToastMessages.templateDeleteFailed);
        }
      })
      .catch(error => {
        console.error('Error deleting Template:', error);
        toast.error(ToastMessages.templateDeleteFailed);
      });
    }
  };
  const archiveTemplate = async (id) => {


  const token = getTokenFromCookie();
  if (token) {
    try {
      const response = await fetch(URLs.ARCHIVE_TEMPLATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'id': id })
      });
      
      if (response.ok) {
        toast.success(ToastMessages.templateArchivedSuccess);
        fetchData(); // Assuming fetchData() fetches the updated list of templates
        fetchTemplate();
      } else {
        toast.error(ToastMessages.templateArchiveFailed);
      }
    } catch (error) {
      console.error('Error archiving template:', error);
      toast.error(ToastMessages.templateArchiveFailed);
    }
  }
};
const archiveOffTemplate = async (id) => {
  const token = getTokenFromCookie();
  if (token) {
    try {
      const response = await fetch(URLs.ARCHIVE_OFF_FORM, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'id': id })
      });
      
      if (response.ok) {
        toast.success(ToastMessages.templateUnarchivedSuccess);
        fetchData(); // Assuming fetchData() fetches the updated list of templates
        fetchTemplate();
      } else {
        toast.error(ToastMessages.templateUnarchiveFailed);
      }
    } catch (error) {
      console.error('Error unarchiving template:', error);
      toast.error(ToastMessages.templateArchiveFailed);
    }
  }
};
const restoreTemplate = async (id) => {
  const token = getTokenFromCookie();
  if (token) {
    try {
      const response = await fetch(URLs.RESTORE_TEMPLATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'id': id })
      });
      
      if (response.ok) {
        toast.success(ToastMessages.templateRestoredSuccess);
        fetchData(); // Assuming fetchData() fetches the updated list of templates
        fetchTemplate();
      } else {
        toast.error(ToastMessages.templateRestoreFailed);
      }
    } catch (error) {
      console.error('Error restoring template:', error);
      toast.error(ToastMessages.templateArchiveFailed);
    }
  }
};
 return (
    <div style={{ height:'20vh', backgroundColor: '#f7f6f5' , position :"relative" }}>
     <Header />
      <Flex direction='row' wrap='nowrap' bg={'#f7f6f5'}>
       <Navbar setnavItem={setnavItem} setTemplateOpen={setTemplateOpen} />
               {navItem == "My Forms" && (
  <Container
    pos={'absolute'}  // Use 'fixed' or 'absolute' to fix its position
    top={'70px'}  // Adjust the top positioning as per your layout
    right={'20px'}  // Align to the right, adjust as needed
    size={'xl'}
    m={'xs'}
    p={'0'}
    style={{ zIndex: 2 }}  // Ensure it stays on top
  >
    <Group>
      <Button color='orange' variant={type == "All" ? 'filled' : 'outline'} onClick={() => { setType("All") }}>All</Button>
      <Button color='orange' variant={type == "Draft" ? 'filled' : 'outline'} onClick={() => { setType("Draft") }}>Draft</Button>
      <Button color='orange' variant={type == "Saved" ? 'filled' : 'outline'} onClick={() => { setType("Saved") }}>Saved</Button>
    </Group>
  </Container>
)}

             {navItem == "Templates" && <Container
              pos={'absolute'}  // Use 'fixed' or 'absolute' to fix its position
    top={'70px'}  // Adjust the top positioning as per your layout
    right={'20px'}  // Align to the right, adjust as needed
    fluid
    size={'xl'}
    m={'xs'}
    p={'0'}
    style={{ zIndex: 10 }}>
               <Group>
                <Button color='orange' variant={type=="All"?'filled':'outline'} onClick={()=>{setType("All")}}>All</Button>
                <Button color='orange' variant={type=="Draft"?'filled':'outline'} onClick={()=>{setType("Draft")}}>Draft</Button>
                <Button color='orange' variant={type=="Saved"?'filled':'outline'} onClick={()=>{setType("Saved")}}>Saved</Button>
              </Group>
             </Container>}
       <ScrollArea h="auto" bg='#f7f6f5' w='1200' pos={'relative'}>

          {navItem === "Trash" && (
            <Container fluid bg={'red'} size={'xl'} c='white' styles={{
              root: {
                width: '80vw',
                textAlign: 'center'
              }
            }} >
              <Text fw={700}>{TextMessages.trashWarning}</Text>
           </Container>)}
 
          <Flex
            direction='row'
            wrap='wrap'
            justify='center'
            align='center'
            styles={{
              root: {
                textAlign: 'center',
                margin: 'auto',
              },
            }}
         >
          
           {navItem === 'My Forms' && (
  <>
    {parsedForms.length === 0 ? (
      <Container pos={'relative'} mt={'50'} textAlign="center"  >
     <p style={{ 
    fontSize: '1.5rem', 
    color: '#333', 
    fontWeight: 'bold', 
    marginBottom: '1rem',
    lineHeight: '1.4'
  }}>
    No forms available. <br />Click the <span style={{color: '#007bff'}}> "+" </span> icon to start creating your forms.
  </p>
      </Container>
    ) : (
      parsedForms.map(form => (
        !form.isTrash && !form.isArchive && (
          <Container pos={'relative'} mt={'50'} key={form.id}>
            {type !== "Saved" && form.isDraft && (
              <Badge
                color="orange.4"
                variant="filled"
                pos={'absolute'}
                left={'70%'}
                top={'27%'}
                styles={{ root: { zIndex: 100 } }}
              >
                Draft
              </Badge>
            )}
            {type === "Draft" && form.isDraft && (
              <FormCard
                key={form.id}
                isDraft={form.isDraft}
                formName={form.formName}
                formDescription={form.formData.description}
                id={form.id}
                onDelete={() => handleDelete(form.id)}
                onArchive={() => archiveForm(form.id)}
                handleSend={() => handleSend(form.id)}
              />
            )}
            {type === "Saved" && !form.isDraft && (
              <FormCard
                key={form.id}
                isDraft={form.isDraft}
                formName={form.formName}
                formDescription={form.formData.description}
                id={form.id}
                onDelete={() => handleDelete(form.id)}
                onArchive={() => archiveForm(form.id)}
                handleSend={() => handleSend(form.id)}
              />
            )}
            {type === "All" && (
              <FormCard
                key={form.id}
                isDraft={form.isDraft}
                formName={form.formName}
                formDescription={form.formData.description}
                id={form.id}
                onDelete={() => handleDelete(form.id)}
                onArchive={() => archiveForm(form.id)}
                handleSend={() => handleSend(form.id)}
              />
            )}
          </Container>
        )
      ))
    )}
  </>
)}

            {navItem === 'Archive' && (
  <>
    {parsedForms.map(form => (
      !form.isTrash && form.isArchive && (
        <FormCard
          key={form.id}
          
          formName={form.formName}
          formDescription={form.formData.description}
          id={form.id}
          onDelete={() => handleDelete(form.id)}
          offArchive={() => ArchiveOff(form.id)}
          handleSend={handleSend}
        />
      )
    ))}
    {parsedTemplates.map(template => (
     !template.isTrash && template.isArchive && (
        <FormCard
          key={template.id}
          formName={template.TemplateName}
          Template={true}
          viewTemplate={true}
          onDelete={() => handleTemplateDelete(template.id)}
          offArchive={() => archiveOffTemplate(template.id)}
        />
      )
    ))}
  </>
)}

       {navItem === 'Templates' && (
    <div>
            {parsedTemplates.map(template => (
                !template.isTrash && !template.isArchive && (
                    <Container pos={'relative'} mt={'50'} key={template.id}>
                        {type !== "Saved" && template.isDraft && (
                            <Badge color="orange.4" variant="filled" pos={'absolute'} left={'70%'} top={'27%'} styles={{
                                root: {
                                    zIndex: 100,
                                }
                            }}>
                                Draft
                            </Badge>
                        )}
                        {type === "Draft" && template.isDraft && (
                            <FormCard
                                key={template.id}
                                id={template.id}
                                formName={template.TemplateName}
                                Template={true}
                                onDelete={() => handleTemplateDelete(template.id)}
                                onArchive={() => archiveTemplate(template.id)}
                              
                            />
                        )}
                        {type === "Saved" && !template.isDraft && (
                            <FormCard
                                key={template.id}
                                  id={template.id}
                                formName={template.TemplateName}
                                Template={true}
                                onDelete={() => handleTemplateDelete(template.id)}
                                onArchive={() => archiveTemplate(template.id)}
                            />
                        )}
                        {type === "All" && (
                            <FormCard
                                key={template.id}
                                  id={template.id}
                                formName={template.TemplateName}
                                Template={true}
                                onDelete={() => handleTemplateDelete(template.id)}
                                onArchive={() => archiveTemplate(template.id)}
                            />
                        )}
                    </Container>
                )
            ))}
        </div>
    )}
{navItem === 'Trash' && (
  <div>
    {parsedForms.map(form => (
      form.isTrash && (
        <FormCard
          key={form.id}
          isDraft={form.isDraft}
          formName={form.formName}
          formDescription={form.formData.description}
          id={form.id}
          onDelete={() => handleDelete(form.id)}
          onArchive={() => archiveForm(form.id)}
          handleSend={() => handleSend(form.id)}
          handleRestore={() => handleRestore(form.id)}
          Trash={true}
        />
      )
    ))}
    {parsedTemplates.map(template => (
      template.isTrash && (
        <FormCard
         
          key={template.id}
          isDraft={template.isDraft}
          formName={template.TemplateName}
          id={template.id}
          onDelete={() => handleTemplateDelete(template.id)}
          onArchive={() => archiveTemplate(template.id)}
          handleRestore={() => restoreTemplate(template.id)}
          Trash={true}
          Template={true}
        />
      )
    ))}
  </div>
)}
          </Flex>
        </ScrollArea>
        <Modal opened={opened} onClose={close} title="Form Link" centered pb={100} styles={{
          root: {
            textAlign: 'center'
          }
        }}>
          <Input
            placeholder={Link} // put form link
            rightSectionPointerEvents="all"
            mt="md"
            rightSection={
              <Tooltip label="Send Form" position="top" withArrow>
                <ActionIcon variant="outline" size={'lg'} color='grey' onClick={() => {
                  navigator.clipboard.writeText(Link) // put form link for hi
                }}>
                  <IconCopy style={{ width: '70%', height: '70%' }} stroke={2.5} />
                </ActionIcon>
              </Tooltip>
            }
          />
          <Button mt={10} bg={'orange'} onClick={() => setEmailModalOpen(true)} >{TextMessages.sendViaEmail}</Button>
        </Modal>
         <div className="fixed-icon">
   {showIcon && (
          <div className="fixed-icon" style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
            <ActionIcon size="lg" color="blue" onClick={handleAddClick}>
              <IconPlus size={100} />
            </ActionIcon>
          </div>
        )}
</div>
      </Flex>
       {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>{TextMessages.chooseOption}</p>
            <Button onClick={handleStartFromScratch} m={10} bg={'blue'} color={'white'}>
             {TextMessages.startFromScratch}
            </Button>
            <Button onClick={handleChooseTemplate} m={10} bg={'green'} color={'white'}>
              {TextMessages.templates}
            </Button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
      <Modal
      scrollAreaComponent={ScrollArea.Autosize}
      opened={templateOpen}
      onClose={() => setTemplateOpen(false)}
    >
      <Container fluid size="xl" styles={{ root: { textAlign: 'center', margin: 'auto', alignItems: 'center' } }}>
        <Text size="lg" weight={700} mb="md">{TextMessages.chooseAnTemplate}</Text>
        {parsedTemplates.map((template) => (!template.isDraft && !template.isTrash &&
          <FormCard key={template.id} formName={template.TemplateName} Template={true} TemplateForm={true} id={template.id} />
        ))}
      </Container>
    </Modal>
    <Modal opened={emailModalOpen} onClose={() => setEmailModalOpen(false)} title="Send Form Link" centered>
  <Input
    value={recipientEmail}
    onChange={(event) => setRecipientEmail(event.target.value)}
    placeholder="Enter recipient email"
    mt="md"
  />
  <Button mt={10} bg={'orange'} onClick={() => sendMail(recipientEmail)}>{TextMessages.sendViaEmail}</Button>
</Modal>
      <FooterCentered/>
      <ToastContainer />
    </div>
  );
}
