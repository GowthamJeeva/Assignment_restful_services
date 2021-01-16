const jwt = require('jsonwebtoken-refresh');
const config = require('./../config/config');
const validateToken = (req, res, next) => {
    logger.debug('Token refreshed');
    try {
    if (req && req.headers && req.headers.Authorization) {
        return new Promise((resolve, reject) => {
            
            jwt.verify(req.headers.Authorization, config.secret, function (err, decoded) {
                if (err) {
                    logger.error('Token not matched');
                    res.status(403);
                    res.send({status: false, message: "Token not matched"});
                    reject(err); 
                } else {
                        let refreshToken = jwt.refresh(decoded,appConstant.expireTime, appConstant.secret);
                    // if everything is good, save to request for use in other routes
                    logger.debug('Token refreshed');
            // resolve({
            //             decoded: decoded,
            //             authToken:refreshToken
            //         });
            next();
                }
            });
        });
    } else {
        res.status(403);
        res.send({status: false, message: "Token not provided"});
    }
} catch(e){
    console.log(e);
}
}

module.exports = {
    validateToken: validateToken
}