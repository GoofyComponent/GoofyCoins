import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { API, DOMAIN } from "@/services/api";
import { LoginForm } from "@/components/login-form";

const Login = () => {
  const { user, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Étape 1 : Récupérer le token CSRF
      await DOMAIN.get("/sanctum/csrf-cookie");

      // Étape 2 : Envoyer les informations de login
      const { data } = await API.post("/login", { email, password });

      // Enregistrer le token dans localStorage
      localStorage.setItem("token", data.access_token);
      login(); // Mettre à jour l'état d'authentification
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <img
                src="/logo-goofycoins.jpg"
                alt="GoofyCoins Logo"
                className="rounded-xl"
              />
            </div>
            GoofyCoins
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Login;
