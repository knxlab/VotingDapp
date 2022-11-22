const actions = {
  init: "INIT",
};

const initialState = {
  loading: true,
  ready: false,
  web3: null,
  accounts: null,
  networkID: null,

  artifacts: {},
  contracts: {}
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export {
  actions,
  initialState,
  reducer
};
