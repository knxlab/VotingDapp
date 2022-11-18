import { Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import Title from '../../Layout/Title';
import { VOTINGDATA } from '../useVotingData';

export default function VotingMetrics({ votingData }: { votingData: VOTINGDATA }) {
    return (
        <>
            <Grid item xs={6}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Title>Voters</Title>
                    <Typography component="p" variant="h4">
                        {votingData.voters.length} Voters
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={6}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Title>Votes</Title>
                    <Typography component="p" variant="h4">
                        {votingData.proposalIds.length} Votes
                    </Typography>
                </Paper>
            </Grid>
        </>
    )
}