"use client";
import { MantineWrapper } from "@/libs/MantineWrapper";
import { $authenStore } from "@/libs/authenStore";
import { Container, Group, Loader, Title } from "@mantine/core";
import axios from "axios";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lab20",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const [isCheckingAuthen, setIsCheckingAuthen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);

  const checkAuthen = async () => {
    const token = localStorage.getItem("token");
    const authenUsername = localStorage.getItem("authenUsername");

    //check within localStorage
    let isTokenValid = true;
    if (!token || !authenUsername) {
      isTokenValid = false;
    } else {
      //check if token still valid
      try {
        const resp = await axios.get("/api/user/checkAuthen", {
          headers: { Authorization: `Bearer ${token}` },
        });
        $authenStore.set({ token, authenUsername });
      } catch (err) {
        console.log(err.message);

        //mark as unauthorized
        isTokenValid = false;
      }
    }

    //go to login if not logged in yet and trying to access protected route
    if (pathname !== "/" && !isTokenValid) {
      startTransition(() => {
        router.push("/");
      });
    } else if (pathname === "/" && isTokenValid) {
      startTransition(() => {
        router.push("/student");
      });
    }
    //go to /student if already logged in

    setIsCheckingAuthen(false);
  };

  useEffect(() => {
    checkAuthen();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineWrapper>
          {/* hide page content with loader */}
          {(isCheckingAuthen || isPending) && (
            <Group position="center">
              <Loader />
            </Group>
          )}

          {!isCheckingAuthen && !isPending && (
            <Container size="sm">
              <Title italic align="center" color="violet" my="xs">
                Course Enrollment
              </Title>
              {children}
            </Container>
          )}
        </MantineWrapper>
      </body>
    </html>
  );
}
