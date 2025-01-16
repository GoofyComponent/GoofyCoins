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
  username: string;
}

const Profile = () => {
  const form = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    try {
      const response = await API.post("/user/store_address_wallet", {
        address_wallet: data.username,
      });

      console.log(response.data.message);
      alert("Etherscan API wallet saved successfully!");
    } catch (error) {
      console.error("An error occurred while saving the wallet.");
    }
  };

  return (
    <div className="px-8 w-1/2">
      <FormProvider {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default Profile;
