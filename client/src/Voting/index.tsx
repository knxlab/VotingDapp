
import useCurrentAccount from "../hooks/useCurrentAccount";
import useVotingData from "./useVotingData";
import styles from './styles.module.css'
import WorkflowStatusStepper from "./Components/WorkflowStatusStepper";
import React from "react";
import AppBar from "./Components/AppBar";
import { Container, Grid, Toolbar } from "@mui/material";
import { SpacingVertical } from "../Layout/Spacing";
import VotingMetrics from "./Components/Metrics";
import ProposalTable from "./Components/ProposalTable";
import { WorkflowStatus } from "./Types/WorkflowStatus";
import useVoter from "../hooks/useVoter";
import { VotingContext } from "./VotingContext";



export default function Voting({ votingContract }: any) {

    const account = useCurrentAccount();
    const votingData = useVotingData({ votingContract });
    const { ready, workflowStatus } = votingData;
    const {voter: currentUserVoter, refetch: refetchVoter} = useVoter({ address: account, votingContract });

    if (!ready) {
        return <div>Loadding...</div>
    }

    console.log("votingContract", votingContract);
    return (
        <VotingContext.Provider
            value={{
                votingData,
                votingContract
            }}
        >
            <div className={styles.container}>
                <AppBar />
                <Toolbar />

                <Container className={styles.contentContainer} maxWidth="lg">

                    <WorkflowStatusStepper status={workflowStatus} />

                    <SpacingVertical />

                    <Grid container spacing={2}>
                        <VotingMetrics votingData={votingData} />
                        {workflowStatus >= WorkflowStatus.ProposalsRegistrationStarted && (
                            <ProposalTable
                                votingContract={votingContract}
                                votingData={votingData}
                                currentUserVoter={currentUserVoter}
                                refetchVoter={refetchVoter}
                            />
                        )}
                    </Grid>


                </Container>


            </div>
        </VotingContext.Provider>
    )
}