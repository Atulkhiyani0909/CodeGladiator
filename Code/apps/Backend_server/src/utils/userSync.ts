import { error } from 'console';
import prisma from '../DB/db.js';
import { clerkClient } from '@clerk/clerk-sdk-node';

export const getOrCreateUser = async (clerkUserId:string) => {
    try {
       
        const existingUser = await prisma.user.findUnique({
            where: { id: clerkUserId }
        });

        if (existingUser) {
            return existingUser;
        }

        const userDetails = await clerkClient.users.getUser(clerkUserId);
        
        const email = userDetails?.emailAddresses[0]?.emailAddress;
        
        if(!email){
            throw error ;
        }
        const name = `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || "Anonymous";

    
        const newUser = await prisma.user.create({
            data: {
                id: clerkUserId,
                email: email,
                name: name,
            }
        });

        return newUser;

    } catch (error) {
        console.error(" Sync Error:", error);
        throw error;
    }
};