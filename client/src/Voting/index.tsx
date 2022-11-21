
import useCurrentAccount from "../hooks/useCurrentAccount";
import useVotingData from "./useVotingData";
import styles from './styles.module.css'
import WorkflowStatusStepper from "./Components/WorkflowStatusStepper";
import React from "react";
import AppBar from "./Components/AppBar";
import { Container, Grid, Paper, Toolbar, Typography } from "@mui/material";
import { SpacingVertical } from "../Layout/Spacing";
import VotingMetrics from "./Components/Metrics";
import Proposals from "./Components/Proposals";
import { WorkflowStatus } from "./Types/WorkflowStatus";
import useVoter from "../hooks/useVoter";
import { VotingContext } from "./VotingContext";
import WorkflowActions from "./Components/OwnerUI/WorkflowActions";
import WinningProposal from "./Components/WinningProposal";
import AddVotersSection from "./Components/OwnerUI/AddVotersSection";



export default function Voting({ votingContract }: any) {

    const account = useCurrentAccount();
    const votingData = useVotingData({ votingContract });
    const { ready, isOwner, workflowStatus, refresh } = votingData;
    const {voter: currentUserVoter, isVoter, refetch: refetchVoter} = useVoter({ address: account, votingContract });

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
                    {account === votingData?.owner && (
                        <>
                            <WorkflowActions onStatusChanged={refresh} />
                        </>
                    )}

                    <SpacingVertical />

                    {votingData.workflowStatus === WorkflowStatus.VotesTallied && (
                        <>
                            <WinningProposal isVoter={isVoter} />
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
                        {isOwner && workflowStatus === WorkflowStatus.RegisteringVoters && (
                            <AddVotersSection />
                        )}
                    </Grid>


                </Container>


            </div>
        </VotingContext.Provider>
    )
}