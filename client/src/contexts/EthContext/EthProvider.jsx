import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifacts => {
      if (artifacts) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();

        const contracts = {};
        Object.keys(artifacts).forEach(artifactName => {
          const artifact = artifacts[artifactName];
          const { abi } = artifact;
          let address, contract;
          try {
            address = artifact.networks[networkID].address;
            contract = new web3.eth.Contract(abi, address);
          } catch (err) {
            console.error(err);
          }
          contracts[artifactName] = contract;
        })

        dispatch({
          type: actions.init,
          data: { artifacts, web3, accounts, networkID, contracts }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifacts = {
          Voting: require("../../contracts/Voting.json")
        };
        init(artifacts);
      } catch (err) {
        console.error(err);
      }
    };

    console.log("TRY INIT HER E?")
    tryInit();
  }, []);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifacts);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifacts]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
