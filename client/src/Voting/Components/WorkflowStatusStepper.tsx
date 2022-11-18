import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import React from 'react';
import { WorkflowStatus } from '../Types/WorkflowStatus';
import { enumKeys } from '../../helpers/enum';

export default function WorkflowStatusStepper({ status = 0 }: { status? : WorkflowStatus }) {
    console.log("Current status", status, typeof status);
    return (
        <Stepper activeStep={status}>
            {enumKeys(WorkflowStatus).map((WorkflowStatusKey, index) => {
                return (
                    <Step key={WorkflowStatusKey}>
                        <StepLabel>{WorkflowStatusKey}</StepLabel>
                    </Step>
                );
            })}
        </Stepper>
    )
}