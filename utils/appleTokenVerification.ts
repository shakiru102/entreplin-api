import jwt from 'jsonwebtoken'

export const appleTokenVerification = (token: string) => {
    try {
        const decodedToken: any = jwt.decode(token);

        if (decodedToken?.aud != 'com.entreplin')
            throw new Error('Invalid Token ,Please verify again');
        // Now you have the verified token, which contains user information
        return decodedToken;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

