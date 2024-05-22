import React from "react";
import GoogleLogin, { CredentialResponse } from "@react-oauth/google";

const clientId = "YOUR_CLIENT_ID.apps.googleusercontent.com";

const GoogleLoginComponent: React.FC = () => {
  const onSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Login Success: currentUser:", credentialResponse);
    // Handle login success, e.g., setting user context, redirecting, etc.
  };

  const onFailure = (error: any) => {
    console.log("Login Failed: res:", error);
    // Handle login failure, e.g., showing an error message
  };

  return (
    <div>
      <h2>React Google Login</h2>
      <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
    </div>
  );
};

export default GoogleLoginComponent;
