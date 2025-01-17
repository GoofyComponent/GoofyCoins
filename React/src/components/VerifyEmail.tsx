import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VerifyEmail: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)] w-full">
      <Card className="w-[350px] -mt-[60px]">
        <CardHeader>
          <CardTitle>Email adress not verified</CardTitle>
          <CardDescription>
            Please verify your email address to access this feature.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex justify-center">
          <Button className="w-full rounded">Resend verification email</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
