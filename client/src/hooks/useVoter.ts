import { useEffect, useState } from "react";
import useCurrentAccount from "./useCurrentAccount";

export type VOTER = {
    isRegistered: boolean;
    hasVoted: boolean;
    votedProposalId: number;
}

const DefaultVoter: VOTER = {
    isRegistered: false,
    hasVoted: false,
    votedProposalId: 0
};
export default function useVoter({ address, votingContract }: { address: string; votingContract: any }): { voter: VOTER, refetch: () => Promise<any>} {
    const [voter, setVoter] = useState<VOTER>(DefaultVoter);

    const account = useCurrentAccount();

    const loadVoter = async () => {
        try {
            const voter = await votingContract.methods.getVoter(address).call({ from: account });
            setVoter({
                isRegistered: voter.isRegistered,
                hasVoted: voter.hasVoted,
                votedProposalId: parseInt(voter.votedProposalId, 10)
            })
        } catch (e) {
            setVoter(DefaultVoter)
        }
    }

    useEffect(() => {
        loadVoter();
    }, [address, votingContract, account]);

    return {voter, refetch: loadVoter};
}