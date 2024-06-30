import { cleanEnv } from "envalid";
import { json, port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    MONGO_URI: str(),
    PORT: port(),
    SESSION_SECRET: str(),
    STRIPE_KEY: str(),
    CLIENT_URL: str(),
    SERVICE_ACCOUNT: json(),
    EMAIL_HOST: str(),
    EMAIL_USER: str(),
    EMAIL_PASS: str(),
})