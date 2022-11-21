import * as React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Paper, TextField } from '@mui/material';
import styles from './index.module.css';
import { useSnackbar } from 'notistack';
import useCurrentAccount from '../../../../../hooks/useCurrentAccount';
import { useVotingContext } from '../../../../VotingContext';
import Title from '../../../../../Layout/Title';
import Web3 from 'web3';

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

export default function AddVoterModal({
    open = false,
    handleClose = () => {},
    onVoterSaved = async () => null
}: {
    open: boolean;
    handleClose: () => any;
    onVoterSaved?: (voterAddress: string) => Promise<any>;
}) {

    const [voterAddress, setVoterAddress] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const account = useCurrentAccount();
    const { votingContract } = useVotingContext();
    const { enqueueSnackbar } = useSnackbar();

    const onPressSave = async () => {
        try {
            setLoading(true);
            // await votingContract.methods.addVoter(voterAddress).call({ from: account });
            await votingContract.methods.addVoter(voterAddress).send({ from: account });
            await onVoterSaved(voterAddress);
            setLoading(false);
            handleClose();
            enqueueSnackbar("Voter added !", { variant: "success" });
        } catch (e) {
            setLoading(false);
        }
    }

    const canSave = Web3.utils.isAddress(voterAddress);

    return (
        <Modal
            open={loading || open}
            onClose={loading ? () => {} : handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Paper sx={style}>
                <Title>
                    Add a new voter
                </Title>
                <TextField placeholder='Address of the voter' fullWidth variant="outlined" disabled={loading} value={voterAddress} onChange={e => setVoterAddress(e.target.value)} />
                <div className={styles.modalActions}>
                    {!loading && <Button variant='outlined' color='secondary' onClick={handleClose}>Cancel</Button>}
                    <Button variant='contained' color='primary' disabled={!canSave || loading || voterAddress.trim() === ""} className={styles.saveBtn} onClick={onPressSave}>Save</Button>
                </div>
            </Paper>
        </Modal>
        );
    }