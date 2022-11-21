import React from 'react';
import { Grid, Paper } from "@mui/material";
import Title from "../../../../Layout/Title";
import styles from './styles.module.css';
import { useVotingContext } from '../../../VotingContext';
import AddVoterAction from './AddVoterAction';
import VotersTable from '../VotersTable';


export default function AddVotersSection() {

    const { votingData } = useVotingContext();
    const { isOwner, addLocalVoter } = votingData || {};

    if (!isOwner) {
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
                <div className={styles.proposalHeader}>
                    <Title>Voters</Title>

                    <AddVoterAction
                        onVoterSaved={async (voterAddress: string) => {
                            if (addLocalVoter) {
                                addLocalVoter(voterAddress);
                            }
                        }}
                    />
                </div>

                <VotersTable />

            </Paper>
        </Grid>
    )
}