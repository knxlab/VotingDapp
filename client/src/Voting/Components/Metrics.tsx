import { Button, Grid, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { RowSpaceBetween } from '../../Layout/RowSpaceBetween';
import Title from '../../Layout/Title';
import { WorkflowStatus } from '../Types/WorkflowStatus';
import { VOTINGDATA } from '../useVotingData';
import ModalVotersTable from './OwnerUI/VotersTable/ModalTable';

export default function VotingMetrics({ votingData }: { votingData: VOTINGDATA }) {

    const [modalVotersOpen, setModalVotersOpen] = useState<boolean>(false);
    const { workflowStatus } = votingData;
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
                    <RowSpaceBetween>
                        <Title>Voters</Title>
                        {workflowStatus !== WorkflowStatus.RegisteringVoters && (
                            <>
                                <Button variant="outlined" onClick={() => setModalVotersOpen(true)}>See voters</Button>
                                {modalVotersOpen && <ModalVotersTable open={modalVotersOpen} handleClose={() => setModalVotersOpen(false)}/>}
                            </>
                        )}
                    </RowSpaceBetween>

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
                        {votingData.votes.length} Votes
                    </Typography>
                </Paper>
            </Grid>
        </>
    )
}