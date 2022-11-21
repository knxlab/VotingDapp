import { useEffect, useState } from "react";

export type EVENT_TYPE = {
    [key: string]: Array<any>
}

export default function useEthEventSubscriber({ contract, eventNames, account }: { contract: any; eventNames: Array<string>; account: string;}) {
    const [events, setEvents] = useState<EVENT_TYPE>({});

    const onEvent = (event: any) => {
        setEvents(events => {
            return {
                ...events,
                [event.event]: [
                    ...(events[event.event] || []),
                    event.returnValues
                ]
            }
        })
    }

    useEffect(() => {

        setEvents({});
        const eventEmitters: Array<any> = [];
        eventNames.forEach((eventName) => {
            eventEmitters.push(contract.events[eventName]({ fromBlock: 0 }));
        })

        eventEmitters.forEach((eventEmitter) => {
            eventEmitter.on('data', onEvent);
        })

        return () => {
            eventEmitters.forEach((eventEmitter) => {
                eventEmitter.off('data', onEvent);
            })
        }
    }, [contract, eventNames, account]);

    return events;
}