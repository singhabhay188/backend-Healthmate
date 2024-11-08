const prisma = require('../db');

let authenticateToken = async (req,res,next) => {
    const token = req.headers["auth"];
    if(!token) return res.status(401).json({error: 'Unauthorized.'});

    let userId = token.split(' ')[1];

    let user = await prisma.user.findUnique({
        where:{
            id: userId
        }
    });

    if(!user) return res.status(401).json({error: 'Unauthorized.'});

    req.user = user;
    next();
}

module.exports = authenticateToken;