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
    }, [account])

    useEffect(() => {
        // console.log("ADD EVENTS", eventNames, contract.events);
        eventNames.forEach((eventName) => {
            contract.events[eventName]({ fromBlock: 0 }).on('data', onEvent);
        })

        return () => {
            console.log("REMOVE EVENTS");
            eventNames.forEach((eventName) => {
                contract.events[eventName]().off('data', onEvent);
            })
        }
    }, [contract, eventNames, account]);

    return events;
}