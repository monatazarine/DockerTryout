const jwt = require('jsonwebtoken');

module.exports = async function isAuthenticated(req, res, next) {
   const token = req.headers['authorization']?.split(' ')[1]
             if (!token) {
             return res.status(401).json({ message: 'Unauthorized' });
             }

    jwt.verify(token, 'secret', (err, user) => {
     if (err) {
         return res.status(403).json({ message: 'Forbidden', error: err });
     }else {
         req.user = user;
         next();
     }
             });
}