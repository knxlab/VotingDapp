import { useEffect, useState } from "react";
import useCurrentAccount from "../hooks/useCurrentAccount";
import useEthEventSubscriber from "../hooks/useEthEventsSubscriber";

type STATE = {
    ready: boolean;
    owner?: string;
    workflowStatus: number;
}

const eventNames = ['VoterRegistered', 'ProposalRegistered'];

export type VOTINGDATA = STATE & {
    loading: boolean;
    refresh: () => Promise<any>;
    voters: Array<string>;
    proposalIds: Array<number>;
};

export default function useVotingData({ votingContract }: any): VOTINGDATA {

    console.log("--- votingContract", votingContract);

    const [loading, setLoading] = useState<boolean>(false);
    const [votingData, setVotingData] = useState<STATE>({
        ready: false,
        workflowStatus: -1
    });
    const events = useEthEventSubscriber({ contract: votingContract, eventNames});
    const account = useCurrentAccount();

    const refreshData = async () => {

        if (!votingContract || !account) {
            return;
        }

        setLoading(true);

        const owner = await votingContract.methods.owner().call();
        const workflowStatus: number = parseInt(await votingContract.methods.workflowStatus().call(), 10);

        setVotingData(votingData => ({
            ...votingData,
            owner,
            workflowStatus,
            ready: true
        }));
        setLoading(false);
    }

    useEffect(() => {
        refreshData();
    }, [votingContract, account]);

    return {
        ...votingData,
        loading,
        refresh: refreshData,
        voters: (events['VoterRegistered'] || []).map(returnValues => returnValues.voterAddress as string),
        proposalIds: (events['ProposalRegistered'] || []).map(returnValues => returnValues.proposalId as number)
    };
}