import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";

export const logScreenView = async (screenName: string) => {
    try {
        console.log("📊 Analytics: logScreenView", screenName);
        await analytics().logEvent("screen_view", {
            screen_name: screenName,
        });
    } catch (error) {
        console.error("Analytics error:", error);
    }
};

export const logEvent = async (eventName: string, params?: Record<string, unknown>) => {
    try {
        console.log("📊 Analytics: logEvent", eventName, params);
        await analytics().logEvent(eventName, params);
    } catch (error) {
        console.error("Analytics error:", error);
    }
};

export const logError = (error: Error, context?: string) => {
    try {
        if (context) {
            crashlytics().log(context);
        }
        crashlytics().recordError(error);
    } catch (err) {
        console.error("Crashlytics error:", err);
    }
};

export const setUserId = (userId: string) => {
    try {
        if (!userId || typeof userId !== 'string') {
            return;
        }
        crashlytics().setUserId(userId);
        analytics().setUserId(userId);
    } catch (error) {
        console.error("Firebase setUserId error:", error);
    }
};

export const logLogin = (method: string) => {
    logEvent("login", { method });
};

export const logSignUp = (method: string) => {
    logEvent("sign_up", { method });
};

export const logPurchase = (value: number, currency: string) => {
    logEvent("purchase", { value, currency });
};

export const logLessonStart = (lessonId: string, subjectName: string) => {
    logEvent("lesson_start", { lesson_id: lessonId, subject_name: subjectName });
};

export const logLessonComplete = (lessonId: string, duration: number) => {
    logEvent("lesson_complete", { lesson_id: lessonId, duration });
};
