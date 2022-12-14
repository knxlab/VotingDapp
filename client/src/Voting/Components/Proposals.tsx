import { Button, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import extractError from '../../helpers/contractErrors';
import useCurrentAccount from '../../hooks/useCurrentAccount';
import { VOTER } from '../../hooks/useVoter';
import Title from '../../Layout/Title';
import { WorkflowStatus } from '../Types/WorkflowStatus';
import { VOTINGDATA } from '../useVotingData';
import AddProposalAction from './ProposalTable/AddProposalAction';
import styles from './styles.module.css';

export default function ProposalTable({
    votingData, currentUserVoter, refetchVoter, votingContract
}: {
    votingData: VOTINGDATA,
    currentUserVoter: VOTER;
    refetchVoter: () => Promise<any>;
    votingContract: any;
}) {

    const account = useCurrentAccount();
    const [isLoading, setIsLoading] = useState(true);
    const [isVotingForProposalId, setIsVotingForProposalId] = useState(0);
    const [proposals, setProposals] = useState<Array<{proposalId: number; proposalDesc: string; voteCount: number}>>([]);
    const isVoter = votingData.voters.indexOf(account) !== -1;

    const fetchProposals = useCallback(async () => {
        setIsLoading(true);

        if (!isVoter) {
            setProposals(votingData.proposalIds.map(proposalId => ({
                proposalId,
                proposalDesc: "Only voters can see proposal description...",
                voteCount: 0
            })))
            setIsLoading(false)
            return;
        }

        return await Promise.all(votingData.proposalIds.map(async proposalId => {
            const proposal = await votingContract.methods.getOneProposal(proposalId).call({ from: account });

            return {
                proposalId,
                proposalDesc: proposal.description,
                voteCount: parseInt(proposal.voteCount, 10)
            } as { proposalId: number; proposalDesc: string; voteCount: number; };
        })).then((proposals) => {
            setProposals(proposals);
            setIsLoading(false);
        })
    }, [isVoter, account, votingData, votingContract]);

    const voteForProposal = async (proposalId: number) => {
        setIsVotingForProposalId(proposalId);
        try {
            await votingContract.methods.setVote(proposalId).call({ from: account });
            await votingContract.methods.setVote(proposalId).send({ from: account });
            await fetchProposals();
            await refetchVoter();
        } catch(e: any) {
            const contractError = extractError(e);
            if (contractError) {
                alert(contractError.message);
            }
        }
        setIsVotingForProposalId(0);
    }

    useEffect(() => {
        fetchProposals()
    }, [fetchProposals]);

    const canVote = () => {
        return isVoter && !currentUserVoter.hasVoted && votingData.workflowStatus === WorkflowStatus.VotingSessionStarted;
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
                    <Title>Proposals</Title>
                    {isVoter && votingData.workflowStatus === WorkflowStatus.ProposalsRegistrationStarted && (
                        <AddProposalAction
                            onProposalSaved={fetchProposals}
                        />
                    )}
                </div>
                <Typography component="p" variant="h4">
                    {votingData.proposalIds.length} Proposals
                </Typography>

                {isVoter && <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Proposal ID</TableCell>
                            <TableCell align="left">Proposal</TableCell>
                            <TableCell align="left">Count</TableCell>
                            {canVote() && (
                                <>
                                    <TableCell align="left"></TableCell>
                                </>
                            )}

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell>loading...</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        )}
                        {!isLoading && [...proposals].sort((a, b) => (a.voteCount > b.voteCount ? -1 : 1)).map(({proposalId, proposalDesc, voteCount}) => {
                            return (
                                <TableRow key={proposalId}>
                                    <TableCell>{proposalId}</TableCell>
                                    <TableCell>{proposalDesc}</TableCell>
                                    <TableCell>{voteCount}</TableCell>
                                    {canVote() && (
                                        <TableCell width={230}>{currentUserVoter.votedProposalId === proposalId ? "Voted Proposal" : (
                                            (currentUserVoter.votedProposalId !== 0 || (
                                                isVotingForProposalId !== 0 && isVotingForProposalId !== proposalId
                                            )) ? "" :
                                            <Button variant="contained" disabled={isVotingForProposalId !== 0} onClick={() => voteForProposal(proposalId)}>
                                                {isVotingForProposalId !== 0 ? "Loading..." : "Vote for this proposal"}
                                            </Button>
                                        )}</TableCell>
                                    )}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>}
            </Paper>
        </Grid>
    )
}