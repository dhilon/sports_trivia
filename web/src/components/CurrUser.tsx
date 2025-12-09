// src/hooks/useUser.ts
import useSWR from "swr";

export interface User {
    id: number;
    username: string;
    scores: { [key: string]: number };
    friends: User[];
    created_at: string;
    google_sub?: string;
    email?: string;
    profile_picture?: string;
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
        user: data,
        isLoading: isValidating,
        isError: !!error,
        errorMessage: error?.response?.data?.error || "",
        refresh: () => mutate(),          // manually re-fetch
        clearUser: () => mutate(undefined, false),  // clear cache without revalidating
    };
}
