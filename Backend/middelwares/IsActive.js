
module.exports = function isActive(req, res, next) {
    try{
        if(!req.user.active){ 
            return res.status(Constants.STATUSCODE.FORBIDDEN).json(
                JSend.fail({ message: "Access denied, deactivated User" })
            );
        }
        next();
    }catch(err){
        next(err);
    }
}