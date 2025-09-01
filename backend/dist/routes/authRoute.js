import e from "express";
const router = e.Router();
import { createUser, SigninType } from "../types.js";
import { OpenAIRealtimeWebSocket } from "openai/beta/realtime/websocket.mjs";
import emailjs from "@emailjs/nodejs";
import jwt from "jsonwebtoken";
import base32 from "hi-base32";
import { TOTP } from "totp-generator";
const publick_key = "LCeBX7ixMxLVRpO6K";
const private_key = "V3Ov8_991grxil4p6mvT9";
const service_id = "service_pqjiu8m";
const tempelate_id = "template_qrxdnbs";
emailjs.init({
    publicKey: publick_key,
    privateKey: private_key,
});
async function sendOtpEmail(toEmail, otp) {
    try {
        const response = await emailjs.send(service_id, tempelate_id, {
            email: toEmail,
            message: `your login otp is ${otp}`,
        });
        console.log("otp send to Email :", response.status, response.text);
    }
    catch (err) {
        console.error("Error sending email:", err);
    }
}
const otpStore = new Map();
function setOtp(otp, email) {
    otpStore.set(email, otp);
}
function deleteOpt(email) {
    const o = otpStore.get(email);
    if (o) {
        otpStore.delete(email);
    }
}
router.post("/init_signin", async (req, res) => {
    try {
        const { success, data } = createUser.safeParse(req.body);
        if (!success) {
            res.status(411).json({ message: "invalid email" });
            return;
        }
        const content = "otp sended to your email ";
        const { otp, expires } = TOTP.generate(base32.encode(data.email + process.env.JWT_SECRET));
        setOtp(otp, data.email);
        setTimeout(() => {
            deleteOpt(data.email);
        }, 60000);
        await sendOtpEmail(data.email, otp);
        res.status(200).json({ message: "email sended successfully" });
        return;
    }
    catch (e) {
        console.log("error in init singin", e);
        res.status(500).json({ message: "Internal server Error" });
        return;
    }
});
router.post("/signin", async (req, res) => {
    try {
        const { success, data } = SigninType.safeParse(req.body);
        if (!success) {
            res.status(411).json({ message: "invalid email" });
            return;
        }
        console.log(data.otp, otpStore);
        if (data.otp != otpStore.get(data.email)) {
            res.status(401).json({ message: "invalid otp" });
            return;
        }
        const token = jwt.sign({ userId: data.email }, process.env.JWT_SECRET);
        res.status(200).json({ message: "signin success", token });
    }
    catch (e) {
        console.log("error in init singin", e);
        res.status(500).json({ message: "Internal server Error" });
        return;
    }
});
export default router;
//# sourceMappingURL=authRoute.js.map