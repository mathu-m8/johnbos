'use client'

import Link from "next/link";
import {useRef, useState} from "react";
import {DocumentIcon} from "@heroicons/react/solid";
import Datepicker from "react-tailwindcss-datepicker";
import {Switch} from "@headlessui/react";
import {usePathname} from "next/navigation";
import {generateClient} from 'aws-amplify/data';

function classNames(...classes:any) {
    return classes.filter(Boolean).join(' ')
}

export default function PrincipalForm() {
    const client = generateClient();
    const [selectedDate, setSelectedDate] = useState(null);

    const [previewImage, setPreviewImage] = useState('data:image/png;base64,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');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [isActive, setIsActive] = useState(false);
    const fileInputRef = useRef(null);


    const handleButtonClick = () => {
        // Simulate click on the hidden file input element
        if (fileInputRef.current) {
            // @ts-ignore
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event:any) => {
        // const file = event.target.files[0];
        // Handle the file selection
        // console.log('Selected file:', file);
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            if(fileReader.result){
                // @ts-ignore
                setPreviewImage(fileReader.result);
            }
        });
        fileReader.readAsDataURL(file);
    };
    // const router = useRouter();
    const pathName = usePathname();

    console.log(pathName, 'kk')
    const [principal, setPrincipal] = useState({
        full_name: "",
        email: "",
        is_active: false,
        phone: "",
        appointed_date: "",
        left_date: "",
        message: "",
    });

    const { full_name, email, is_active, phone, appointed_date, left_date, message } = principal;


    const onChange = (e:any) =>{
        setPrincipal({ ...principal, [e.target.name]: e.target.value })
        console.log(principal, 'principal');

    }


    const [appointedDate, setAppointedDate] = useState({
        startDate: new Date(),
        endDate: null
    });
    const [leftDate, setLeftDate] = useState({
        startDate: new Date(),
        endDate: null
    });


    const handleUploadImage = () => {
        const data = new FormData();
        data.append('files[]', previewImage);
        // console.log(data, 'data')
        // API
    }


    const handleSelectImage = (event:any) => {
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            if(fileReader.result){
                // @ts-ignore
                setPreviewImage(fileReader.result);
            }
        });
        fileReader.readAsDataURL(file);
        // console.log(file, 'file')
    }


    const handleIActiveChange= ()=> {
        setIsActive(!isActive)
        console.log(isActive, 'isActibe')
    }
    const onsubmit = async (event:Event)=> {
        console.log(principal, 'date')

        // const { errors, data: newTodo } = await client.models.Principal.create(principal)
        // const { data: todos, errors }  = await client.models.Principal.list()

        // console.log(data, 'api')
        // event.preventDefault()
        // setIsLoading(true) // Set loading to true when the request starts
        //
        // try {
        //     const formData = new FormData(event.currentTarget)
        //     console.log(formData, 'check')
        //
        //     // router.push('/')
        //
        //     // Handle response if necessary
        //     // ...
        // } catch (error) {
        //     // Handle error if necessary
        //     console.error(error)
        // } finally {
        //     setIsLoading(false) // Set loading to false when the request completes
        // }
    }

    return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-3">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Details</h3>
                        <div className="border-b border-gray-200 mt-2">
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <div className="">
                            <div className="flex justify-center">
                                <div className="">
                                    {
                                        previewImage ?

                                            <div className="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
                                                <img
                                                    src={previewImage}
                                                    alt="preview-image"
                                                    className="w-full h-full object-center object-cover"
                                                />
                                            </div>

                                            // <div className="flex-shrink-0">
                                            //     <img src={previewImage} alt="preview-image"  className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"/>
                                            // </div>
                                            :
                                            null
                                    }
                                    {
                                        uploadedImage ?
                                            <div className="flex-shrink-0">
                                                <img src={uploadedImage} alt="uploaded-image"  className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"/>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </div>
                            <div className="flex justify-center">

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                {/* Custom upload button */}
                                <button
                                    className="mt-4 ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm
                                      font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2
                                      focus:ring-offset-2 focus:ring-blue-900"
                                    onClick={handleButtonClick}
                                >
                                    Upload Image
                                </button>




                                {/*<input type="file" className="hidden" onChange={handleSelectImage}/>*/}
                                {/*<button className="mt-4 ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm*/}
                                {/*      font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2*/}
                                {/*      focus:ring-offset-2 focus:ring-blue-900"*/}
                                {/*        onClick={handleUploadImage}>Upload</button>*/}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form >
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                        Full name
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        id="full_name"
                                        value={full_name}
                                        onChange={onChange}
                                        autoComplete="given-name"
                                        placeholder="enter the full name"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full
                                         shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        required={true}
                                    />
                                </div>


                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        value={email}
                                        onChange={onChange}
                                        autoComplete="email"
                                        placeholder="example@gmail.com"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full
                                        shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className=" col-span-6 sm:col-span-3">
                                    <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mr-4">
                                        Active
                                    </label>
                                    <Switch
                                        checked={isActive}
                                        onChange={handleIActiveChange}
                                        name="is_active"
                                        id="is_active"
                                        className={classNames(
                                            isActive ? 'bg-green-600 focus:ring-green-500' : 'bg-red-600 focus:ring-red-500',
                                            'relative mt-1 inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 '
                                        )}
                                    >
                                        <span className="sr-only">Is Active</span>
                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                isActive ? 'translate-x-5' : 'translate-x-0',
                                                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                            )}
                                        />
                                    </Switch>
                                    {/*<input*/}
                                    {/*    id="is_active"*/}
                                    {/*    aria-describedby="is_active"*/}
                                    {/*    name="is_active"*/}
                                    {/*    value={is_active}*/}
                                    {/*    onChange={onChange}*/}
                                    {/*    type="checkbox"*/}
                                    {/*    className="accent-blue-900 focus:ring-blue-900 h-5 w-5 text-blue-900 border-gray-300 rounded"*/}
                                    {/*/>*/}
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={phone}
                                        onChange={onChange}
                                        id="phone"
                                        autoComplete="given-phone"
                                        placeholder="enter the phone number"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full
                                         shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="appointed_date" className="block text-sm mb-1 font-medium text-gray-700">
                                        Appointed Date
                                    </label>
                                    <Datepicker
                                        value={appointedDate}
                                        useRange={false}
                                        onChange={(value:any)=> setAppointedDate(value)}
                                        asSingle={true}

                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="left_date" className="block text-sm mb-1 font-medium text-gray-700">
                                        Left Date
                                    </label>
                                    <div className="w-full">
                                        <Datepicker
                                            asSingle={true}
                                            useRange={false}
                                            value={leftDate}
                                            onChange={(value:any)=> setLeftDate(value)}
                                        />
                                    </div>

                                </div>
                                <div className="col-span-6 sm:col-span-6">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <textarea
                                        rows={4}
                                        name="message"
                                        value={message}
                                        onChange={onChange}
                                        placeholder="enter the message"
                                        id="message"
                                        className=" mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


            <div className="flex justify-end">
                <Link
                    href="/principals"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium
                    text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </Link>
                <button
                    type="button"
                    onClick={()=> onsubmit}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm
                    font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-blue-900"
                >
                    <DocumentIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    {pathName === '/principals/create' ? 'Save' : 'Update'}
                </button>
            </div>
        </div>
    )
}
