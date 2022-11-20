import { Alert, CircularProgress } from "@mui/material";
import "./App.css";
import { useEth } from "./contexts/EthContext";
import useContracts from "./hooks/useContracts";
import useCurrentAccount from "./hooks/useCurrentAccount";
import Voting from "./Voting";

function App() {

  const { state: { loading }} = useEth();
  const account = useCurrentAccount();
  const contracts = useContracts();

  if (loading) {
    return <div className="appinfo-container"><CircularProgress /></div>
  }

  if (!contracts.Voting) {
    return (
      <div className="appinfo-container">
        <Alert severity="error">Contract Voting is not available</Alert>
      </div>
    )
  }

  if (!account) {
    return <div>not connected</div>
  }

  return (
      <div id="App" >
          <Voting votingContract={contracts.Voting} />
      </div>
  );
}

export default App;
