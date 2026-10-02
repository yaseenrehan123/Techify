import { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { generateFromEmail } from "unique-username-generator";
import { headers } from "next/headers";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return Response.json({
            success: false,
            message: "Only POST request is allowed",
        }, { status: 400 })
    }
    try {
        const webhookSecret: string | undefined = process.env.WEBHOOK_CLERK_SECRET;
        if (!webhookSecret) {
            console.error("WEBHOOK SECRET NULL");
            return Response.json({
                success: false,
                message: "Webhook Secret Null",
                //status: 400
            }, { status: 400 });
        }
        const headerPayload = await headers();
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");

        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.log("SVIX HEADERS MISSING: ",
                `
                svix_id: ${svix_id}
                svix_timestamp: ${svix_timestamp}
                svix_signature: ${svix_signature}
                `)
            return Response.json({
                success: false,
                message: "Svix Headers Missing",
                // status: 400
            }, { status: 400 });
        }
        //const payload = await req.json()
        //const body = JSON.stringify(payload)
        //const body = await req.text();
        //const wh: Webhook = new Webhook(webhookSecret);

        //console.log("PAYLOAD: ", payload);
        //console.log("BODY:", body);
        let evt: WebhookEvent;
        /*try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as unknown as WebhookEvent;
        } catch (err) {
            console.error("Error verifying webhook signature:", err);
            return Response.json(
                { success: false, message: "Invalid signature" },
                { status: 400 }
            );
        }*/
        try {
            evt = await verifyWebhook(req, {
                signingSecret: process.env.WEBHOOK_CLERK_SECRET
            });
            console.log("evt: ", evt);
        }
        catch (err) {

            console.error("Webhook verification failed:", (err as Error).message);
            return Response.json(
                { success: false, message: "Invalid webhook signature" },
                { status: 400 }
            );
        }

        const { type, data } = evt;

        console.log("CLERK EVENT TYPE:", type)
        //console.log("CLERK DATA:", data);
        console.log("CLERK REQUEST RECEIVED!");

        const existingUser = await prisma.user.findUnique({
            where: { clerkId: data.id }
        });
        if (existingUser) {
            console.error("A USER ALREADY EXISTS!", existingUser);
            return Response.json({
                success: false,
                message: "Account already exists!",
                //status: 400
            }, { status: 400 })
        }
        if (type === "user.created") {
            /* const email = data.email_addresses?.[0]?.email_address ?? "";
             const username = data.username ?? generateFromEmail(email,
                 { randomDigits: 4 }
             );*/
            // 1. Primary Email check, fallback to external_accounts (GitHub profile)
            const primaryEmail = data.email_addresses?.[0]?.email_address;
            const githubAccount = data.external_accounts?.[0];

            let email = primaryEmail;
            if (!email || email.includes("placeholder.com")) {
                email = githubAccount?.email_address ?? "";
            }

            // 2. Obtain realistic username (GitHub handle -> Clerk username -> Name fallback -> Generated)
            const rawUsername =
                data.username ||
                githubAccount?.username ||
                (data.first_name ? `${data.first_name}${data.last_name ?? ""}` : null);

            const username =
                rawUsername ||
                (email ? generateFromEmail(email, { randomDigits: 4 }) : `user_${data.id.slice(-6)}`);

            const newUser = await prisma.user.create({
                data: {
                    clerkId: data.id!,
                    username: username,
                    email: email
                }
            });
            console.log("NEW USER:", newUser)
        }


        return Response.json({
            success: true,
            message: "Success",
            //status: 200
        }, { status: 200 })
        console.log("Success!")
    }
    catch (err) {
        console.error("WEBHOOK CLERK ERROR:", (err as Error).message)
        return Response.json({
            success: false,
            message: (err as Error).message,
            //status: 500
        }, { status: 500 })
    }
}