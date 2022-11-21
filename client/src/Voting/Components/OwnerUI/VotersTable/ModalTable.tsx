import * as React from 'react';
import Modal from '@mui/material/Modal';
import { Button, Paper } from '@mui/material';
import Title from '../../../../Layout/Title';
import VotersTable from '.';
import styles from './styles.module.css';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  width: '70%',
  p: 4,
};

export default function ModalVotersTable({
    open = false,
    handleClose = () => {},
}: {
    open: boolean;
    handleClose: () => any;
}) {


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Paper sx={style}>
                <Title>
                    Voters
                </Title>

                <div style={{maxHeight: '300px', marginBottom: "10px", overflow: 'auto'}}>
                    <VotersTable />
                </div>

                <div className={styles.modalActions}>
                    <Button variant='contained' color='primary' onClick={handleClose}>Close</Button>
                </div>
            </Paper>
        </Modal>
        );
    }