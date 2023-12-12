'use client'

import {useEffect, useState} from 'react'

import {type Schema} from '@/amplify/data/resource'
import {cookieBasedClient} from "@/app/cookieBasedClient";

// @ts-ignore
// const client = publicClient<Schema>()





export default function Home() {
    const [todos, setTodos] = useState<Schema["Todo"][]>([])

    // const fetchTodos = async () => {
    //     const response = await client.models.Todo?.list()
    //     console.log(response, 'response')
    //     // setTodos(data)
    // }
    //
    //
    // const createTodo = async () => {
    //     await publicClient.models.Todo.create({
    //         content: window.prompt("Todo content?"),
    //     })
    //     console.log(8)
    //    await fetchTodos()
    // }

        // const fetchTodos = async () => {
        //   const response =  await runWithAmplifyServerContext.model.Todo.create({
        //       content:'check'
        //   })
        //     console.log(response, response)
        // }
        //
        // useEffect(() => { fetchTodos() }, [])
    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const response = await fetchTodos();
    //             console.log(response);
    //             // Handle response or set state here
    //         } catch (error) {
    //             console.error('Error fetching todos:', error);
    //         }
    //     }
    //     fetchData();
    // }, []);
    // const  fetchTodos = async () =>{
    //     const response = await cookieBasedClient.models?.Todo?.list()
    //     console.log(response, 'response')
    // }
    // useEffect(() => { fetchTodos() }, [])



    return (
     <>
            <div className="mt-10 p-10 ">
                   <div className="  flex justify-between px-4 py-8 sm:px-0 lg:px-8">
                          <header>
                                 <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                                        <h1 className="text-3xl font-bold leading-tight text-blue-900">Dashboard</h1>
                                 </div>
                          </header>
                   </div>
                   <main>
                          <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                                 <div className="px-4  sm:px-0">
                                        {/*   body*/}
                                     <div>
                                         {/*<button onClick={createTodo}>Add new</button>*/}
                                         {/*{todos}*/}
                                 </div>
                                 </div>
                          </div>
                   </main>
            </div>
     </>
  )
}
