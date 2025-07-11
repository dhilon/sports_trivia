import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { navigate } from "wouter/use-browser-location"
import { useRef, useState } from "react"
import useLoginUser from "./components/LoginUser"


function Login({ //need to add a login check for if the user is already logged in, and if so, redirect to the home page
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    const [uName, setUName] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const { trigger: loginUser, isMutating } = useLoginUser();


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrMsg("");
        setIsLoading(true);

        // 1) Client-side validation
        const form = formRef.current;
        if (form && !form.checkValidity()) {
            form.reportValidity();
            setIsLoading(false);
            return;
        }

        // 2) Send credentials to Flask
        try {
            await loginUser({ uName, pwd });
            navigate("/home");
            setUName("");
            setPwd("");
            setErrMsg("")
        } catch (error: any) {
            // 4) On 4xx/5xx, display message
            const serverMsg = error.response?.data?.error;
            setErrMsg(
                serverMsg === "no such user"
                    ? "No user with that username found"
                    : serverMsg === "incorrect password"
                        ? "Incorrect password"
                        : "Login failed"
            );
        } finally {
            setIsLoading(false);
        }



    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription className="text-red-600">
                        {errMsg}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={uName} onChange={(e) => setUName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a className="ml-auto inline-block text-sm underline-offset-4 hover:underline" onClick={() => navigate("/password")}>
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
                            </div>
                            <Button disabled={isLoading} type="submit" className="w-full" >
                                {isLoading || isMutating ? "Processing…" : "Log In"}
                            </Button>
                            <Button variant="outline" className="w-full" >
                                Login with Google
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a className="underline underline-offset-4" onClick={() => navigate("/signup")}>
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center dark gradient-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Login />
            </div>
        </div>
    )
}
