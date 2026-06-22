export const msalConfig = {
  auth: {
    clientId: "97fadfc8-200e-42d9-b112-787b091a432c",
    authority: "https://login.microsoftonline.com/0d2c1116-d7c2-4380-b446-78e71d8f2465",
    redirectUri: "/",
  }
};

export const loginRequest = {
  scopes: ["openid", "profile", "email", "offline_access", "User.Read"]
};
