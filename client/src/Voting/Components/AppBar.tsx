import { AppBar as MaterialAppBar, Chip, Toolbar, Typography } from '@mui/material';
import React from 'react';
import useCurrentAccount from '../../hooks/useCurrentAccount';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import DarkModeSwitch from '../../components/AppBar/DarkModeSwitch';

function AccountChip({ address }: { address: string }) {

    return (
        <Chip
            avatar={<Jazzicon diameter={20} seed={jsNumberForAddress(address)} />}
            label={`${address.slice(0, 5)}...${address.slice(-4)}`}
            variant="outlined"
            clickable
            style={{paddingLeft: '10px', color: "white"}}
        />
    )
}

export default function AppBar({ children }: { children?: React.ReactNode }) {
    const account = useCurrentAccount();
    return (
        <MaterialAppBar position="absolute">
            <Toolbar
                sx={{
                    pr: '24px', // keep right padding when drawer closed
                }}
            >

            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Voting session
            </Typography>

            {children}

            <div>
                <DarkModeSwitch />
                <AccountChip address={account} />
            </div>


            </Toolbar>
        </MaterialAppBar>
    )
}