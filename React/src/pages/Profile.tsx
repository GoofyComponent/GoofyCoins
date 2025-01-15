import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const form = useForm();

  return (
    <div className="px-8 w-1/2">
      <FormProvider {...form}>
        <form className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etherscan Wallet Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Wallet Address"
                    {...field}
                    className="rounded"
                  />
                </FormControl>
                <FormDescription>
                  This is your etherscan wallet address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default Profile;
