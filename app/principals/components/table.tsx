/* This example requires Tailwind CSS v2.0+ */
'use client'
import DeleteModel from './deleteModel'
import {useEffect, useState} from "react";

import {generateClient, SelectionSet} from 'aws-amplify/data';
import {list, getUrl} from 'aws-amplify/storage';
import {type Schema} from '@/amplify/data/resource';
import ImageURL from '../../nun.jpeg'
import {SearchIcon} from "@heroicons/react/solid";
import Pagination from "@/app/componets/pagination";
// import { Pagination } from '@aws-amplify/ui-react';

const people: any = [
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
    const [searchByName, setSearchByName] = useState<any>('');
    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);

    // const selectionSet = ['principal.*'] as const;
    // // type PrincipalWithTenures  = SelectionSet<Schema["Principal"], typeof selectionSet>;


    const profile_url = 'https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png'
    const [principals, setPrincipals] = useState<Schema['Principal'][]>([]);
    const [previousToken, setPreviousToken] = useState('');
    const [nextTokenValue, setNextToken] = useState('');
    const [pageTokens, setPageTokens] = useState([null]);

    async function listPrincipals() {
        try {
            // const response:any = []
            // @ts-ignore
            const {data: items, nextToken, errors} = await client.models.Principal.list();
            setNextToken(nextToken ?? "")
            await setProfileImage(items);
            setPrincipals(items);
        } catch (error) {
            // Handle errors here
            console.error("Error fetching principals:", error);
        }
    }
    const setProfileImage = async (principals:any)=> {
        return principals.map(async (principal:any)=> {
            if(principal.profile_url) {
                const imageDetails = await getUrl({key:principal.profile_url})
                console.log(imageDetails.url.href, 'image')
                principal.profile_url = imageDetails.url.href
            }
            // console.log(principal, 'principal')
        })
    }


    list().then(data => {
        console.log(data)
    }).catch(err => {
        console.log(err)
    })

    const handleNextPage = async () => {
        if (hasMorePages && currentPageIndex === pageTokens.length) {
            const {data: items, nextToken} = await client.models.Principal.list({
                limit: 1,
                nextToken: pageTokens[pageTokens.length - 1]
            });
            setPrincipals(items);
            if (!nextToken) {
                setHasMorePages(false);
            }

            // @ts-ignore
            setPageTokens([...pageTokens, nextToken]);
        }

        setCurrentPageIndex(currentPageIndex + 1);
    };
    const handleSearchByName = async (event: { target: { value: any; }; }) => {
        const input = event.target.value;
        setSearchByName(input);

        // Perform search when at least 3 letters are typed
        if (input.length >= 3) {
            // Call a function to perform search API request or search logic
            const {data: items, errors} = await client.models.Principal.list(
                {
                    filter: {
                        full_name: {
                            contains: searchByName
                        }

                    }
                }
            );
            // const {data:tenures} = await client.models.Tenure.list();
            // console.log(tenures)
            setPrincipals(items);
            // await performSearch(input);
        } else {
            if (input.length === 0) {
                listPrincipals();
            }
            // Clear the search results or handle empty search query
            // ...
        }
    };


    const onDeletePrincipal = async () => {
        const {data: deleteData, errors} = await client.models.Principal.delete({id: selectedPrincipal})
        await listPrincipals();
        setIsOpenDeleteModel(false)
    }

    useEffect(() => {
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


                        <div className="flex-1 flex items-center justify-center mb-2 lg:ml-6 lg:justify-end">
                            <div className="max-w-lg w-full lg:max-w-xs">
                                <label htmlFor="search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                    </div>
                                    <input
                                        id="search"
                                        name="search"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md
                                        leading-5 bg-white placeholder-gray-500 focus:outline-none
                                         focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-950
                                         focus:border-blue-950 sm:text-sm"
                                        placeholder="Search by full name"
                                        type="search"
                                        value={searchByName}
                                        onChange={handleSearchByName}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Full Name
                                    </th>
                                    {/*<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">*/}
                                    {/*    Appointed date*/}
                                    {/*</th>*/}
                                    <th scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Phone
                                    </th>
                                    {/*<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">*/}
                                    {/*    Left Date*/}
                                    {/*</th>*/}
                                    <th scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
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
                                        {principals.map((principal: any) => (
                                            <tr key={principal.email}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <img className="h-10 w-10 rounded-full"
                                                                 src={principal.profile_url && principal.profile_url !== "" ? principal.profile_url : profile_url} alt=""/>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div
                                                                className="font-medium text-gray-900">{principal.full_name ?? "Null"}</div>
                                                            <div
                                                                className="text-gray-500">{principal.email ?? "Null"}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div
                                                        className="text-gray-900">{principal.phone ? principal.phone : 'Null'}</div>
                                                </td>
                                                {/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">*/}
                                                {/*    <div className="text-gray-900">{principal.appointed_date ?? "Null"}</div>*/}
                                                {/*</td>*/}
                                                {/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">*/}
                                                {/*    <div className="text-gray-900">{principal.appointed_date ?? "Null"}</div>*/}
                                                {/*</td>*/}
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={principal.is_active ?
                                                        'inline-flex rounded-full bg-green-100 px-2 ' +
                                                        'text-xs font-semibold leading-5 text-green-800' : 'inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800'}>
                                                      {principal.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                                    <a href={`/principals/${principal.id}/edit`}
                                                       className="text-blue-950 hover:text-blue-900">
                                                        Edit
                                                        <span className="sr-only">, {principal.name}</span>
                                                    </a>
                                                    <button type="button" className="text-red-600 hover:text-red-900"
                                                            onClick={(value) => {
                                                                setIsOpenDeleteModel(true);
                                                                setSelectedPrincipal(principal.id)
                                                            }}>
                                                        Delete
                                                        <span className="sr-only">, {principal.name}</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {/*<tr>*/}
                                        {/*    <td className="whitespace-nowrap py-4 pl-4 pr-3  sm:pl-6 text-center text-gray-500 text-md">*/}
                                        {/*        <Pagination/>*/}
                                        {/*    </td>*/}
                                        {/*</tr>*/}
                                    </>
                                    :
                                    <tr>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3  sm:pl-6 text-center text-gray-500 text-md"
                                            colSpan={5}>No data available in table
                                        </td>
                                    </tr>
                                }
                                </tbody>
                            </table>
                            {/*<div className=" bg-white">*/}
                            {/*    <Pagination*/}
                            {/*        currentPage={currentPageIndex}*/}
                            {/*        totalPages={pageTokens.length}*/}
                            {/*        hasMorePages={hasMorePages}*/}
                            {/*        onNext={handleNextPage}*/}
                            {/*        onPrevious={() => setCurrentPageIndex(currentPageIndex - 1)}*/}
                            {/*        onChange={(pageIndex: any) => setCurrentPageIndex(pageIndex)}*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
