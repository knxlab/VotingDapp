
import useCurrentAccount from "../hooks/useCurrentAccount";
import useVotingData from "./useVotingData";
import styles from './styles.module.css'
import WorkflowStatusStepper from "./Components/WorkflowStatusStepper";
import React, { useEffect, useState } from "react";
import AppBar from "../components/AppBar";
import { Box, Container, Grid, Toolbar } from "@mui/material";
import { SpacingVertical } from "../Layout/Spacing";
import VotingMetrics from "./Components/Metrics";
import Proposals from "./Components/Proposals";
import { WorkflowStatus } from "./Types/WorkflowStatus";
import useVoter from "../hooks/useVoter";
import { VotingContext } from "./VotingContext";
import WorkflowActions from "./Components/OwnerUI/WorkflowActions";
import WinningProposal from "./Components/WinningProposal";
import AddVotersSection from "./Components/OwnerUI/AddVotersSection";
import VotingSession from "../Types/VotingSession";
import VotingArtifact from '../contracts/Voting.json';
import { useEth } from "../contexts/EthContext";

export function VotingWithAddress({ votingSessionAdress }: { votingSessionAdress: string }) {
    const [contract, setContract] = useState();
    const { state: { web3 }} = useEth();

    useEffect(() => {
        if (web3) {
            console.log("SET CONTRACT AGAIN ?");
            setContract(new web3.eth.Contract(VotingArtifact.abi, votingSessionAdress));
        }
    }, [votingSessionAdress, web3]);

    if (!contract) {
        return <div>loading...</div>
    }

    return (
        <Voting key={votingSessionAdress} votingSession={{
            description: "",
            contract,
            contractAdress: votingSessionAdress
        }} />
    );
}

export default function Voting({ votingSession }: { votingSession: VotingSession }) {

    const { contract: votingContract } = votingSession || {};
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
            <Box component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    position: 'relative',
                }}
            >
                <AppBar>
                    {votingData.description || ""}
                </AppBar>
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


            </Box>
        </VotingContext.Provider>
    )
}