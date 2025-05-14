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
import useSWR from "swr"
import { Redirect } from "wouter"
import { useState } from "react"
import { User } from "./types"

function Login({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    const [uName, setUName] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const { data: user, error, isLoading } = useSWR<User>(
        uName ? `/profile/${uName}` : null,
    );

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (error) {
            setErrMsg("No user with that username found")
            return <Redirect to="/login" />
        }
        if (isLoading) return <div>loading...</div>


        const form = event.currentTarget;

        if (form.checkValidity()) {

            if (user?.password === pwd) {
                navigate("/home");
            }
            else {
                setErrMsg("Incorrect password")
            }
        }

        else {
            form.reportValidity();
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
                            <Button type="submit" className="w-full">
                                Login
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
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Login />
            </div>
        </div>
    )
}
