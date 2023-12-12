/* This example requires Tailwind CSS v2.0+ */

'use client'

import {Fragment} from 'react'
import Link from "next/link";
import PrincipalForm from "../components/form";
import {ArrowLeftIcon} from "@heroicons/react/solid";
import { generateClient } from 'aws-amplify/data';
import {Schema} from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function PrincipalCreate() {
    const onsubmit = async (principal:['Principal'])=> {
        console.log(principal, 'date')

        // @ts-ignore
        const  { errors, data: newTodo } = await client.models.Principal.create(principal)
        console.log(newTodo, 'create')
    }
    return (
        <>
            <div className="mt-10 p-10 ">
                <div className="flex justify-between px-4 py-8 sm:px-0 lg:px-8">
                    <header>
                        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold leading-tight text-blue-900">Principals</h1>
                        </div>
                    </header>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none lg:px-8">
                        <Link
                            href="/principals"
                            className="inline-flex items-center justify-center rounded-md border border-transparent
                             bg-blue-950 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-900
                             focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 sm:w-auto"
                        >
                            <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />

                            Back to Principals
                        </Link>
                    </div>
                </div>
                <main>
                    <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                        <div className="px-4  sm:px-0">
                            <PrincipalForm onSavePrincipalData={onsubmit}/>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
