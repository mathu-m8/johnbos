// 'use server'
// import type {Schema} from '@/amplify/data/resource'
// import {generateServerClientUsingCookies} from '@aws-amplify/adapter-nextjs/api'
// import config from '@/amplifyconfiguration.json';
// import {cookies} from "next/headers";
//
//
// export const publicClient = generateServerClientUsingCookies<Schema>({
//     config,
//     cookies,
//     authMode:'apiKey'
// })
//
//
// // export async function fetchTodos() {
// //     'use client'
// //     return await publicClient.models.Todo.list();
// // }


import { type Schema } from '@/amplify/data/resource';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import amplifyConfig from '@/amplifyconfiguration.json';
import { cookies } from 'next/headers';

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: amplifyConfig,
    cookies
});