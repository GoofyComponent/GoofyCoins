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
import { useAuth } from "@/hooks/useAuth";

interface IFormInput {
  username: string;
  address_wallet: string;
  email: string;
}

interface Wallet {
  address_wallet: string;
}
interface Username {
  username: string;
}
interface Email {
  email: string;
}

const Settings = () => {
  const { user } = useAuth();
  const form = useForm<IFormInput>();

  const [addressWallet, setAddressWallet] = useState(user?.address_wallet);
  
  const [validUsernameSubmit, setValidUsernameSubmit] = useState(false);
  const [validWalletSubmit, setWalletValidSubmit] = useState(false);
  const [validEmailSubmit, setEmailValidSubmit] = useState(false);

  const handleUsernameSubmit: SubmitHandler<Username> = async (data) => {
    console.log(data);
    try {
      const response = await API.post("/user/update_username", {
        name: data.username,
      });
      setValidUsernameSubmit(true);
      console.log(response.data.message);
    } catch (error) {
      setValidUsernameSubmit(false);
      console.error("An error occurred while saving the username.");
    }
  };
  const handleWalletSubmit: SubmitHandler<Wallet> = async (data) => {
    console.log(data);
    try {
      const response = await API.post("/user/store_address_wallet", {
        address_wallet: data.address_wallet,
      });
      setWalletValidSubmit(true);
      console.log(response.data.message);
    } catch (error) {
      setWalletValidSubmit(false);
      console.error("An error occurred while saving the wallet.");
    }
  };
  const handleEmailSubmit: SubmitHandler<Email> = async (data) => {
    console.log(data);
    try {
      const response = await API.post("/user/update_email", {
        email: data.email,
      });
      setEmailValidSubmit(true);
      console.log(response.data.message);
    } catch (error) {
      setEmailValidSubmit(false);
      console.error("An error occurred while saving the email.");
    }
  }

  return (
    <div className="px-8 w-1/2 m-8">
      <FormProvider {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleWalletSubmit)}>
          <FormField
            control={form.control}
            name="address_wallet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Wallet Address"
                    {...field}
                    className="rounded"
                    // value={addressWallet}
                    // onChange={(e) => setAddressWallet(e.target.value)}
                  />
                </FormControl>
                {validWalletSubmit && (
                  <FormDescription>
                    Your wallet address has been saved.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleUsernameSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    className="rounded"
                  />
                </FormControl>
                {validUsernameSubmit && (
                  <FormDescription>
                    Your username has been saved.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleEmailSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    className="rounded"
                  />
                </FormControl>
                {validEmailSubmit && (
                  <FormDescription>
                    Your email has been saved.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Settings;
