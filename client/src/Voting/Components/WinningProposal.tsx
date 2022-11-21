import { Alert, Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useCurrentAccount from '../../hooks/useCurrentAccount';
import { useVotingContext } from '../VotingContext';

export default function WinningProposal({
    isVoter
}: {
    isVoter: boolean
}) {
    const [proposal, setProposal] = useState<{
        description: string;
        voteCount: number;
    }>();
    const account = useCurrentAccount();
    const { votingData, votingContract } = useVotingContext();
    const { winningProposalID } = votingData || {};

    useEffect(()  => {
        (async () => {
            const proposal = await votingContract.methods.getOneProposal(winningProposalID).call({ from: account });
            setProposal({
                description: proposal.description,
                voteCount: proposal.voteCount
            })
            console.log("proposal", proposal);
        })()
    }, [isVoter, account, votingContract, winningProposalID])

    if (!winningProposalID) {
        return null;
    }

    return (
        <Grid item xs={12}>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Alert severity="success">
                    Winning proposal : {!!proposal ? `"${proposal.description}" (id ${winningProposalID}) with ${proposal.voteCount} votes` : ("id: " + winningProposalID)}
                </Alert>
            </Paper>
        </Grid>
    )
}