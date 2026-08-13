import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you absolutely sure?',
  message = 'This action cannot be undone. This will permanently delete the record and remove their data from our servers.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  type = 'danger'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'danger':
      default:
        return <Trash2 size={20} />;
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        {cancelLabel}
      </Button>
      <Button variant={type === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} maxWidth="450px">
      <div className="confirm-dialog-content">
        <div className={`confirm-dialog-icon-wrapper ${type}`}>{getIcon()}</div>
        <div className="confirm-dialog-text-details">
          <p className="confirm-dialog-msg">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
