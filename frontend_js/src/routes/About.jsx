import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const About = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exchangeAttempted = useRef(false);

  const handleTokenExchange = async (authCode) => {
    try {
      const apiUrl = import.meta.env.VITE_API_JWTEXCHANGE;
      const body = {
        code: authCode,
        grant_type: "authorization_code",
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           "Origin": "https://kangjiesu.com"
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to retrieve JWT.");
      }

      const data = await res.json();

      // Store all JWT tokens
      sessionStorage.setItem('accessToken', data.tokens.access_token);
      sessionStorage.setItem('idToken', data.tokens.id_token);
      sessionStorage.setItem('refreshToken', data.tokens.refresh_token);

      navigate('/home');
    } catch (err) {
      console.error('Auth error:', err.message);
    }
  };

  useEffect(() => {
    const retrievedCode = searchParams.get("code");
    if (retrievedCode && !exchangeAttempted.current) {
      exchangeAttempted.current = true;
      handleTokenExchange(retrievedCode);
    }
  }, [searchParams, navigate]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">About Page</h1>
      test
    </div>
  );
};

export default About;