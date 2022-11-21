import React, { useState } from 'react';
import { Button } from "@mui/material";
import CreateVotingSessionModal from './CreateVotingSessionModal';


export default function CreateVotingSessionButton({
    onVotingSessionCreated
}: {
    onVotingSessionCreated?: () => Promise<any>
}) {

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Button variant="outlined" onClick={() => setModalOpen(true)}>Create voting session</Button>
            {modalOpen && <CreateVotingSessionModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                onVotingSessionCreated={onVotingSessionCreated}
            />}
        </>
    )
}