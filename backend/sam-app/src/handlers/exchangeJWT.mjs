import axios from 'axios';

const validateCode = (code) => {
  if (!code || typeof code !== 'string' || code.length < 1) {
    throw new Error('Invalid authorization code format');
  }
};

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://kangjiesu.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Credentials': 'true'
};

const exchangeCodeForTokens = async (code, redirectUri) => {
  console.log('Starting token exchange with params:', {
    tokenEndpoint: process.env.CognitoOAuthTokenEndpoint,
    redirectUri,
    hasCode: !!code,
    hasClientId: !!process.env.COGNITO_CLIENT_ID
  });

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', process.env.COGNITO_CLIENT_ID);
  params.append('code', code);
  params.append('redirect_uri', redirectUri);

  try {
    console.log('Making token exchange request to Cognito');
    const response = await axios.post(
      process.env.CognitoOAuthTokenEndpoint,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    console.log('Token exchange successful');
    return response.data;
  } catch (error) {
    console.error('Token exchange error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      requestParams: {
        grantType: params.get('grant_type'),
        redirectUri: params.get('redirect_uri'),
        hasCode: !!params.get('code'),
        hasClientId: !!params.get('client_id')
      }
    });
    throw new Error(`Failed to exchange authorization code: ${error.response?.data?.error || error.message}`);
  }
};

const getCookieHeaders = (tokens, domain) => {
    const cookieOptions = [
        'HttpOnly',
        'Secure',
        'SameSite=None',
        `Domain=${domain}`,
        'Path=/'
    ];
    const maxAge = 3600;
    cookieOptions.push(`Max-Age=${maxAge}`);
    
    return {
        'Set-Cookie': `accessToken=${tokens.access_token}; ${cookieOptions.join('; ')}`
    };
};

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({})
        };
    }

    try {
        const requestBody = JSON.parse(event.body || '{}');
        console.log('Parsed request body:', requestBody);
        const code = requestBody.code;
        
        try {
            validateCode(code);
        } catch (validationError) {
            console.error('Code validation failed:', validationError.message);
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: validationError.message
                })
            };
        }

        console.log('Code validation passed, proceeding with token exchange');
        const tokens = await exchangeCodeForTokens(code, process.env.REDIRECT_URI);
        const domain = 'execute-api.ca-central-1.amazonaws.com';
        const cookieHeaders = getCookieHeaders(tokens, domain);

        return {
            statusCode: 200,
            headers: {
                ...corsHeaders,
                ...cookieHeaders
            },
            body: JSON.stringify({
                success: true,
                tokens: {
                    access_token: tokens.access_token,
                    id_token: tokens.id_token
                }
            })
        };
    } catch (error) {
        console.error('Lambda execution error:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'Failed to process token exchange',
                details: error.message
            })
        };
    }
};