import React, { useState } from 'react';
import { Button } from "@mui/material";
import AddProposalModal from "../VoterUI/AddProposalModal";


export default function AddProposalAction({
    onProposalSaved
}: {
    onProposalSaved?: () => Promise<any>
}) {

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Button variant="outlined" onClick={() => setModalOpen(true)}>Add new proposal</Button>
            {modalOpen && <AddProposalModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                onProposalSaved={onProposalSaved}
            />}
        </>
    )
}