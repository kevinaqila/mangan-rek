export function formatMessageTime(date) {
    return new Date(date).toLocaleString("en-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}