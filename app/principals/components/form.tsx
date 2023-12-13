'use client'
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {DocumentIcon, PlusIcon, TrashIcon} from "@heroicons/react/solid";
import {Switch} from "@headlessui/react";
import {usePathname} from "next/navigation";
import {generateClient} from "aws-amplify/data";
import {Schema} from "@/amplify/data/resource";
import ActivePrincipalWarningModel from './activePrincipalWarningModel'
import {cloneDeep, maxBy} from "lodash";
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles
import DeleteModel from "@/app/principals/components/deleteModel";
import {el} from "date-fns/locale";

function classNames(...classes:any) {
    return classes.filter(Boolean).join(' ')
}


const client = generateClient<any>()
// @ts-ignore
export default function PrincipalForm({onSavePrincipalData, principalData, refreshData}) {
    const [previewImage, setPreviewImage] = useState('https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [isActive, setIsActive] = useState(false);
    const fileInputRef = useRef(null);
    const [isOpenWaringModel, setIsOpenWarningModel] = useState(false);
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false);
    const [activePrincipal, setIsActivePrincipal] = useState<any>();
    const [selectedTenure, setSelectedTenure] = useState<any>();
    const [tenures, setTenures] = useState<any>([{appointed_date: "", left_date: "" }])
    const [addMoreTenure, setAddMoreTenure] = useState(false);

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

    // console.log(pathName, 'kk')
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
        console.log([e.target.name], 'name')
        setPrincipal({ ...principal, [e.target.name]: e.target.value })

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
    }


    const handleIActiveChange= ()=> {
        setIsActive(!isActive)
    }


    const onSubmit = async ()=> {
        // @ts-ignore
        principal.appointed_date = appointedDate.startDate ?? ""
        // @ts-ignore
        principal.left_date = leftDate.startDate ?? ""
        principal.is_active = isActive ?? ""
        if(principal.is_active){
            // @ts-ignore
            const {data:isActivePrincipal} = await client.models.Principal.list({
                filter: {
                    is_active: { eq: true }
                }
            })
            if(isActivePrincipal.length ){
                setIsActivePrincipal(isActivePrincipal[0])
                if( (principalData.id && isActivePrincipal[0].id ? principalData.id != isActivePrincipal[0].id  : true)) {
                    setIsOpenWarningModel(true)
                }else {
                    await onSavePrincipalData(principal)
                }
            }else{
                await onSavePrincipalData(principal)
            }
        }else {
            await onSavePrincipalData(principal)
        }
    }

    const onChangeActivePrincipal = async ()=> {
        console.log(activePrincipal.id, 'ac')
        await client.models.Principal.update({
            id:activePrincipal.id,
            is_active:false
        })
        await onSavePrincipalData(principal)
        setIsOpenWarningModel(false)
    }

    //add new tenure data
    const addNewTenureDetail = async () => {
        const newTenure = { appointed_date: "", left_date: "" };
        const updatedTenures = cloneDeep(tenures);
        updatedTenures.push(newTenure);
        setTenures(updatedTenures);
    }

    //delete tenure data
    const deleteTenureDetail = (index: number) => {
        setSelectedTenure(index)
        setIsOpenDeleteModel(true)
    };

    const handleAppointedDateChange = (index:any, e:any) => {
        const updatedTenures = [...tenures];
        updatedTenures[index] = {
            ...updatedTenures[index],
            appointed_date: e.target.value,
        };
        setTenures(updatedTenures);
    };
    const handleLeftDateChange = (index:any, e:any) => {
        const updatedTenures = [...tenures];
        updatedTenures[index] = {
            ...updatedTenures[index],
            left_date: e.target.value,
        };
        setTenures(updatedTenures);
    };

    const onDeleteTenure = async ()=> {
        const updatedTenures = cloneDeep(tenures);
        if(tenures[selectedTenure]?.id){
            await client.models.Tenure.delete({id:tenures[selectedTenure].id})
        }
        updatedTenures.splice(selectedTenure, 1);
        setTenures(updatedTenures);
        setIsOpenDeleteModel(false)
    }

    const listTenures = async ()=> {
        const { data: tenures } = await principalData.tenures()
        if(tenures.length){
            setTenures(tenures);
        }else {
            setTenures([{appointed_date: "", left_date: "" }])
        }
        const lastTenure = maxBy(tenures, 'appointed_date')
        // @ts-ignore
        setPrincipal({...principal, 'appointed_date': lastTenure.appointed_date ?? ""})
    }

    const onSaveOrUpdateTenureDetails = async (index:any)=> {
        console.log(index)
        const tenureDetails = tenures[index]
         tenureDetails.principalTenuresId = principalData.id;
        if(tenures[index]?.id){
            await client.models.Tenure.update(tenureDetails)
        }else{
            await client.models.Tenure.create(tenureDetails)
        }
        refreshData()
    }

    useEffect(() => {
        if(principalData && principalData.id){
            listTenures()
            setIsActive(principalData.is_active)
            setPrincipal(principalData)
        }
    }, [principalData]);

    // @ts-ignore
    return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-8">
            <ActivePrincipalWarningModel  open={isOpenWaringModel} setOpen={setIsOpenWarningModel} onChangeActivePrincipal={()=> onChangeActivePrincipal()}/>
            <DeleteModel
                open={isOpenDeleteModel}
                setOpen={setIsOpenDeleteModel}
                onDelete={onDeleteTenure}
                message="Are you want to delete this tenure details? This action cannot be undone."
                heading="Delete Tenure details"
            />
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className=" md:col-span-3">
                        <div className="flex justify-between">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Details</h3>
                            {!principalData?.id ?
                                <div>
                                    <div className=" flex">
                                        <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mr-4">
                                            Add more tenure
                                        </label>
                                        <Switch
                                            checked={addMoreTenure}
                                            onChange={setAddMoreTenure}
                                            className={classNames(
                                                addMoreTenure ? 'bg-blue-950' : 'bg-gray-200',
                                                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent ' +
                                                'rounded-full cursor-pointer transition-colors ease-in-out duration-200' +
                                                ' focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-950'
                                            )}
                                        >
                                            <span className="sr-only">add more tenure</span>
                                            <span
                                                aria-hidden="true"
                                                className={classNames(
                                                    addMoreTenure ? 'translate-x-5' : 'translate-x-0',
                                                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ' +
                                                    'transform ring-0 transition ease-in-out duration-200'
                                                )}
                                            />
                                        </Switch>
                                    </div>
                            </div>: null}
                        </div>
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
                                        type="email"
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
                                    <input
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full
                                                         shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        id="appointed_date"
                                        name="appointed_date"
                                        type="date"
                                        value={appointed_date}
                                        min="1900-01-01"
                                        onChange={onChange}
                                    />
                                    {/*<Datepicker*/}
                                    {/*    value={appointedDate}*/}
                                    {/*    useRange={false}*/}
                                    {/*    onChange={(value:any)=> setAppointedDate(value)}*/}
                                    {/*    asSingle={true}*/}

                                    {/*/>*/}
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="left_date" className="block text-sm mb-1 font-medium text-gray-700">
                                        Left Date
                                    </label>
                                    <div className="w-full">
                                        <input
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full
                                                         shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            id="left_date"
                                            name="left_date"
                                            type="date"
                                            value={left_date}
                                            min="1900-01-01"
                                            onChange={onChange}
                                            disabled={isActive}
                                        />
                                        {/*<Datepicker*/}
                                        {/*    disabled={isActive}*/}
                                        {/*    asSingle={true}*/}
                                        {/*    useRange={false}*/}
                                        {/*    value={leftDate}*/}
                                        {/*    onChange={(value:any)=> setLeftDate(value)}*/}
                                        {/*/>*/}
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
                    onClick={()=> onSubmit()}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm
                    font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-blue-900"
                >
                    <DocumentIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    {pathName === '/principals/create' ? 'Save' : 'Update'}
                </button>
            </div>

            {(principalData?.id || addMoreTenure) && tenures.length ?
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-3">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Tenure Details</h3>
                            <div className="border-b border-gray-200 mt-2">
                            </div>
                        </div>
                        <div className="md:col-span-1">
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <div>
                                {tenures.map((item:any, index:number) => (
                                    <div key={index} className="grid grid-cols-6 gap-6 mb-6">
                                        <div className="col-span-6 sm:col-span-2">
                                            <label htmlFor="appointed_date" className="block text-sm mb-1 font-medium text-gray-700">
                                                Appointed Date
                                            </label>
                                            <div className="w-full ">
                                                <input
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full
                                                          shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    id={`appointed_date_${index}`}
                                                    type="date"
                                                    value={item.appointed_date}
                                                    min="1900-01-01"
                                                    max="3000-12-31"
                                                    onChange={(e:any) => handleAppointedDateChange(index, e)}
                                                />
                                                {/*<Datepicker*/}
                                                {/*    value={appointedDate}*/}
                                                {/*    useRange={false}*/}
                                                {/*    onChange={(value:any)=> setAppointedDate(value)}*/}
                                                {/*    asSingle={true}*/}

                                                {/*/>*/}
                                            </div>
                                        </div>
                                        <div className="col-span-6 sm:col-span-2">
                                            <label htmlFor="left_date" className="block text-sm mb-1 font-medium text-gray-700">
                                                Left Date
                                            </label>
                                            <div className="w-full ">
                                                <input
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full
                                                         shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    id={`left_date_${index}`}
                                                    type="date"
                                                    value={item.left_date}
                                                    min="1900-01-01"
                                                    onChange={(e:any) => handleLeftDateChange(index, e)}
                                                />
                                                {/*<Datepicker*/}
                                                {/*    disabled={isActive}*/}
                                                {/*    asSingle={true}*/}
                                                {/*    useRange={false}*/}
                                                {/*    value={leftDate}*/}
                                                {/*    onChange={(value:any)=> setLeftDate(value)}*/}
                                                {/*/>*/}
                                            </div>

                                        </div>
                                        <div className="col-span-6 sm:col-span-2">

                                            <button
                                                type="button"
                                                onClick={()=> addNewTenureDetail()}
                                                className="ml-3 mt-6 inline-flex justify-center py-2 px-3 border shadow-sm text-sm
                                                font-medium rounded-md text-blue-950 hover:text-blue-900  border-blue-950
                                                focus:outline-none focus:ring-2 transition duration-300 transform hover:scale-110
                                                focus:ring-offset-2 focus:ring-blue-900"
                                            >
                                                <PlusIcon className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={()=> deleteTenureDetail(index)}
                                                className="ml-3 mt-6 inline-flex justify-center py-2 px-3 border shadow-sm text-sm
                                                font-medium rounded-md text-red-600 hover:text-red-700  border-red-600
                                                focus:outline-none focus:ring-2 transition duration-300 transform hover:scale-110
                                                focus:ring-offset-2 focus:ring-red-700"
                                            >
                                                <TrashIcon className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={()=> onSaveOrUpdateTenureDetails(index)}
                                                className="ml-3 mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm
                                                font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2
                                                focus:ring-offset-2 focus:ring-blue-900"
                                            >
                                                <DocumentIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                                                {!item.id ? 'Save' : 'Update'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                : null}
        </div>
    )
}
