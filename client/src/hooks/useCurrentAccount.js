import useEth from "../contexts/EthContext/useEth";

export default function useCurrentAccount() {
    const { state } = useEth();
    const { accounts } = state || {};
    return (accounts && accounts.length > 0) ? accounts[0] : null;
}