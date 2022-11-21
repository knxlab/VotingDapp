import { Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import extractError from '../../../helpers/contractErrors';
import useCurrentAccount from '../../../hooks/useCurrentAccount';
import { WorkflowStatus } from '../../Types/WorkflowStatus';
import { useVotingContext } from '../../VotingContext';

import styles from './WorkflowActions.module.css';


export default function WorkflowActions({
    onStatusChanged = async () => null
}: {
    onStatusChanged?: () => Promise<any>
}) {

    const [loading, setLoading] = useState(false);
    const account = useCurrentAccount();
    const { votingData, votingContract } = useVotingContext();
    const { workflowStatus } = votingData || {};

    if (account !== votingData?.owner) {
        return null;
    }

    const goToStatus = async (methodName: string, confirmMessage: string) => {
        if (!window.confirm(`Are you sure you want to ${confirmMessage} ?`)) {
            return;
        }
        try {
            setLoading(true);
            await votingContract.methods[methodName]().call({ from: account });
            await votingContract.methods[methodName]().send({ from: account });
            await onStatusChanged();
            setLoading(false);
        } catch (e: any) {
            const errorContract = extractError(e);
            if (errorContract) {
                alert(errorContract.message);
            }
            setLoading(false);
        }
    }

    let label: string;
    let buttonProps: {onClick: () => any; label: string} | null = null;
    switch(workflowStatus) {
        case WorkflowStatus.RegisteringVoters:
            label = "Start registration proposal";
            buttonProps = {label, onClick: () => goToStatus('startProposalsRegistering', label)};
            break;
        case WorkflowStatus.ProposalsRegistrationStarted:
            label = "End registration proposal";
            buttonProps = {label, onClick: () => goToStatus('endProposalsRegistering', label)};
            break;
        case WorkflowStatus.ProposalsRegistrationEnded:
            label = "Start Voting Session";
            buttonProps = {label, onClick: () => goToStatus('startVotingSession', label)};
            break;
        case WorkflowStatus.VotingSessionStarted:
            label = "End Voting Session";
            buttonProps = {label, onClick: () => goToStatus('endVotingSession', label)};
            break;
        case WorkflowStatus.VotingSessionEnded:
            label = "Tally Votes"
            buttonProps = {label, onClick: () => goToStatus('tallyVotes', label)};
            break;
        default:
            break;
    }

    if (buttonProps === null) {
        return null;
    }

    return (
        <div className={styles.container}>
            <Button disabled={loading} variant='contained' style={{height: '37px'}} onClick={loading ? () => {} : buttonProps.onClick}>
                {loading ? (<CircularProgress size={10} />) : buttonProps.label}
            </Button>
        </div>
    )
}