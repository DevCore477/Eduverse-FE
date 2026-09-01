import perf, { FirebasePerformanceTypes } from "@react-native-firebase/perf";

const perfInstance = perf();

let httpMetric: FirebasePerformanceTypes.HttpMetric | null = null;

export const startScreenTrace = async (screenName: string) => {
    try {
        const trace = perfInstance.newTrace(`screen_${screenName}`);
        await trace.start();
        return trace;
    } catch (error) {
        console.error("Performance trace error:", error);
        return null;
    }
};

export const stopScreenTrace = async (trace: FirebasePerformanceTypes.Trace | null) => {
    try {
        if (trace) {
            await trace.stop();
        }
    } catch (error) {
        console.error("Performance trace stop error:", error);
    }
};

export const startHttpMetric = async (url: string, method: string) => {
    try {
        httpMetric = perfInstance.newHttpMetric(url, method as FirebasePerformanceTypes.HttpMethod);
        await httpMetric.start();
        return httpMetric;
    } catch (error) {
        console.error("HTTP metric error:", error);
        return null;
    }
};

export const stopHttpMetric = async (status: number, responseSize?: number | string) => {
    try {
        if (httpMetric) {
            httpMetric.setHttpResponseCode(status);
            if (responseSize !== undefined && responseSize !== null) {
                const size = Number(responseSize);
                if (!isNaN(size)) {
                    httpMetric.setResponsePayloadSize(size);
                }
            }
            await httpMetric.stop();
            httpMetric = null;
        }
    } catch (error) {
        console.error("HTTP metric stop error:", error);
    }
};

export const logAppStartTime = async () => {
    try {
        const trace = perfInstance.newTrace("app_startup");
        await trace.start();
        await trace.stop();
    } catch (error) {
        console.error("App startup trace error:", error);
    }
};
