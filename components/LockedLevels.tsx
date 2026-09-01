import { Circle, G, Path, Rect, Svg } from "react-native-svg";

export function LockedLevelFrench({ size }: { size: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 60 60">
            <Rect width="60" height="60" fill="#FFD203" rx="4" />
            <G>
                <Path
                    d="M30 22.5C30 20.567 31.567 19 33.5 19H36.5C38.433 19 40 20.567 40 22.5V25H42.5C43.8807 25 45 26.1193 45 27.5V37.5C45 38.8807 43.8807 40 42.5 40H27.5C26.1193 40 25 38.8807 25 37.5V27.5C25 26.1193 26.1193 25 27.5 25H30V22.5C30 20.567 31.567 19 33.5 19H36.5C38.433 19 40 20.567 40 22.5Z"
                    fill="#00AC56"
                    stroke="#00AC56"
                    strokeWidth="1.5"
                />
            </G>
        </Svg>
    )
}

export function LockedLevelEnglish({ size }: { size: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 60 60">
            <Circle cx="30" cy="30" r="28" fill="#FFD203" />
            <G>
                <Path
                    d="M30 22.5C30 20.567 31.567 19 33.5 19H36.5C38.433 19 40 20.567 40 22.5V25H42.5C43.8807 25 45 26.1193 45 27.5V37.5C45 38.8807 43.8807 40 42.5 40H27.5C26.1193 40 25 38.8807 25 37.5V27.5C25 26.1193 26.1193 25 27.5 25H30V22.5C30 20.567 31.567 19 33.5 19H36.5C38.433 19 40 20.567 40 22.5Z"
                    fill="#00AC56"
                    stroke="#00AC56"
                    strokeWidth="1.5"
                />
            </G>
        </Svg>
    )
}

export function LockedLevelMath({ size }: { size: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 60 60">
            <Path
                d="M30 5L35 25L55 30L35 35L30 55L25 35L5 30L25 25L30 5Z"
                fill="#00AC56"
            />
            <G>
                <Path
                    d="M30 26.25C30 25.0074 30.5074 24 31.25 24H33.75C34.4926 24 35 25.0074 35 26.25V27.5H36.25C37.4926 27.5 38.5 28.5074 38.5 29.75V33.75C38.5 34.9926 37.4926 36 36.25 36H31.25C30.0074 36 29 34.9926 29 33.75V29.75C29 28.5074 29.5074 27.5 30.25 27.5H31.5V26.25C31.5 25.0074 32.0074 24 32.75 24H35.25C35.9926 24 36.5 25.0074 36.5 26.25Z"
                    fill="#FFD203"
                    stroke="#FFD203"
                    strokeWidth="0.75"
                />
            </G>
        </Svg>
    )
}
