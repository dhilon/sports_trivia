/**
 * Formats a date to show relative time if within a week, otherwise shows formatted date
 * @param dateString - ISO date string or date string or any parseable date format
 * @returns Formatted date string
 */
export function formatRelativeDate(dateString: string | null | undefined): string {
    if (!dateString) {
        return "Unknown date";
    }

    // Try to parse the date - handle various formats
    let date: Date;
    try {
        let normalizedDateString = dateString.toString().trim();

        // Check if it's the RFC format with GMT (e.g., "Sat, 08 Nov 2025 00:09:50 GMT")
        // Backend incorrectly labels local time as GMT, so we need to parse it as local time
        const rfcMatch = normalizedDateString.match(/^[A-Za-z]{3}, (\d{2}) ([A-Za-z]{3}) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT$/);
        if (rfcMatch) {
            const [, day, monthStr, year, hour, minute, second] = rfcMatch;
            const monthMap: { [key: string]: number } = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
            };
            // Parse as LOCAL time (ignore the GMT label, it's incorrect)
            date = new Date(
                parseInt(year),
                monthMap[monthStr],
                parseInt(day),
                parseInt(hour),
                parseInt(minute),
                parseInt(second)
            );
        }
        // If it looks like Python datetime format (YYYY-MM-DD HH:MM:SS)
        else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(normalizedDateString)) {
            // Remove microseconds first (everything after the last period)
            const parts = normalizedDateString.split('.');
            if (parts.length > 1) {
                normalizedDateString = parts[0];
            }

            // Manually parse as local time (backend stores in local timezone)
            const match = normalizedDateString.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
            if (match) {
                const [, year, month, day, hour, minute, second] = match;
                // Parse as local time using Date constructor
                // Note: month is 0-indexed in Date constructor
                date = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day),
                    parseInt(hour),
                    parseInt(minute),
                    parseInt(second)
                );
            } else {
                date = new Date(normalizedDateString);
            }
        } else {
            // For other formats, parse normally
            date = new Date(normalizedDateString);
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.error('Invalid date parsed:', dateString);
            return "Invalid date";
        }

        // Debug log
    } catch (error) {
        console.error('Date parsing error:', error, dateString);
        return "Invalid date";
    }

    // Get current time
    const now = new Date();


    // Calculate difference in milliseconds
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);


    // If within a week (7 days) and not in the future
    if (diffDays < 7 && diffMs >= 0) {
        if (diffSeconds < 60) {
            return "just now";
        } else if (diffMinutes < 60) {
            return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        } else {
            return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        }
    }

    // Otherwise format as normal date
    try {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (error) {
        return dateString.toString();
    }
}

