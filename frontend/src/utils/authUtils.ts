export function getTokenPayload(): Record<string, any> | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

export function getUserRole(): string {
    const payload = getTokenPayload();
    if (!payload) return "User";

    // ClaimTypes.Role key in JWT
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? "User";
}

export function isAdmin(): boolean {
    return getUserRole() === "Admin";
}