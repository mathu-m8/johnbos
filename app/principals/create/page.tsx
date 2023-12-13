/* This example requires Tailwind CSS v2.0+ */
'use client'
import Link from "next/link";
import PrincipalForm from "../components/form";
import {ArrowLeftIcon} from "@heroicons/react/solid";
import {generateClient} from 'aws-amplify/data';
import {pick} from "lodash";
import {useRouter} from 'next/navigation'

const client = generateClient<any>();

export default function PrincipalCreate() {

    const router = useRouter()


    const onsubmit = async (data:any)=> {
        if(data.full_name){
            const principalDetails = pick(data, ['full_name', 'email', 'is_active', 'phone', 'message']);
            // @ts-ignore
            const  { errors, data: principal } = await client.models.Principal.create(principalDetails)
            if(principal && principal.id){
                // @ts-ignore
                const  { errors, data: newTenure } = await client.models.Tenure.create(
                    {
                        left_date: data.left_date ?? "",
                        appointed_date: data.appointed_date ?? "",
                        principal
                    }
                )
            }
            router.push('/principals');
        }
    }
    const refreshData = ()=> {
        console.log('refreshData')
    }
    return (
        <>
            <div className="mt-10 p-10 ">
                <div className="flex justify-between px-4 py-8 sm:px-0 lg:px-8">
                    <header>
                        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">

                            <h1 className="text-3xl font-bold leading-tight text-blue-900">Principal Details</h1>
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
                            <PrincipalForm onSavePrincipalData={onsubmit} principalData={[]} refreshData={refreshData}/>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
