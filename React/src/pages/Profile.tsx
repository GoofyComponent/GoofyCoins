import { API } from "@/services/api";
import { useEffect, useState } from "react";


// WIP
const Profile = () => {
	const [user, setUser] = useState({ email: "", name: "", wallet: "" });

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await API.get("/user/profile");
				setUser(response.data);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};
		fetchUserData();
	}, []);

    return (
			<div className="px-8 w-1/2">
				<h1 className="text-2xl font-bold mb-4">Profile</h1>
				<p><strong>Email:</strong> {user.email}</p>
				<p><strong>Name:</strong> {user.name}</p>
				<p><strong>Wallet:</strong> {user.wallet}</p>
			</div>
    );
};

export default Profile