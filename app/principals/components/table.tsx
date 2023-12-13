/* This example requires Tailwind CSS v2.0+ */
'use client'
import DeleteModel from './deleteModel'
import {useEffect, useState} from "react";

import {generateClient, SelectionSet} from 'aws-amplify/data';
import {type Schema} from '@/amplify/data/resource';

const people:any = [
    {
        full_name: 'Lindsay Walton',
        appointed_date: '2000-12-23',
        left_date: '2005-10-23',
        email: 'lindssay.walton@example.com',
        status: 'active',
        profile_url:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        full_name: 'Lindsay Walton',
        appointed_date: '2005-10-24',
        left_date: '2010-10-23',
        email: 'lindsay.walton@example.com',
        status: 'inactive',
        profile_url:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    // More people...
]



const client = generateClient<Schema>();


export default function PrincipalsIndex() {
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false)
    const [selectedPrincipal, setSelectedPrincipal] = useState('')


    // const selectionSet = ['principal.*'] as const;
    // // type PrincipalWithTenures  = SelectionSet<Schema["Principal"], typeof selectionSet>;


    const profile_url = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    const [principals, setPrincipals] = useState<Schema['Principal'][]>([]);

    async function listPrincipals() {
        try {
            // const response:any = []
            // @ts-ignore
            const {data:items, errors} = await client.models.Principal.list();
            // const {data:tenures} = await client.models.Tenure.list();
            // console.log(tenures)
            setPrincipals(items);
            console.log(8);
        } catch (error) {
            // Handle errors here
            console.error("Error fetching principals:", error);
        }
    }


    const onDeletePrincipal = async ()=> {
        const {data:deleteData, errors} = await client.models.Principal.delete({id:selectedPrincipal})
        await listPrincipals();
        setIsOpenDeleteModel(false)
    }

    useEffect( () => {
        listPrincipals()
    }, []);
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className=" flex flex-col">
                <DeleteModel
                    open={isOpenDeleteModel}
                    setOpen={setIsOpenDeleteModel}
                    onDelete={onDeletePrincipal}
                    message="Are you sure you want to delete this principal details? This action cannot be undone."
                    heading=" Delete principal details"
                />
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Full Name
                                    </th>
                                    {/*<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">*/}
                                    {/*    Appointed date*/}
                                    {/*</th>*/}
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Phone
                                    </th>
                                    {/*<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">*/}
                                    {/*    Left Date*/}
                                    {/*</th>*/}
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                {principals.length ?
                                   <>
                                       {principals.map((principal:any) => (
                                           <tr key={principal.email}>
                                               <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                   <div className="flex items-center">
                                                       <div className="h-10 w-10 flex-shrink-0">
                                                           <img className="h-10 w-10 rounded-full" src={principal.profile_url ?? profile_url} alt="" />
                                                       </div>
                                                       <div className="ml-4">
                                                           <div className="font-medium text-gray-900">{principal.full_name ?? "Null"}</div>
                                                           <div className="text-gray-500">{principal.email ?? "Null"}</div>
                                                       </div>
                                                   </div>
                                               </td>
                                               <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                   <div className="text-gray-900">{principal.phone ? principal.phone : 'Null'}</div>
                                               </td>
                                               {/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">*/}
                                               {/*    <div className="text-gray-900">{principal.appointed_date ?? "Null"}</div>*/}
                                               {/*</td>*/}
                                               {/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">*/}
                                               {/*    <div className="text-gray-900">{principal.appointed_date ?? "Null"}</div>*/}
                                               {/*</td>*/}
                                               <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span className={principal.is_active ? 'inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800' : 'inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800'}>
                                  {principal.is_active  ? 'Active' : 'Inactive'}
                                </span>
                                               </td>
                                               <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                                   <a href={`/principals/${principal.id}/edit`} className="text-blue-950 hover:text-blue-900">
                                                       Edit
                                                       <span className="sr-only">, {principal.name}</span>
                                                   </a>
                                                   <button type="button" className="text-red-600 hover:text-red-900"  onClick={(value)=> {
                                                       setIsOpenDeleteModel(true);
                                                       setSelectedPrincipal(principal.id)
                                                   }}>
                                                       Delete
                                                       <span className="sr-only">, {principal.name}</span>
                                                   </button>
                                               </td>
                                           </tr>
                                       ))}
                                   </>
                                :
                                    <tr>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3  sm:pl-6 text-center text-gray-500 text-md" colSpan={5}>No data available in table</td>
                                    </tr>
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
