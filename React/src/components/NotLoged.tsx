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
          <CardTitle>User not logged</CardTitle>
          <CardDescription>
            Please login to access this feature.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login">
            <Button className="w-full rounded">Login</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotLogged;
