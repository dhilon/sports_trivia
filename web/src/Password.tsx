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
import { useState } from "react"

function Password({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    const [pwd, setPwd] = useState('');
    const [check, setCheck] = useState('');
    const [errMsg, setErrMsg] = useState('');


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            if (pwd !== check) {
                setErrMsg("Make sure you correctly confirm your password")
            }
            else {
                navigate("/home");
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
                    <CardTitle className="text-2xl">New Password</CardTitle>
                    <CardDescription className="text-red-600">
                        {errMsg}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
                                <div className="flex items-center">
                                    <Label htmlFor="password">Confirm Password</Label>
                                </div>
                                <Input id="password" type="password" value={check} onChange={(e) => setCheck(e.target.value)} required />
                            </div>
                            <Button type="submit" className="w-full">
                                Continue
                            </Button>
                            <Button variant="outline" className="w-full">
                                Use Google
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function PasswordPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Password />
            </div>
        </div>
    )
}
