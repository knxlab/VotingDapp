import { useEffect } from "react";

export type EVENT_TYPE = {
    [key: string]: Array<any>
}

export default function useEvent({ onEvent, contract, eventName, account }: { onEvent: (event: any, eventName: string) => void, contract: any; eventName: string; account: string;}) {

    return useEffect(() => {
        const _onEvent = (event: any) => {
            onEvent(event, eventName);
        }

        const eventEmitter = contract.events[eventName]({ fromBlock: 'earliest' });
        eventEmitter.addListener('data', _onEvent);

        return () => {
            eventEmitter.removeListener('data', _onEvent);
        }

    // eslint-disable-next-line
    }, [contract, eventName, account]);
}