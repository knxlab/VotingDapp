import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { useEth } from "./contexts/EthContext";
import useContracts from "./hooks/useContracts";
import useCurrentAccount from "./hooks/useCurrentAccount";
import { VotingSessionsContext } from "./hooks/useMyVotingSessions";
import Sidebar from "./components/Sidebar";
import { VotingWithAddress } from "./Voting";

import VotingArtifact from './contracts/Voting.json';
import AppBar from "./components/AppBar";
import CreateVotingSessionButton from "./components/CreateVotingSession/ButtonCreate";
import Web3 from "web3";
import MetaMaskLoginBtn from "./components/MetaMaskLoginBtn";
import { FullWithHeightFlex } from "./Layout/FullWidthHeightFlex";
import Title from "./Layout/Title";


export function AppLoadEth() {
  const { state: { ready, loading, accounts }} = useEth();

  if (!ready) {
    return (
      <FullWithHeightFlex>
        <Title>Welcome to DecentraVote</Title>
        <MetaMaskLoginBtn />
      </FullWithHeightFlex>
    );
  }

  if (loading || !accounts || !accounts[0]) {
    return <div>loading...</div>
  }
  return (
    <App />
  )
}

function App() {

  const { state: { loading, web3 }} = useEth();
  const account = useCurrentAccount();
  const contracts = useContracts();

  const [votingSessionAdress, setVotingSessionAddress] = useState("");
  const [votingSessions, setVotingSessions] = useState([]);

  const fetchVotingSessions = useCallback(async () => {
    if (loading || !account || !contracts.VotingFactory) {
      return;
    }
    const myVotingSessions = await contracts.VotingFactory.methods.getMyVotingSessions().call({ from: account });
    setVotingSessions(myVotingSessions.map(votingSession => ({
      description: votingSession.description,
      contractAdress: votingSession.voteContractAdress,
      contract: new web3.eth.Contract(VotingArtifact.abi, votingSession.voteContractAdress)
    })));
  }, [loading, account, web3, contracts.VotingFactory]);

  useEffect(() => {
    fetchVotingSessions();
  }, [fetchVotingSessions]);

  useEffect(() => {
    let locationContractAddress = window.location.pathname.substring(1);
    if (!Web3.utils.isAddress(locationContractAddress)) {
      locationContractAddress = "";
      window.history.replaceState({}, document.title, `/`);
    } else {
      setVotingSessionAddress(locationContractAddress);
    }
  }, [])

  if (loading) {
    return <div className="appinfo-container"><CircularProgress /></div>
  }

  if (!contracts.VotingFactory) {
    return (
      <div className="appinfo-container">
        <Alert severity="error">Contracts are not available</Alert>
      </div>
    )
  }

  if (!account) {
    return <div>not connected</div>
  }

  const setSelectedVotingSession = (votingSession) => {
    window.history.replaceState({}, document.title, `/${votingSession.contractAdress}`);
    setVotingSessionAddress(votingSession.contractAdress);
  }

  return (
    <VotingSessionsContext.Provider
      value={{
        votingSessions
      }}
    >
      <Box id="App" sx={{ display: 'flex' }}>
          {votingSessions.length > 0 && (
            <Sidebar
              votingSessions={votingSessions}
              votingSessionAdress={votingSessionAdress}
              onClickVotingSession={setSelectedVotingSession}
              onVotingSessionCreated={fetchVotingSessions}
            />
          )}
          {votingSessionAdress !== ""  && <VotingWithAddress key={votingSessionAdress} votingSessionAdress={votingSessionAdress} />}
          {votingSessionAdress === "" && (
            <div className="placeholderContainer">
              <AppBar />
              <CreateVotingSessionButton onVotingSessionCreated={fetchVotingSessions} />
            </div>
          )}
      </Box>
    </VotingSessionsContext.Provider>
  );
}

export default App;
