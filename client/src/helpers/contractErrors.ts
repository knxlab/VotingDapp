
const ERROR_PREFIX = "Internal JSON-RPC error.";

export default function extractError(e: Error): Error | null {

    if (e.message.substring(0, ERROR_PREFIX.length) !== ERROR_PREFIX) {
        return null;
    }

    try {
        const errorJson = JSON.parse(e.message.substring(ERROR_PREFIX.length));
        if (!errorJson || !errorJson.data) {
            return null;
        }
        const dataKeys = Object.keys(errorJson.data);
        if (dataKeys.length === 0 || !errorJson.data[dataKeys[0]]?.reason) {
            return null;
        }
        const reason = errorJson.data[dataKeys[0]]?.reason;
        const newError = new Error()
        newError.stack = e.stack;
        newError.message = reason;
        return newError;
    } catch (e2: any) {
        return null;
    }
}

export {};