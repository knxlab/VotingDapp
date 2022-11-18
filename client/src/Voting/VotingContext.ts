import React, { useContext } from 'react';
import { VOTINGDATA } from './useVotingData';

export const VotingContext = React.createContext<{
    votingData: VOTINGDATA | null;
    votingContract: any;
}>({
    votingData: null,
    votingContract: null,
});

export const useVotingContext = () => useContext(VotingContext);