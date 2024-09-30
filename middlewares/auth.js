import jwt from 'jsonwebtoken';

const authenticate = function (req, res, next) {

    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }

    token = token.split(' ')[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

export default authenticate;