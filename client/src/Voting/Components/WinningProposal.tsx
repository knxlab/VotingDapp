import { Alert, Grid, Paper } from '@mui/material';
import React from 'react';
import { useVotingContext } from '../VotingContext';

export default function WinningProposal() {
    const { votingData } = useVotingContext();
    const { winningProposalID } = votingData || {};

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
                <Alert severity="success">Winning proposal : {winningProposalID}</Alert>
            </Paper>
        </Grid>
    )
}