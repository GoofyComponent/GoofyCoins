import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Wallet {
  address_wallet: string;
}
interface Username {
  username: string;
}
interface Email {
  email: string;
}
interface Password {
  old_password: string;
  password: string;
  confirm_password: string;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const emailForm = useForm<Email>({
    defaultValues: {
      email: user?.email,
    },
  });
  const walletForm = useForm<Wallet>({
    defaultValues: {
      address_wallet: user?.address_wallet,
    },
  });
  const usernameForm = useForm<Username>({
    defaultValues: {
      username: user?.name,
    },
  });
  const passwordForm = useForm<Password>();

  const handleUsernameSubmit: SubmitHandler<Username> = async (data) => {
    console.log(data);
    try {
      const response = await API.post("/user/update_username", {
        name: data.username,
      });
      console.log(response.data.message);

      usernameForm.clearErrors();

      toast({
        title: "Success!",
        description: "Username saved successfully",
      });
    } catch (error) {
      usernameForm.setError("username", {
        type: "manual",
        message: "An error occurred while saving the username.",
      });
      console.error("An error occurred while saving the username.");
    }
  };
  const handleWalletSubmit: SubmitHandler<Wallet> = async (data) => {
    console.log(data);
    try {
      const response = await API.post("/user/store_address_wallet", {
        address_wallet: data.address_wallet,
      });
      console.log(response.data.message);

      walletForm.clearErrors();

      toast({
        title: "Success!",
        description: "Wallet address saved successfully",
      });
    } catch (error) {
      console.error("An error occurred while saving the wallet.");
      walletForm.setError("address_wallet", {
        type: "manual",
        message: "An error occurred while saving the wallet.",
      });
    }
  };
  const handleEmailSubmit: SubmitHandler<Email> = async (data) => {
    console.log(data);
    try {
      const response = await API.post("/user/update_email", {
        email: data.email,
      });

      emailForm.clearErrors();

      toast({
        title: "Success!",
        description: "Email saved successfully",
      });
      console.log(response.data.message);
    } catch (error) {
      emailForm.setError("email", {
        type: "manual",
        message: "An error occurred while saving the email.",
      });
      console.error("An error occurred while saving the email.");
    }
  };
  const handlePasswordSubmit: SubmitHandler<Password> = async (data) => {
    try {
      const response = await API.post("/user/update_password", {
        old_password: data.old_password,
        password: data.password,
        password_confirmation: data.confirm_password,
      });

      passwordForm.clearErrors();

      toast({
        title: "Success!",
        description: "Password saved successfully",
      });
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
      const errorMessage =
        (error as any).response.data.message ||
        (error as any).response.data.error;
      passwordForm.setError("old_password", {
        type: "manual",
        message: errorMessage,
      });
      console.error("An error occurred while saving the password.");
    }
  };

  return (
    <div className="px-8 w-1/2 m-8">
      <FormProvider {...walletForm}>
        <form
          className="space-y-4"
          onSubmit={walletForm.handleSubmit(handleWalletSubmit)}
        >
          <FormField
            control={walletForm.control}
            name="address_wallet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Wallet Address"
                    {...field}
                    className="rounded"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </FormProvider>
      <FormProvider {...usernameForm}>
        <form
          className="space-y-4"
          onSubmit={usernameForm.handleSubmit(handleUsernameSubmit)}
        >
          <FormField
            control={usernameForm.control}
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

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </FormProvider>
      <FormProvider {...emailForm}>
        <form
          className="space-y-4"
          onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
        >
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} className="rounded" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </FormProvider>
      <FormProvider {...passwordForm}>
        <form
          className="space-y-4"
          onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
        >
          <FormLabel>Password</FormLabel>
          <FormField
            control={passwordForm.control}
            name="old_password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Old Password"
                    {...field}
                    className="rounded"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="New Password"
                    {...field}
                    className="rounded"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Confirm Password"
                    {...field}
                    className="rounded"
                  />
                </FormControl>
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
