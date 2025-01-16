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
import { Link } from "react-router-dom";

const NotLogged: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)] w-full">
      <Card className="w-[350px] -mt-[60px]">
        <CardHeader>
          <CardTitle>No address wallet</CardTitle>
          <CardDescription>
            Please set your wallet address to access this feature.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/settings">
            <Button className="w-full rounded">Settings</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotLogged;
