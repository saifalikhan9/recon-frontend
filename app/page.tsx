import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Container >
        <div className=" flex flex-col gap-3 items-center ">

          <h1>Intern project</h1>
          <div className="flex gap-x-3">
            <Link href={"/login"}>
              <Button>Login</Button>
            </Link>
            <Link href={"/dashboard"}>
              <Button>Dashboard</Button>
            </Link>
          </div>

        </div>
      </Container>
    </div>
  );
}
