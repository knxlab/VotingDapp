import { useCallback, useEffect, useState } from "react";
import useCurrentAccount from "../hooks/useCurrentAccount";
import useEvent from "../hooks/useEthEventsSubscriber";
import arrayUniq from 'lodash.uniq';

type STATE = {
    ready: boolean;
    owner?: string;
    description: string;
    winningProposalID: number;
    workflowStatus: number;

    events: {
        VoterRegistered: Array<any>;
        Voted: Array<any>;
        ProposalRegistered: Array<any>;
    }
}

export type VOTINGDATA = STATE & {
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
    workflowStatus: -1,
    events: {
        Voted: [],
        VoterRegistered: [],
        ProposalRegistered: []
    }
}

export default function useVotingData({ votingContract }: any): VOTINGDATA {

    const [localVoters, setLocalVoters] = useState<Array<string>>([]);
    const [votingData, setVotingData] = useState<STATE>(defaultVotingData);
    const account = useCurrentAccount();

    const onEvent = (eventName: 'VoterRegistered' | 'Voted' | 'ProposalRegistered') => (event: any) => {
        setVotingData((votingData) => ({
            ...votingData,
            events: {
                ...votingData.events,
                [eventName]: [
                    ...votingData.events[eventName],
                    event
                ]
            }
        }))
    }

    const refreshData = useCallback(async () => {

        if (!votingContract || !account) {
            return;
        }

        const [
            owner, workflowStatus, winningProposalID, description,
            VoterRegistered,
            Voted,
            ProposalRegistered
        ] = await Promise.all([
            votingContract.methods.owner().call(),
            votingContract.methods.workflowStatus().call().then((workflowStatus: string) => parseInt(workflowStatus, 10)),
            votingContract.methods.winningProposalID().call().then((winningProposalID: string) => parseInt(winningProposalID, 10)),
            votingContract.methods.description().call(),
            votingContract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: 'latest' }),
            votingContract.getPastEvents('Voted', { fromBlock: 0, toBlock: 'latest' }),
            votingContract.getPastEvents('ProposalRegistered', { fromBlock: 0, toBlock: 'latest' })
        ]);

        const events = {
            VoterRegistered,
            Voted,
            ProposalRegistered
        }

        setVotingData(votingData => ({
            ...votingData,
            winningProposalID,
            description,
            owner,
            workflowStatus,
            events,
            ready: true
        }));

    }, [votingContract, account]);

    useEffect(() => {
        setVotingData(defaultVotingData);
        setLocalVoters([]);
    }, [votingContract]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // Events
    useEvent({ onEvent: onEvent('VoterRegistered'), contract: votingContract, eventName: 'VoterRegistered', account });
    useEvent({ onEvent: onEvent('Voted'), contract: votingContract, eventName: 'Voted', account });
    useEvent({ onEvent: onEvent('ProposalRegistered'), contract: votingContract, eventName: 'ProposalRegistered', account });

    const addLocalVoter = useCallback((voterAddress: string) => {
        setLocalVoters(voters => ([...voters, voterAddress]))
    }, [])

    return {
        ...votingData,
        isOwner: (account || "").toLowerCase() === (votingData?.owner || "").toLowerCase(),
        voters: arrayUniq([
            ...(votingData?.events.VoterRegistered || []).map(({ returnValues }: any) => returnValues.voterAddress as string),
            ...localVoters
        ]),
        votes: (votingData?.events.Voted || []).map(({ returnValues }: any) => returnValues.voter as string),
        proposalIds: (votingData?.events.ProposalRegistered || []).map(({ returnValues }: any) => parseInt(returnValues.proposalId, 10) as number),

        refresh: refreshData,
        addLocalVoter
    };
}