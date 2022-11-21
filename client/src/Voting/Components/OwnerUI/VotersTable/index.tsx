import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { useVotingContext } from "../../../VotingContext";


export default function VotersTable() {

    const { votingData } = useVotingContext();
    const { voters } = votingData || {};

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Voter address</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {(voters || []).map((voterAddress) => {
                    return (
                        <TableRow key={voterAddress}>
                            <TableCell>{voterAddress}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}