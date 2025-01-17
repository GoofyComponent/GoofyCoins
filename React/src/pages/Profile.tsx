import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="flex m-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Wallet:</strong> {user?.address_wallet}
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/settings">
              <Button>Profile Settings</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Profile;
