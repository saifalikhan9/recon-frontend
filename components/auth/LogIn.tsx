"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import React, { useState } from "react"


type LoginFormState = {
    email: string;
    password: string;
};

export function LogIn() {

    const [data, setData] = useState<LoginFormState>({
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data);
    };
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                    <Link href={"signup"}>
                    
                    <Button variant="link">Sign Up</Button>
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={data.email}
                                onChange={(e) =>
                                    setData((prev) => ({ ...prev, email: e.target.value }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input id="password" type="password" required value={data.password}
                                onChange={(e) =>
                                    setData((prev) => ({ ...prev, password: e.target.value }))
                                } />
                        </div>
                    </div>
                    <CardAction className="my-2 justify-self-center ">
                        <Button type="submit" className="">
                            Login
                        </Button>
                    </CardAction>
                </form>
            </CardContent>

        </Card>
    )
}
