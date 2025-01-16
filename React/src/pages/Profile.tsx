import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API } from "@/services/api";

interface IFormInput {
  address_wallet: string;
}

const Profile = () => {
  const form = useForm<IFormInput>();
  const [validSubmit, setValidSubmit] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    try {
      const response = await API.post("/user/store_address_wallet", {
        address_wallet: data.address_wallet,
      });
      setValidSubmit(true);
      console.log(response.data.message);
    } catch (error) {
      setValidSubmit(false);
      console.error("An error occurred while saving the wallet.");
    }
  };

  return (
    <div className="px-8 w-1/2">
      <FormProvider {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="address_wallet"
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
                {validSubmit && (
                  <FormDescription>
                    Your wallet address has been saved.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default Profile;
