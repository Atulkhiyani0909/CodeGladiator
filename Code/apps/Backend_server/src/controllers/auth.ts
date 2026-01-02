import type { Request, Response, CookieOptions } from "express";
import prisma from "../DB/db.js";
import bcrypt from "bcryptjs";
import accessAndRefreshToken from "../utils/token.js";
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
});

class Auth {
    signUp = async (req: Request, res: Response) => {
        const validation = signupSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                msg: "Validation Error",
                errors: validation.error.format()
            });
        }

        const { email, password, username } = validation.data;

        try {
            const existingUser = await prisma.user.findUnique({ where: { email } });

            if (existingUser) {
                return res.status(409).json({ msg: "User with this email already exists" });
            }

            const hashed_password = await bcrypt.hash(password, 10);

            const new_user = await prisma.user.create({
                data: {
                    email: email,
                    username: username,
                    password: hashed_password
                }
            });

            const { accessToken, refreshToken } = accessAndRefreshToken(new_user);

            await prisma.user.update({
                where: {
                    id: new_user.id,
                },
                data: {
                    refreshToken: refreshToken
                }
            });

            return res.status(200)
                .cookie("refreshToken", refreshToken, cookieOptions)
                .cookie("accessToken", accessToken, cookieOptions)
                .json({
                    msg: "User SignUP Successfully"
                });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "User SignUp Failed" });
        }
    }

    login = async (req: Request, res: Response) => {
        const validation = loginSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ msg: "Invalid Input" });
        }

        const { email, password } = validation.data;

        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (!user) {
                return res.status(401).json({
                    msg: "Invalid Credentials"
                });
            }

            const password_check = await bcrypt.compare(password, user.password || "");

            if (!password_check) {
                return res.status(401).json({
                    msg: "Invalid Credentials"
                });
            }

            const { accessToken, refreshToken } = accessAndRefreshToken(user);

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    refreshToken: refreshToken
                }
            });

            return res.status(200)
                .cookie("refreshToken", refreshToken, cookieOptions)
                .cookie("accessToken", accessToken, cookieOptions)
                .json({
                    msg: "User Logged In Successfully"
                });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "User Login Failed" });
        }
    }

    currentUser = async (req: Request, res: Response) => {
        const { accessToken } = req.cookies;

        if (!accessToken) {
            return res.status(401).json({ msg: "Not Authenticated" });
        }

        try {
            const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || "") as JwtPayload;

            if (!payload || !payload.id) {
                return res.status(403).json({ msg: "Invalid Token" });
            }

            const user = await prisma.user.findUnique({
                where: { id: payload.id },
                select: { id: true, email: true, username: true }
            });

            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }

            return res.status(200).json(user);

        } catch (error) {
            console.log(error);
            return res.status(403).json({ msg: "Invalid or Expired Token" });
        }
    }
}

export default Auth;