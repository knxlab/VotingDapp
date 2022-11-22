import { Button } from "@mui/material";
import { useEth } from "../../contexts/EthContext";
import { ReactComponent as Icon } from './metamask.svg';

export default function MetaMaskLoginBtn() {
    const { connect, state: { ready }} = useEth();

    return (
        <Button variant='contained' onClick={ready ? () => {} : connect}>
            <Icon style={{marginRight: '10px'}} /> Login with Metamask
        </Button>
    )
}