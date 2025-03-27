//function for error handling
function errorHandler(err, req, res, next) {
    //get error name and message
    if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const errors = err.errors.map(e => e.message);
        res.status(400).json({message: errors});
    }
    if(err.name === 'Unauthorized') {
        res.status(401).json({message: err.message});
    }
    if(err.name === 'Not Found' || err.name === 'NotFound') {
        res.status(404).json({message: err.message});
    }
    if(err.name === 'Forbidden') {
        res.status(403).json({message: err.message});
    }
    if(err.name === 'Bad Request' || err.name === 'BadRequest') {
        res.status(400).json({message: err.message});
    }
    else{
        res.status(500).json({message:'Internal Server Error'});
    }
}

module.exports = errorHandler;