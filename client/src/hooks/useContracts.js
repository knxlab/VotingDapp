import useEth from "../contexts/EthContext/useEth";

export default function useContracts() {
    const { state } = useEth();
    const { contracts } = state || {};
    return contracts;
}