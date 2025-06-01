// src/components/SignupForm.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { navigate } from "wouter/use-browser-location";
import { useRef, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import useSWRMutation from "swr/mutation";

import { User } from "./types";

type CreateUserPayload = { uName: string; pwd: string };
type CreateUserResponse = { id: number; username: string };

/** Mutation hook for POST /users */
function useCreateUser() {
    return useSWRMutation<
        CreateUserResponse,
        Error,
        "/users",
        CreateUserPayload
    >(
        "/users",
        async (_url, { arg: { uName, pwd } }) => { //have to pass in default first _url argument
            const res = await axios.post<CreateUserResponse>(
                "http://localhost:5000/users/",
                { username: uName, password: pwd }
            );
            return res.data;
        }
    );
}

function Signup() {
    const formRef = useRef<HTMLFormElement>(null);

    // input state
    const [uName, setUName] = useState("");
    const [pwd, setPwd] = useState("");
    const [check, setCheck] = useState("");
    const [errMsg, setErrMsg] = useState("");

    // only fetch when we set this
    const [submittedName, setSubmittedName] = useState<string | null>(null);

    const { data: user, error, isValidating: isLoading, mutate } = useSWR<User>(
        submittedName ? `/users/${submittedName}` : null,
        // uses your global fetcher from App.tsx
        { revalidateOnFocus: false, revalidateOnReconnect: false }
    );

    const { trigger: createUser, isMutating } = useCreateUser();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrMsg("");

        // 1) client-side form validity
        const form = formRef.current;
        if (form && !form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // 2) confirm passwords match
        if (pwd !== check) {
            setErrMsg("Make sure you correctly confirm your password");
            return;
        }

        // 3) trigger the GET /users/<uName> once
        setSubmittedName(uName);
        // wait for SWR to fetch
        const existing = await mutate();

        if (existing) {
            setErrMsg("User with that username already exists");
            return;
        }

        // 4) create the new user
        try {
            await createUser({ uName, pwd });
        } catch (e: any) {
            setErrMsg(e.message || "Signup failed");
            return;
        }

        // 5) clear form & go home
        setUName("");
        setPwd("");
        setCheck("");
        setErrMsg("");
        navigate("/home");
    }

    return (
        <div className={cn("flex flex-col gap-6")} >
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    {errMsg && (
                        <CardDescription className="text-red-600">
                            {errMsg}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    <form ref={formRef} onSubmit={handleSubmit} noValidate>
                        <div className="flex flex-col gap-6">
                            {/* Username */}
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={uName}
                                    onChange={(e) => setUName(e.target.value)}
                                    required
                                    minLength={3}
                                />
                            </div>

                            {/* Password & Confirm */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    required
                                    minLength={6}
                                />

                                <Label htmlFor="confirm">Confirm Password</Label>
                                <Input
                                    id="confirm"
                                    type="password"
                                    value={check}
                                    onChange={(e) => setCheck(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading || isMutating}
                            >
                                {isLoading || isMutating ? "Processing…" : "Sign Up"}
                            </Button>

                            {/* Optional OAuth */}
                            <Button variant="outline" className="w-full">
                                Sign up with Google
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function SignupPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Signup />
            </div>
        </div>
    )
}