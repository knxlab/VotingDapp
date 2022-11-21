import React, { useContext } from 'react';
import VotingSession from '../Types/VotingSession';

export const VotingSessionsContext = React.createContext<{
    votingSessions: Array<VotingSession>,
    refresh: () => Promise<any>
}>({
    votingSessions: [],
    refresh: async() => null
});

export const useMyVotingSessions = () => useContext(VotingSessionsContext);