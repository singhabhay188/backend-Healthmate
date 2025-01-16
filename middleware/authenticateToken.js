import prisma from "../db.js";

let authenticateToken = async (req,res,next) => {
    const token = req.headers["auth"];
    if(!token) return res.status(401).json({sucess:false, message: 'Unauthorized Request.'});

    let userId = token.split(' ')[1];

    let user = await prisma.user.findUnique({
        where:{
            id: userId
        }
    });

    if(!user) return res.status(401).json({sucess:false, message: 'Unauthorized Request.'});

    req.user = user;
    next();
}

export default authenticateToken;