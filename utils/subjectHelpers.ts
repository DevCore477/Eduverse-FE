import { TSubjectKey } from "@/types/subjects";

export type Language = "en" | "fr" | "ar";

export const getSubjectFromName = (name: string): TSubjectKey => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("arabic")) return "arabic";
    if (lowerName.includes("english")) return "english";
    if (lowerName.includes("math")) return "math";
    if (lowerName.includes("science")) return "science";
    if (lowerName.includes("french")) return "french";
    if (lowerName.includes("history")) return "history";
    if (lowerName.includes("geography")) return "geography";
    if (lowerName.includes("civic")) return "civic";
    if (lowerName.includes("islamic")) return "islamic";
    if (lowerName.includes("music")) return "music";

    return "general";
};

export const isLessonNode = (children: any[]) => {
    return children.every(
        (child) => child?.nodeType === 'lesson'
    )
}

export const getLanguageFromSubject = (subjectName: string): Language => {
    const name = subjectName.toLowerCase();

    if (name.includes("french")) return "fr";
    if (name.includes("english")) return "en";

    return "ar";
};

export const isRTLFromLanguage = (lang: Language) => lang === "ar";

export const TRUE_FALSE_LABELS: Record<Language, { true: string; false: string; isRTL: boolean }> = {
    en: {
        true: "True",
        false: "False",
        isRTL: false,
    },
    fr: {
        true: "Vrai",
        false: "Faux",
        isRTL: false,
    },
    ar: {
        true: "صحيح",
        false: "خطأ",
        isRTL: true,
    },
};