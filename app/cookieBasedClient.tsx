'use server'
import {generateServerClientUsingCookies} from "@aws-amplify/adapter-nextjs/api";
import {Schema} from "@/amplify/data/resource";
import amplifyConfig from "@/amplifyconfiguration.json";
import {cookies} from "next/headers";

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: amplifyConfig,
    cookies
})