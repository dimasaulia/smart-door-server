require("dotenv").config;
const jwt = require("jsonwebtoken");
const { resError } = require("../services/error");
const { getToken, getUser } = require("../services/auth");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const loginRequired = (req, res, next) => {
    const token = getToken(req);

    // check if token exits
    if (!token) return res.redirect("/auth/login");

    // verify token
    jwt.verify(token, process.env.SECRET, async (err, decode) => {
        if (!err) {
            // find user
            const user = await prisma.user.findUnique({
                where: {
                    id: decode.id,
                },
                select: {
                    id: true,
                    username: true,
                },
            });
            if (user) return next();

            if (!user) return res.redirect("/auth/login");
        } else {
            return res.redirect("/auth/login");
        }
    });
};

const allowedRole = (...roles) => {
    return async (req, res, next) => {
        const user = await prisma.user.findUnique({
            where: {
                id: getUser(req),
            },
            select: {
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!roles.includes(user.role.name)) {
            if (user.role.name === "ADMIN") return res.redirect("/dashboard");
            if (user.role.name === "USER") return res.redirect("/");
        }

        if (roles.includes(user.role.name)) return next();
    };
};

module.exports = { loginRequired, allowedRole };
