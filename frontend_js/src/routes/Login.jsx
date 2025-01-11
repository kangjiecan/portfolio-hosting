import React from "react";

function Redirector() {
    const handleRedirect = () => {
        const cognitoURL = `${import.meta.env.VITE_COGNITO_DOMAIN}/login?client_id=${import.meta.env.VITE_COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`;
        window.location.href = cognitoURL;
    };

    return (
        <div>
           Please login or use genrated link for visiting
        </div>
    );
}

export default Redirector;