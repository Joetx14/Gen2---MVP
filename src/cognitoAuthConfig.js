// OIDC Cognito Auth config for react-oidc-context
// Replace these values with your actual Cognito domain and app client ID
export const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_wWfPcTd2f",
  client_id: "16k4r79a3tppn183d15p5htvf8",
  redirect_uri: "http://localhost:5173/", // Change if your dev port is different
  response_type: "code",
  scope: "openid email profile",
};
