// src/hooks/useUser.ts
import useSWR from "swr";

export interface User {
    id: number;
    username: string;
    scores: { [key: string]: number };
    friends: User[];
    created_at: string;
}

export function currUser() {
    // SWR will GET /me once on mount
    const { data, error, isValidating, mutate } = useSWR<User>(
        "http://localhost:5000/me/",
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    return {
        user: data || null,               // null until fetched or 401
        isLoading: isValidating,          // true while SWR hasn't resolved
        isError: !!error,                 // true if SWR got a non-2xx
        errorMessage: error?.response?.data?.error || "",
        refresh: () => mutate(),          // manually re-fetch
        clearUser: () => mutate(undefined, false),  // clear cache without revalidating
    };
}
