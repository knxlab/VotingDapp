import { Button } from '@mui/material';
import React from 'react';
import useCurrentAccount from '../../../hooks/useCurrentAccount';
import { WorkflowStatus } from '../../Types/WorkflowStatus';
import { useVotingContext } from '../../VotingContext';

import styles from './WorkflowActions.module.css';

export default function WorkflowActions() {

    const account = useCurrentAccount();
    const { votingData, votingContract } = useVotingContext();
    const { workflowStatus } = votingData || {};

    if (account !== votingData?.owner) {
        return null;
    }

    // const goToStatus = async () => {
    //     try {
    //         await votingContract.methods.addProposal(proposalDesc).call({ from: account });
    //         await votingContract.methods.addProposal(proposalDesc).send({ from: account });
    //     } catch (e) {

    //     }
    // }

    let buttonProps: {onClick: () => any; label: string} | null = null;
    switch(workflowStatus) {
        case WorkflowStatus.RegisteringVoters:
            buttonProps = {label: "Start registration proposal", onClick: console.log};
            break;
        case WorkflowStatus.ProposalsRegistrationStarted:
            buttonProps = {label: "End registration proposal", onClick: console.log};
            break;
        case WorkflowStatus.ProposalsRegistrationEnded:
            buttonProps = {label: "Start Voting Session", onClick: console.log};
            break;
        case WorkflowStatus.ProposalsRegistrationEnded:
            buttonProps = {label: "Start Voting Session", onClick: console.log};
            break;
        default:
            break;
    }

    if (buttonProps === null) {
        return null;
    }

    return (
        <div className={styles.container}>
            <Button variant='contained'>{buttonProps.label}</Button>
        </div>
    )
}