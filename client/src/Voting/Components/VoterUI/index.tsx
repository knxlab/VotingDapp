import { Grid } from "@mui/material";
import React from 'react';
import { VOTINGDATA } from "../../useVotingData";
import VotingMetrics from "../Metrics";

export default function VoterUI({ votingData }: { votingData: VOTINGDATA }) {
    return (
        <Grid container spacing={2}>

            <VotingMetrics votingData={votingData} />

        </Grid>
    )
}