import { Divider, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';
import Title from '../../Layout/Title';
import VotingSession from '../../Types/VotingSession';
import CreateVotingSessionButton from '../CreateVotingSession/ButtonCreate';
import styles from './styles.module.css';

const drawerWidth = 240;

export default function Sidebar({
    votingSessions,
    votingSessionAdress,
    onClickVotingSession = () => null,
    onVotingSessionCreated = async () => null
}: {
    votingSessions: Array<VotingSession>;
    votingSessionAdress: string;
    onClickVotingSession?: (votingSession: VotingSession) => any;
    onVotingSessionCreated?: () => Promise<any>;
}) {

    return (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
                <List>
                    <ListItem>
                        <Title>Voting contracts</Title>
                    </ListItem>
                    {votingSessions.map((votingSession) => (
                    <ListItem key={votingSession.contractAdress} disablePadding>
                        <ListItemButton selected={votingSessionAdress === votingSession.contractAdress} onClick={() => onClickVotingSession(votingSession)}>
                            <ListItemText
                                primary={votingSession.description}
                                primaryTypographyProps={{
                                    sx: {
                                        height: '50px',
                                        lineHeight: '50px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
                <Divider />
                <div className={styles.bottomBtnContainer}>
                    <CreateVotingSessionButton onVotingSessionCreated={onVotingSessionCreated} />
                </div>
        </Drawer>
    )
}