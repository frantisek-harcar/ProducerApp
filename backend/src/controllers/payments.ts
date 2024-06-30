import { RequestHandler } from "express";
import { assertIsDefined } from "../util/assertIsDefined";
import createHttpError from "http-errors";
import Stripe from "stripe";
import env from "../util/validateEnv";
import UserModel from "../models/user";
import PaymentItemModel from "../models/paymentItem";
import FileModel from "../models/file";

const stripe = new Stripe(env.STRIPE_KEY, {
    apiVersion: '2022-11-15',
});

interface CheckoutBody {
    paymentItems: [
        {
            id: string,
            name: string,
            price: number,
            type: string,
        }
    ]
}

export const checkout: RequestHandler<unknown, unknown, CheckoutBody, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const paymentItems = req.body.paymentItems


    try {
        assertIsDefined(authenticatedUserId);

        if (!paymentItems) {
            throw createHttpError(400, "No items for payment provided");
        }

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!user) {
            throw createHttpError(400, "User unauthenticated");
        }

        // for (const item of paymentItems) {
        //     if (item.type === "paymentItem") {
        //         await PaymentItemModel.findOneAndUpdate({ _id: item.id }, { isPaid: new Date() }).exec();
        //     }
        //     if (item.type === "file") {
        //         await FileModel.findOneAndUpdate({ _id: item.id }, { isPaid: new Date() }).exec();
        //     }
        // }

        const line_items: [{ id: string, name: string, price: number }] = paymentItems;

        const session = await stripe.checkout.sessions.create({
            line_items: line_items.map(item => {
                return {
                    price_data: {
                        currency: 'czk',
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: 1,
                }
            }),
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${env.CLIENT_URL}/paymentSuccess`,
            cancel_url: `${env.CLIENT_URL}/paymentCancel`
        })

        res.json({ url: session.url })

    } catch (error) {
        next(error)
    }
};

export const fulfilOrder: RequestHandler = async (req, res, next) => {
    // console.log(req.body);
    try {
        const sessionID = req.body.data.object.id;
        
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionID, {
            expand: ['line_items'],
        });
        // console.log("...................................................");
        // console.log(checkoutSession);
        const lineItems = checkoutSession.line_items?.data;
        if(!lineItems){
            throw createHttpError(400, "No items provided");
        }
        // console.log("...................................................");
        // console.log(lineItems)
        for (const item of lineItems) {
                const paymentItem = await PaymentItemModel.findOneAndUpdate({ name: item.description }, { isPaid: new Date() }).exec();
            if (!paymentItem) {
                const fileItem = await FileModel.findOneAndUpdate({ originalName: item.description }, { isPaid: new Date() }).exec();
                if(!fileItem) {
                    throw createHttpError(404, "Item not found");
                }
            }
        }

        res.status(200).json({ message: "Successfully handled" })

    } catch (error) {
        next(error)
    }
};