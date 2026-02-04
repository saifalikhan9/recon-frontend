"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

type Role = "ADMIN" | "USER";

type SignUpFormState = {
  username: string;
  email: string;
  password: string;
  role: Role;
};

export function SignUp() {
  const [data, setData] = useState<SignUpFormState>({
    username: "",
    email: "",
    password: "",
    role: "USER", // default role
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // This matches your required payload exactly
    console.log({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
        <CardAction>
            <Link href={"/login"}>
          <Button  variant="link">Log In</Button>
            </Link>
        </CardAction>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Username */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                required
                value={data.username}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@test.com"
                required
                value={data.email}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={data.password}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={data.role}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    role: e.target.value as Role,
                  }))
                }
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
