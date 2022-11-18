import "./App.css";
import useContracts from "./hooks/useContracts";
import useCurrentAccount from "./hooks/useCurrentAccount";
import Voting from "./Voting";

function App() {

  const account = useCurrentAccount();
  const contracts = useContracts();

  if (!contracts.Voting) {
    return <div>Contract Voting is not ready ?</div>
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
