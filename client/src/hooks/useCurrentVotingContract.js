import useEth from "../contexts/EthContext/useEth";

export default function useCurrentVotingContract() {
    const { state } = useEth();
    const { contract } = state || {};
    return contract || null;
}

