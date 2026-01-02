import jwt from 'jsonwebtoken';

interface User {
    id: string; 
}

interface Tokens {
    accessToken: string;
    refreshToken: string;
}


export default function accessAndRefreshToken(user: User): Tokens {
    
   
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
        throw new Error("JWT Secrets are not defined in environment variables.");
    }

    try {
       
        const accessToken = jwt.sign(
            { id: user.id}, 
            accessSecret, 
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id }, 
            refreshSecret, 
            { expiresIn: "7d" }
        );

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Token generation error:", error);
        throw new Error("Could not generate tokens");
    }
}