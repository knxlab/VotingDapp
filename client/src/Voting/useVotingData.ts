import { useEffect, useState } from "react";
import useCurrentAccount from "../hooks/useCurrentAccount";
import useEthEventSubscriber from "../hooks/useEthEventsSubscriber";
import arrayUniq from 'lodash.uniq';

type STATE = {
    ready: boolean;
    owner?: string;
    description: string;
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


const defaultVotingData: STATE = {
    ready: false,
    winningProposalID: 0,
    description: "",
    workflowStatus: -1
}

export default function useVotingData({ votingContract }: any): VOTINGDATA {

    const [localVoters, setLocalVoters] = useState<Array<string>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [votingData, setVotingData] = useState<STATE>(defaultVotingData);
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
        const description: string = await votingContract.methods.description().call();

        setVotingData(votingData => ({
            ...votingData,
            winningProposalID,
            description,
            owner,
            workflowStatus,
            ready: true
        }));
        setLoading(false);
    }

    useEffect(() => {
        console.log("REFRESH DATA ??");
        setVotingData(defaultVotingData);
        setLocalVoters([]);
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