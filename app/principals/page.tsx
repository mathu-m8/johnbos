import PrincipalsTable from "./components/table";
import Link from "next/link";
import {PlusIcon} from "@heroicons/react/solid";

export default function PrincipalsIndex() {
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
                         href="/principals/create"
                         className="inline-flex items-center justify-center rounded-md border border-transparent
                             bg-blue-950 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-900
                             focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 sm:w-auto"
                     >
                         <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                         Add Principal
                     </Link>
                 </div>
             </div>
             <main>
                 <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                     <div className="px-4  sm:px-0">
                         <PrincipalsTable/>
                     </div>
                 </div>
             </main>
         </div>
     </>
  )
}
