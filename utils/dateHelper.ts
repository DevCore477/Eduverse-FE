export function timeAgo(date: Date | string): string {
    const now = new Date();
    const timeDiff = now.getTime() - new Date(date).getTime();

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return days === 1 ? "1 day ago" : `${days} days ago`;
    }

    if (hours > 0) {
        return hours === 1 ? "1 hr ago" : `${hours} hrs ago`;
    }

    if (minutes > 0) {
        return minutes === 1 ? "1 min ago" : `${minutes} min ago`;
    }

    return seconds < 5 ? "Just now" : `${seconds} sec ago`;
}
