import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

const ModalConfirmation = ({ open, handleCloseModal, handleConfirmDelete, selectedOrder }) => {
    return (
        <Dialog open={open} onClose={handleCloseModal}>
            <DialogTitle>
                {selectedOrder ? `Are you sure you want to delete the order #${selectedOrder.order_number}?` : "Are you sure you want to delete this order?"}
            </DialogTitle>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModalConfirmation;