import jwt, { decode } from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {

        if (!req.headers.authorization) return res.status(401).json({ message: 'Token is Missing' })

        const token = req.headers.authorization.split(" ")[1];
        const decodeData = jwt.verify(token, 'FirstJwtTokenCreation');
        req.userId = decodeData?.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Session Timeout " })
    }
}

export default auth;