/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { Menu } from '@headlessui/react'
import { MapLineSegment } from '@/interface/map'
import Divider from '@mui/material/Divider'
import { getColorFromValue } from '@/utils/colormap'

import { AccessibilityScoreData } from '@/tests/mock-api/mock-map-api'
import mockAnnotationDetails from '@/data/coachmarks/annotationDetails.json'

const formatDateAndTime = (dateTime: string) => {
    const date = new Date(dateTime)
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }
    return isNaN(date.getTime()) ? '' : date.toLocaleString('en-US', options)
}

import useAnnotationStore from '@/store/annotation'
import useAuthStore from '@/store/auth'

import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import BaseLoader from './BaseLoader'
import { getWeatherData } from '@/utils/weather'

interface PropsInterface {
    setSelectedLineSegment: Dispatch<SetStateAction<MapLineSegment | null>>
    closeAnnotationDetails: () => void
    selectedLineSegment: MapLineSegment
    confirmLocation: () => void
    removeAccessibilityScore: (lineSegment: AccessibilityScoreData) => void
    editAnnotation: (formData: any) => void
}

function AnnotationDetails(props: PropsInterface) {
    const {
        getAnnotations,
        getAccessibilityLabel,
        setSidebarAnnotations,
        sidebarAnnotations,
        deleteAnnotation,
        demoMode,
    } = useAnnotationStore()
    const { user } = useAuthStore()
    const {
        closeAnnotationDetails,
        setSelectedLineSegment,
        selectedLineSegment,
        confirmLocation,
        removeAccessibilityScore,
        editAnnotation,
    } = props

    const [isLoading, setIsLoading] = useState(true)
    const [hasImageLoaded, setHasImageLoaded] = useState(false)
    const [noAnnotation, setNoAnnotation] = useState(false)
    const [annotationDetails, setSelectedLineSegmentAnnotation] =
        useState<any>(null)

    const [currentWeatherData, setCurrentWeatherData] = useState<any>(null)

    const [showManualData, setShowManualData] = useState(true)
    const [showLocationData, setShowLocationData] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    const formData =
        typeof annotationDetails?.form_data === 'string'
            ? JSON.parse(annotationDetails?.form_data || '{}')
            : annotationDetails?.form_data || {}

    const close = () => {
        closeAnnotationDetails()
        setSelectedLineSegment(null)
    }

    const edit = () => {
        editAnnotation(annotationDetails)
        close()
    }

    const deleteSelectedAnnotation = async () => {
        try {
            setIsDeleting(true)
            const newAnnotations = sidebarAnnotations.filter(
                (annotation: { id: any }) =>
                    annotation.id !== annotationDetails.id
            )
            setSidebarAnnotations(newAnnotations)
            await deleteAnnotation(annotationDetails.id)
            removeAccessibilityScore(selectedLineSegment)
            setSelectedLineSegment(null)
        } catch (e) {
            console.error(e)
        } finally {
            setIsDeleting(false)
        }
    }

    useEffect(() => {
        if (demoMode) {
            setIsLoading(false)
            setSelectedLineSegmentAnnotation(
                mockAnnotationDetails.annotationDetails
            )
            setNoAnnotation(false)
            return
        }

        console.log(selectedLineSegment)
        const location__start_coordinates__latitude =
            selectedLineSegment?.start_coordinates.latitude.toString()
        const location__start_coordinates__longitude =
            selectedLineSegment?.start_coordinates.longitude.toString()
        const location__end_coordinates__latitude =
            selectedLineSegment?.end_coordinates.latitude.toString()
        const location__end_coordinates__longitude =
            selectedLineSegment?.end_coordinates.longitude.toString()
        if (
            !location__start_coordinates__latitude ||
            !location__start_coordinates__longitude ||
            !location__end_coordinates__latitude ||
            !location__end_coordinates__longitude
        ) {
            setIsLoading(false)
            return
        }
        const filters = {
            location__start_coordinates__latitude,
            location__start_coordinates__longitude,
            location__end_coordinates__latitude,
            location__end_coordinates__longitude,
        }

        getAnnotations(filters)
            .then((res: any) => {
                if (res.total_count !== 0) {
                    setSelectedLineSegmentAnnotation(res.objects[0])
                    console.log(res.objects[0])
                    setNoAnnotation(false)
                } else {
                    setNoAnnotation(true)
                }
            })
            .catch((err: any) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const formatHazardIndex = (index: number) => {
        if (index == 0 || index == 1) {
            return 'LOW'
        } else if (index == 2) {
            return 'MEDIUM'
        } else if (index == 3) {
            return 'HIGH'
        } else {
            return 'MEDIUM'
        }
    }

    const extractWeather = async () => {
        if (annotationDetails) {
            const latitude = annotationDetails.coordinates.latitude
            const longitude = annotationDetails.coordinates.longitude
            const res = await getWeatherData(latitude, longitude)
            setCurrentWeatherData(res)
        }
    }

    useEffect(() => {
        extractWeather()
    }, [annotationDetails])

    return (
        <div
            id="demo-annotation-details"
            className="absolute z-50 left-0 top-0 h-lvh p-4 w-full sm:w-fit pointer-events-auto"
        >
            <div className="flex flex-col p-3 gap-2 bg-white border border-black rounded-md shadow-2xl h-full w-full sm:w-[470px]">
                {isLoading ? (
                    <>
                        <div className="flex justify-end items-start p-2">
                            <button
                                onClick={close}
                                className="bg-primary rounded-md border-2 border-black
                    duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <Icon
                                    icon="material-symbols:close-rounded"
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>
                        <div className="flex justify-center items-center h-full">
                            <BaseLoader />
                        </div>
                    </>
                ) : !annotationDetails ? (
                    <>
                        <div className="flex justify-end items-start p-2">
                            <button
                                onClick={close}
                                className="bg-primary rounded-md border-2 border-black
                    duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <Icon
                                    icon="material-symbols:close-rounded"
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>
                        <div className="flex justify-center items-center h-full">
                            {!noAnnotation ? (
                                <h1>404 Not found</h1>
                            ) : user !== null ? (
                                <div className="flex flex-col gap-3 items-center">
                                    <h1 className="text-lg font-bold">
                                        No annotations found
                                    </h1>
                                    <button
                                        onClick={confirmLocation}
                                        className="flex gap-3 p-3 items-center rounded-md border-2 border-black bg-primary transition-all duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        <Icon
                                            icon="material-symbols:add-location-outline"
                                            className="w-6 h-6"
                                        />
                                        <p className="font-medium">
                                            Add annotation
                                        </p>
                                    </button>
                                </div>
                            ) : (
                                <h1>No Annotation</h1>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-center p-2">
                            <div className="w-full flex items-center justify-between">
                                <h1 className="font-semibold text-2xl">
                                    {annotationDetails.name}
                                </h1>
                                <Menu
                                    as="div"
                                    className="relative inline-block text-left"
                                >
                                    <Menu.Button className="flex items-center mr-2">
                                        <Icon icon="mdi:dots-horizontal" />
                                    </Menu.Button>
                                    <Menu.Items className="absolute right-0 mt-2 w-[190px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="px-1 py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={edit}
                                                        className={`${
                                                            active
                                                                ? 'bg-slate-100'
                                                                : ''
                                                        } group flex w-full items-center gap-1 rounded-md py-2 px-4 text-sm duration-50`}
                                                    >
                                                        <Icon
                                                            icon="mdi:square-edit-outline"
                                                            className="w-4 h-4"
                                                        />
                                                        Edit
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={
                                                            deleteSelectedAnnotation
                                                        }
                                                        className={`${
                                                            active
                                                                ? 'bg-red-100'
                                                                : ''
                                                        } text-red-600 group flex w-full items-center gap-1 rounded-md py-2 px-4 text-sm duration-50`}
                                                    >
                                                        <Icon
                                                            icon="mdi:trash-can-outline"
                                                            className="w-4 h-4"
                                                        />
                                                        {!isDeleting
                                                            ? 'Delete'
                                                            : 'Deleting...'}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Menu>
                            </div>
                            <button
                                onClick={close}
                                className="bg-primary rounded-md border-2 border-black
                    duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <Icon
                                    icon="material-symbols:close-rounded"
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>

                        <div className="flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar gap-2 grow">
                            <div className="flex flex-col px-3">
                                <p className="text-slate-600 text-sm mb-2">
                                    Nearest Street:{' '}
                                    {annotationDetails.location.adjacent_street}
                                </p>
                                <div className="flex gap-1 flex-wrap justify-between mb-2">
                                    <p className="text-slate-600 text-sm">
                                        By:{' '}
                                        <span className="">
                                            {
                                                annotationDetails.annotator
                                                    .full_name
                                            }
                                        </span>
                                    </p>
                                    <p className="text-slate-600 text-sm">
                                        {formatDateAndTime(
                                            formData?.dateAndTime
                                        )}
                                    </p>
                                </div>
                                <div className="flex gap-5 bg-gray-100 p-2 rounded-md">
                                    <p className="text-slate-600 text-xs sm:text-sm">
                                        Start Coordinates: <br /> (
                                        {
                                            annotationDetails.location
                                                .start_coordinates.latitude
                                        }
                                        ,{' '}
                                        {
                                            annotationDetails.location
                                                .start_coordinates.longitude
                                        }{' '}
                                        )
                                    </p>
                                    <p className="text-slate-600 text-xs sm:text-sm">
                                        End Coordinates: <br />(
                                        {
                                            annotationDetails.location
                                                .end_coordinates.latitude
                                        }
                                        ,{' '}
                                        {
                                            annotationDetails.location
                                                .end_coordinates.longitude
                                        }{' '}
                                        )
                                    </p>
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="text-lg font-semibold">
                                    ACCESSIBILITY SCORE
                                </h3>
                                <div className="flex px-3 gap-3 font-semibold text-lg items-center">
                                    <div
                                        className={`w-6 h-6 rounded-md border-2 border-black`}
                                        style={{
                                            backgroundColor: getColorFromValue(
                                                annotationDetails.location
                                                    .accessibility_score
                                            ),
                                        }}
                                    ></div>
                                    {getAccessibilityLabel(
                                        annotationDetails.location
                                            .accessibility_score
                                    )}
                                </div>
                                <a
                                    className={`text-sky-500 underline text-sm mx-3 
                                        ${demoMode ? 'blink' : ''}`}
                                    href="https://docs.google.com/document/d/1G7k4jhP2vi6SjNJbKcM86qTpGM3hDpr1Bk_hYG7GvCE/edit?usp=sharing"
                                    target="_blank"
                                >
                                    How the model works?
                                </a>
                            </div>
                            <Divider variant="middle" />
                            <div className="flex flex-col gap-3 p-3">
                                <div className="flex gap-2 items-center">
                                    <h2 className="font-semibold text-xl text-black">
                                        Location Data
                                    </h2>
                                    <button
                                        onClick={() =>
                                            setShowLocationData(
                                                !showLocationData
                                            )
                                        }
                                        className="rounded-full hover:bg-gray-100 p-1"
                                    >
                                        {showLocationData ? (
                                            <Icon icon="material-symbols:keyboard-arrow-down" />
                                        ) : (
                                            <Icon icon="material-symbols:keyboard-arrow-up" />
                                        )}
                                    </button>
                                </div>
                                {showLocationData && currentWeatherData && (
                                    <>
                                        <div>
                                            <h3 className="font-semibold">
                                                Hazard
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Flood Hazard Level based on
                                                Project Noah
                                            </p>
                                            <div className="flex flex-col w-full p-3 my-1 rounded-md bg-gray-100 gap-1">
                                                <p className="font-semibold">
                                                    {formatHazardIndex(
                                                        annotationDetails
                                                            .location.data
                                                            .hazard
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                POPULATION
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Population of the Barangay
                                            </p>
                                            <div className="flex flex-col w-full p-3 my-1 rounded-md bg-gray-100 gap-1">
                                                <p className="font-semibold">
                                                    {
                                                        annotationDetails
                                                            .location.data
                                                            .population
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                ZONE
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Area Zone Category by Mandaue
                                                City
                                            </p>
                                            <div className="flex flex-col w-full p-3 my-1 rounded-md bg-gray-100 gap-1">
                                                <p className="font-semibold">
                                                    {
                                                        annotationDetails
                                                            .location.data.zone
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                Heat Index
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Heat Index Category based on
                                                Humidity and Temperature
                                            </p>
                                            <div className="flex flex-col w-full p-3 my-1 rounded-md bg-gray-100 gap-1">
                                                <p className="font-semibold">
                                                    {
                                                        currentWeatherData.heatIndex
                                                    }
                                                    °C
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                PRECIPITATION
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Precipitation of the surrounding
                                                area
                                            </p>
                                            <div className="flex flex-col w-full p-3 my-1 rounded-md bg-gray-100 gap-1">
                                                <p className="font-semibold">
                                                    {
                                                        currentWeatherData.precipitation
                                                    }{' '}
                                                    mm/hr
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <Divider variant="middle" />
                            {formData?.sidewalkPresence ? (
                                <div className="p-3 flex flex-col gap-3 text-slate-700">
                                    <div className="flex gap-2 items-center">
                                        <h2 className="font-semibold text-xl text-black">
                                            Manual Annotation Data
                                        </h2>
                                        <button
                                            onClick={() =>
                                                setShowManualData(
                                                    !showManualData
                                                )
                                            }
                                            className="rounded-full hover:bg-gray-100 p-1"
                                        >
                                            {showManualData ? (
                                                <Icon icon="material-symbols:keyboard-arrow-down" />
                                            ) : (
                                                <Icon icon="material-symbols:keyboard-arrow-up" />
                                            )}
                                        </button>
                                    </div>
                                    {showManualData && (
                                        <>
                                            <div>
                                                <h3 className="font-semibold">
                                                    SIDEWALK WIDTH
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    What are the specific
                                                    measurements for the
                                                    sidewalk width in meters?
                                                </p>
                                                <div className="flex flex-col w-full p-3 my-1 rounded-md bg-gray-100 gap-1">
                                                    <p className="font-semibold">
                                                        {
                                                            formData
                                                                ?.sidewalkWidth
                                                                ?.value
                                                        }
                                                        m
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            formData
                                                                ?.sidewalkWidth
                                                                ?.remarks
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">
                                                    SIDEWALK CONDITION
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    What is the size of the
                                                    cracks observed in
                                                    milimeters?
                                                </p>
                                                <div className="flex flex-col w-full p-3 my-1 rounded-md bg-gray-100 gap-1">
                                                    <p className="font-semibold">
                                                        {formData
                                                            ?.sidewalkCondition
                                                            ?.value
                                                            ? `${
                                                                  formData
                                                                      ?.sidewalkCondition
                                                                      ?.value
                                                              }mm`
                                                            : 'N/A'}
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            formData
                                                                ?.sidewalkCondition
                                                                ?.remarks
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">
                                                    RAMP GRADIENT
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    What is the estimated
                                                    gradient of the ramp
                                                    observed?
                                                </p>
                                                <div className="flex flex-col w-full p-3 my-1 rounded-md bg-gray-100 gap-1">
                                                    <p className="font-semibold">
                                                        {
                                                            formData
                                                                ?.rampGradient
                                                                ?.value
                                                        }
                                                        %
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            formData
                                                                ?.rampGradient
                                                                ?.remarks
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">
                                                    STREET FURNITURE
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    In the presence of street
                                                    furniture (benches, posts,
                                                    poles, etc.), Is there at
                                                    least 0.90m of walking space
                                                    on the sidewalk? If so how
                                                    much ang lewway?
                                                </p>
                                                <div className="flex flex-col w-full p-3 my-1 rounded-md bg-gray-100 gap-1">
                                                    <p className="font-semibold">
                                                        {formData
                                                            ?.streetFurniture
                                                            ?.value
                                                            ? `${
                                                                  formData
                                                                      ?.streetFurniture
                                                                      ?.value
                                                              }m`
                                                            : 'N/A'}
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            formData
                                                                ?.streetFurniture
                                                                ?.remarks
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">
                                                    BORDER BUFFER
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    Is there a clear division
                                                    between the sidewalk and the
                                                    road itself via elevation or
                                                    bollards present?
                                                </p>
                                                <div className="flex flex-col w-full p-3 my-1 rounded-md bg-gray-100 gap-1">
                                                    <p className="font-semibold">
                                                        {
                                                            formData
                                                                ?.borderBuffer
                                                                ?.value
                                                        }
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            formData
                                                                ?.borderBuffer
                                                                ?.remarks
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">
                                                    LIGHTING CONDITION
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    How well lit is the area?
                                                </p>
                                                <div className="flex flex-col w-full p-3 my-1 rounded-md bg-gray-100 gap-1">
                                                    <p className="font-semibold">
                                                        {
                                                            formData
                                                                ?.lightingCondition
                                                                ?.value
                                                        }
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            formData
                                                                ?.lightingCondition
                                                                ?.remarks
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <h3 className="text-lg font-semibold text-center py-3">
                                    No sidewalk 🚧
                                </h3>
                            )}

                            {annotationDetails.images?.length !== 0 && (
                                <div className="px-3">
                                    <h3 className="font-semibold mb-2">
                                        IMAGES
                                    </h3>
                                    <div className="min-h-[210px] flex gap-2 overflow-x-auto custom-scrollbar overflow-y-hidden pb-4">
                                        {annotationDetails.images?.map(
                                            (
                                                image: {
                                                    file: {
                                                        url:
                                                            | string
                                                            | StaticImport
                                                    }
                                                },
                                                index:
                                                    | React.Key
                                                    | null
                                                    | undefined
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="flex-shrink-0 w-[150px] h-[200px] relative"
                                                >
                                                    {!hasImageLoaded && (
                                                        <div className="w-full h-full bg-gray-300 rounded-md animate-pulse"></div>
                                                    )}
                                                    <Image
                                                        src={image.file.url}
                                                        alt={`annotation image ${Number(index) + 1}`}
                                                        fill
                                                        sizes="150px"
                                                        style={{
                                                            objectFit: 'cover',
                                                        }}
                                                        className={`rounded-md ${isLoading ? 'hidden' : 'block'}`}
                                                        onLoadingComplete={() =>
                                                            setHasImageLoaded(
                                                                true
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default AnnotationDetails
