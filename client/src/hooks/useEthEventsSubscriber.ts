import { useEffect } from "react";

export type EVENT_TYPE = {
    [key: string]: Array<any>
}

export default function useEvent({ onEvent, contract, eventName, account }: { onEvent: (event: any) => any, contract: any; eventName: string; account: string;}) {
    return useEffect(() => {
        const eventEmitter = contract.events[eventName]({ fromBlock: 'earliest' });
        eventEmitter.on('data', onEvent);
        return () => {
            eventEmitter.off('data', onEvent);
        }
    }, [onEvent, contract, eventName, account]);
}