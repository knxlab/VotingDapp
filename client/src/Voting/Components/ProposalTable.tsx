import { Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useCurrentAccount from '../../hooks/useCurrentAccount';
import Title from '../../Layout/Title';
import { VOTINGDATA } from '../useVotingData';


export default function ProposalTable({ votingData }: { votingData: VOTINGDATA }) {

    const account = useCurrentAccount();
    const [isLoading, setIsLoading] = useState(true);
    const [proposals, setProposals] = useState<Array<{proposalId: number; proposalDesc: string}>>([]);

    const isVoter = votingData.voters.indexOf(account) !== -1;

    useEffect(() => {
        setIsLoading(true);

        if (!isVoter) {
            setProposals(votingData.proposalIds.map(proposalId => ({
                proposalId,
                proposalDesc: "Only voters can see proposal description..."
            })))
            setIsLoading(false)
            return;
        }

        Promise.all(votingData.proposalIds.map(async proposalId => {
            console.log("Load : ", proposalId);
        })).then(console.log)


    }, [isVoter, votingData.proposalIds])

    return (
        <Grid item xs={12}>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Title>Proposals</Title>
                <Typography component="p" variant="h4">
                    {votingData.proposalIds.length} Proposals
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Proposal ID</TableCell>
                            <TableCell align="left">Proposal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell>loading...</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        )}
                        {!isLoading && proposals.map(({proposalId, proposalDesc}) => (
                            <TableRow key={proposalId}>
                                <TableCell>{proposalId}</TableCell>
                                <TableCell>{proposalDesc}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Grid>
    )
}