// React/src/components/CardDashboard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CardDashboard: React.FC = () => {
  return (
    <Card className="w-full h-full flex flex-col ">
      <CardHeader>
        <CardTitle className="w-full flex justify-center items-center">
          <img
            src="/logo-goofycoins.jpg"
            alt="GoofyCoins Logo"
            className="mt-5 h-24 w-24 rounded-full"
          />
        </CardTitle>
        <CardDescription className="text-base text-center">
          Made with 💜 by the GoofyTeam
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <button className="bg-primary text-background rounded-lg px-4 py-2 font-bold hover:scale-110 transition-all">
          <a
            href="https://github.com/GoofyComponent"
            target="_blank"
            rel="noreferrer"
          >
            GoofyTeam
          </a>
        </button>
      </CardContent>
    </Card>
  );
};

export default CardDashboard;
