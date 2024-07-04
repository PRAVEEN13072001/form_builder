import React from 'react';
import { Modal, Button } from '@mantine/core';

const CustomModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Form No Longer Accepting Responses"
      centered
      overlayOpacity={0.55}
      overlayBlur={3}
    >
      <p>This form is no longer accepting responses.</p>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </Modal>
  );
};

export default CustomModal;
