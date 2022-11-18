import * as React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Title from '../../../Layout/Title';
import { Paper, TextField } from '@mui/material';
import styles from './AddProposalModal.module.css';
import useCurrentAccount from '../../../hooks/useCurrentAccount';
import { useVotingContext } from '../../VotingContext';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';

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

export default function AddProposalModal({
    open = false,
    handleClose = () => {},
    onProposalSaved = async () => null
}: {
    open: boolean;
    handleClose: () => any;
    onProposalSaved?: () => Promise<any>;
}) {

    const [proposalDesc, setProposalDesc] = React.useState("Eth 3.0");
    const [loading, setLoading] = React.useState(false);
    const account = useCurrentAccount();
    const { votingContract, votingData } = useVotingContext();
    const { enqueueSnackbar } = useSnackbar();

    const onPressSave = async () => {
        try {
            setLoading(true);
            console.log("votingContract.methods", votingContract.methods.addProposal, account);
            await votingContract.methods.addProposal(proposalDesc).call({ from: account });
            await votingContract.methods.addProposal(proposalDesc).send({ from: account });
            await onProposalSaved();
            setLoading(false);
            handleClose();
            enqueueSnackbar("Added !", { variant: "success" });
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
                    Add a new Proposal
                </Title>
                <TextField placeholder='Write your proposal' fullWidth variant="outlined" disabled={loading} value={proposalDesc} onChange={e => setProposalDesc(e.target.value)} />
                <div className={styles.modalActions}>
                    {!loading && <Button variant='outlined' color='secondary' onClick={handleClose}>Cancel</Button>}
                    <Button variant='contained' color='primary' disabled={loading || proposalDesc.trim() === ""} className={styles.saveBtn} onClick={onPressSave}>Save</Button>
                </div>
            </Paper>
        </Modal>
        );
    }