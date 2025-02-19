import { BellRing, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaCircleCheck } from "react-icons/fa6";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const notifications = [
  {
    title: "Your call has been confirmed.",
  },
  {
    title: "You have a new message!",
  },
  {
    title: "Your subscription is expiring soon!",
  },
  {
    title: "Your subscription is expiring soon!",
  },
];

export function Pricing({ className, ...props }) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between mb-5 mt-20">
        <div>
          <span className="font-normal text-[#9E9E9E] text-2xl mb-2">
            Pricing Plan
          </span>
          <h1 className="uppercase font-RubikFont font-bold text-5xl">
            join today
          </h1>
        </div>

        <Tabs defaultValue="account" className="w-[400px] flex justify-end">
          <TabsList className="ml-auto shadow-md">
            <TabsTrigger value="account">Monthly</TabsTrigger>
            <TabsTrigger value="password">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className={cn("w-[380px] shadow-md", className)} {...props}>
          <CardHeader>
            <span className="text-[#757575]">Beginner Plan</span>
            <CardTitle className="font-RubikFont text-2xl text-[#424242] font-extrabold">
              $10{" "}
              <span className="text-lg font-semibold font-RubikFont">
                / Month
              </span>
            </CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt{" "}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 mb-6">
            <div className="flex flex-col gap-3">
              {notifications.map((notification, index) => (
                <div key={index} className="mb-1 w-full items-start pb-1">
                  <div className="space-y-1">
                    <p className="text-sm inline-flex items-center gap-2 font-medium leading-none">
                      <FaCircleCheck className="text-[#757575]" />{" "}
                      {notification.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full py-7 rounded-lg font-RubikFont font-bold text-xl">
              Choose Plan
            </Button>
          </CardFooter>
        </Card>
        <Card className={cn("w-[380px] bg-[#212121] shadow-md", className)} {...props}>
          <CardHeader>
            <span className="text-[#FAFAFA] font-RubikFont">Beginner Plan</span>
            <CardTitle className="font-RubikFont text-2xl text-white font-extrabold">
              $10{" "}
              <span className="text-lg font-semibold font-RubikFont">
                / Month
              </span>
            </CardTitle>
            <CardDescription className="text-[#E0E0E0]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt{" "}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 mb-6">
            <div className="flex flex-col gap-3">
              {notifications.map((notification, index) => (
                <div key={index} className="mb-1 w-full items-start pb-1">
                  <div className="space-y-1">
                    <p className="text-sm inline-flex items-center text-[#FAFAFA] gap-2 font-medium leading-none">
                      <FaCircleCheck className="text-[#FAFAFA]" />{" "}
                      {notification.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full py-7 rounded-lg bg-white hover:bg-white/90 text-black font-RubikFont font-bold text-xl">
              Choose Plan
            </Button>
          </CardFooter>
        </Card>
        <Card className={cn("w-[380px] shadow-md", className)} {...props}>
          <CardHeader>
            <span className="text-[#757575]">Beginner Plan</span>
            <CardTitle className="font-RubikFont text-2xl text-[#424242] font-extrabold">
              $10{" "}
              <span className="text-lg font-semibold font-RubikFont">
                / Month
              </span>
            </CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt{" "}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 mb-6">
            <div className="flex flex-col gap-3">
              {notifications.map((notification, index) => (
                <div key={index} className="mb-1 w-full items-start pb-1">
                  <div className="space-y-1">
                    <p className="text-sm inline-flex items-center gap-2 font-medium leading-none">
                      <FaCircleCheck className="text-[#757575]" />{" "}
                      {notification.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full py-7 rounded-lg font-RubikFont font-bold text-xl">
              Choose Plan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
