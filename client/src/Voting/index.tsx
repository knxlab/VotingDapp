
import useCurrentAccount from "../hooks/useCurrentAccount";
import useVotingData from "./useVotingData";
import styles from './styles.module.css'
import WorkflowStatusStepper from "./Components/WorkflowStatusStepper";
import React from "react";
import AppBar from "./Components/AppBar";
import { Container, Grid, Toolbar } from "@mui/material";
import { SpacingVertical } from "../Layout/Spacing";
import VotingMetrics from "./Components/Metrics";
import Proposals from "./Components/Proposals";
import { WorkflowStatus } from "./Types/WorkflowStatus";
import useVoter from "../hooks/useVoter";
import { VotingContext } from "./VotingContext";
import WorkflowActions from "./Components/OwnerUI/WorkflowActions";
import WinningProposal from "./Components/WinningProposal";



export default function Voting({ votingContract }: any) {

    const account = useCurrentAccount();
    const votingData = useVotingData({ votingContract });
    const { ready, workflowStatus, refresh } = votingData;
    const {voter: currentUserVoter, refetch: refetchVoter} = useVoter({ address: account, votingContract });

    if (!ready) {
        return <div>Loadding...</div>
    }

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
                    <WorkflowActions onStatusChanged={refresh} />
                    <SpacingVertical />

                    {votingData.workflowStatus === WorkflowStatus.VotesTallied && (
                        <>
                            <WinningProposal />
                            <SpacingVertical />
                        </>
                    )}

                    <Grid container spacing={2}>
                        <VotingMetrics votingData={votingData} />
                        {workflowStatus >= WorkflowStatus.ProposalsRegistrationStarted && (
                            <Proposals
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