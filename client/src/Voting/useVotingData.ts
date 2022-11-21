import { useEffect, useState } from "react";
import useCurrentAccount from "../hooks/useCurrentAccount";
import useEthEventSubscriber from "../hooks/useEthEventsSubscriber";
import arrayUniq from 'lodash.uniq';

type STATE = {
    ready: boolean;
    owner?: string;
    winningProposalID: number;
    workflowStatus: number;
}

const eventNames = ['VoterRegistered', 'ProposalRegistered', 'Voted'];

export type VOTINGDATA = STATE & {
    loading: boolean;
    isOwner: boolean;
    voters: Array<string>;
    votes: Array<string>;
    proposalIds: Array<number>;

    refresh: () => Promise<any>;
    addLocalVoter: (voterAddress: string) => any;
};

export default function useVotingData({ votingContract }: any): VOTINGDATA {

    const [localVoters, setLocalVoters] = useState<Array<string>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [votingData, setVotingData] = useState<STATE>({
        ready: false,
        winningProposalID: 0,
        workflowStatus: -1
    });
    const account = useCurrentAccount();
    const events = useEthEventSubscriber({ contract: votingContract, eventNames, account});

    const refreshData = async () => {

        if (!votingContract || !account) {
            return;
        }

        setLoading(true);

        const owner = await votingContract.methods.owner().call();
        const workflowStatus: number = parseInt(await votingContract.methods.workflowStatus().call(), 10);
        const winningProposalID: number = parseInt(await votingContract.methods.winningProposalID().call(), 10);

        setVotingData(votingData => ({
            ...votingData,
            winningProposalID,
            owner,
            workflowStatus,
            ready: true
        }));
        setLoading(false);
    }

    useEffect(() => {
        refreshData();
    // eslint-disable-next-line
    }, [votingContract, account]);

    return {
        ...votingData,
        isOwner: (account || "").toLowerCase() === (votingData?.owner || "").toLowerCase(),
        loading,
        voters: arrayUniq([
            ...(events['VoterRegistered'] || []).map(returnValues => returnValues.voterAddress as string),
            ...localVoters
        ]),
        votes: (events['Voted'] || []).map(returnValues => returnValues.voter as string),
        proposalIds: (events['ProposalRegistered'] || []).map(returnValues => parseInt(returnValues.proposalId, 10) as number),


        refresh: refreshData,
        addLocalVoter: (voterAddress) => {
            setLocalVoters(voters => ([...voters, voterAddress]))
        },
    };
}