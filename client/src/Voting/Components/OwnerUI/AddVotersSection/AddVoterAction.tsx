import React, { useState } from 'react';
import { Button } from "@mui/material";
import AddVoterModal from './AddVoterModal';


export default function AddVoterAction({
    onVoterSaved
}: {
    onVoterSaved?: (voterAdress: string) => Promise<any>
}) {

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Button variant="outlined" onClick={() => setModalOpen(true)}>Add new voter</Button>
            {modalOpen && <AddVoterModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                onVoterSaved={onVoterSaved}
            />}
        </>
    )
}