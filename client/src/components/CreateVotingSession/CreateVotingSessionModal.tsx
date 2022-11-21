import * as React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Paper, TextField } from '@mui/material';
import styles from './styles.module.css';
import { useSnackbar } from 'notistack';
import useCurrentAccount from '../../hooks/useCurrentAccount';
import Title from '../../Layout/Title';
import useContracts from '../../hooks/useContracts';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function CreateVotingSessionModal({
    open = false,
    handleClose = () => {},
    onVotingSessionCreated = async () => null
}: {
    open: boolean;
    handleClose: () => any;
    onVotingSessionCreated?: () => Promise<any>;
}) {

    const [votingSessionDesc, setVotingSessionDesc] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const contracts = useContracts();
    const account = useCurrentAccount()
    const { enqueueSnackbar } = useSnackbar();

    const onPressSave = async () => {
        if (!contracts.VotingFactory) {
            alert("An error has occured, no VotingFactory available");
            return;
        }
        try {
            setLoading(true);
            await contracts.VotingFactory.methods.createVotingSession(votingSessionDesc).call({ from: account });
            await contracts.VotingFactory.methods.createVotingSession(votingSessionDesc).send({ from: account });
            await onVotingSessionCreated();
            setLoading(false);
            enqueueSnackbar("Voting session created !", { variant: "success" });
            handleClose();
        } catch (e) {
            setLoading(false);
        }
    }

    return (
        <Modal
            open={loading || open}
            onClose={loading ? () => {} : handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Paper sx={style}>
                <Title>
                    Create a new Voting Session
                </Title>
                <TextField placeholder='Write your question' fullWidth variant="outlined" disabled={loading} value={votingSessionDesc} onChange={e => setVotingSessionDesc(e.target.value)} />
                <div className={styles.modalActions}>
                    {!loading && <Button variant='outlined' color='secondary' onClick={handleClose}>Cancel</Button>}
                    <Button variant='contained' color='primary' disabled={loading || votingSessionDesc.trim() === ""} className={styles.saveBtn} onClick={onPressSave}>Save</Button>
                </div>
            </Paper>
        </Modal>
        );
    }