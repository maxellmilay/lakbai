'use client'

import { Icon } from '@iconify/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { MapLineSegment } from '@/interface/map'
import { motion, AnimatePresence } from 'framer-motion'

import useAuthStore from '@/store/auth'
import useAnnotationStore from '@/store/annotation'

interface PropsInterface {
    expand: boolean
    pickLocation: () => void
    setExpandSidebar: (expand: boolean) => void
    setSelectedLineSegment: Dispatch<SetStateAction<MapLineSegment | null>>
    isPickingLocation: boolean
}

interface Annotation {
    id: number
    level: number
    name: string
    lineSegment: MapLineSegment
}

interface AnnotationItem {
    date: string
    annotations: Annotation[]
}

function Sidebar(props: PropsInterface) {
    const { user, getUser } = useAuthStore()
    const { sidebarAnnotations, getSidebarAnnotations } = useAnnotationStore()

    const [isLoading, setIsLoading] = useState(true)
    const {
        expand = true,
        setExpandSidebar,
        pickLocation,
        setSelectedLineSegment,
        isPickingLocation,
    } = props

    const getColor = (level: number) => {
        console.log(level)
        if (level >= 0 && level < 0.2) {
            return 5
        } else if (level >= 0.2 && level < 0.4) {
            return 4
        } else if (level >= 0.4 && level < 0.6) {
            return 3
        } else if (level >= 0.6 && level < 0.8) {
            return 2
        } else {
            return 1
        }
    }

    const data: AnnotationItem[] = Object.entries(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sidebarAnnotations.reduce((acc: any, annotation: any) => {
            const date = new Date(annotation.updated_on)
            const today = new Date()

            let dateKey
            if (date.toDateString() === today.toDateString()) {
                dateKey = 'Today'
            } else {
                dateKey = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
            }

            if (!acc[dateKey]) {
                acc[dateKey] = []
            }

            acc[dateKey].push({
                id: annotation.id,
                level: getColor(
                    parseFloat(annotation.location.accessibility_score)
                ),
                name: annotation.name,
                lineSegment: {
                    id: annotation.location.id,
                    start_coordinates: {
                        latitude:
                            annotation.location.start_coordinates.latitude,
                        longitude:
                            annotation.location.start_coordinates.longitude,
                    },
                    end_coordinates: {
                        latitude: annotation.location.end_coordinates.latitude,
                        longitude:
                            annotation.location.end_coordinates.longitude,
                    },
                },
            })

            return acc
        }, {})
    ).map(([date, annotations]) => ({
        date,
        annotations: annotations as Annotation[],
    }))

    const toggleSidebar = () => {
        if (isPickingLocation) {
            return
        }
        setExpandSidebar(!expand)
    }

    const inspectAnnotation = (annotation: Annotation) => {
        setSelectedLineSegment(annotation.lineSegment)
    }

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            if (!user) {
                await getUser()
            }
            await getSidebarAnnotations()
            setIsLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div>
            <div
                className={`z-20 top-[26px] left-[26px] absolute flex gap-6 px-3 py-2 items-center bg-white rounded-md border-2
                ${!expand || !user ? 'border-black shadow-lg' : 'border-transparent'}`}
            >
                {user && (
                    <button
                        onClick={toggleSidebar}
                        className={`${isPickingLocation && 'pointer-events-none'}`}
                    >
                        <Icon
                            icon="material-symbols:view-sidebar-outline"
                            className="w-8 h-8"
                        />
                    </button>
                )}
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold">Lakb.</h1>
                    <div className="font-bold text-2xl flex w-9 h-9 bg-primary border-2 border-black rounded-md  justify-center items-center">
                        AI
                    </div>
                </div>
            </div>
            {user && (
                <>
                    <AnimatePresence>
                        {expand && (
                            <motion.div
                                className="absolute h-lvh p-4 z-10"
                                key={1}
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                            >
                                <nav
                                    className={`bg-white w-[320px] h-full rounded-md border-2 border-black p-3 flex flex-col gap-2 transition-transform duration-300 ease-in-out ${
                                        expand
                                            ? 'translate-x-0'
                                            : '-translate-x-[calc(100%+1rem)]'
                                    }`}
                                >
                                    {/* ignore this, do not remove */}
                                    <div className="bg-level-1 bg-level-2 bg-level-3 bg-level-4 bg-level-5 hidden"></div>

                                    <div className="h-[60px] min-h-[60px]"></div>
                                    <button
                                        onClick={pickLocation}
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
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-96">
                                            loading...
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                                            {data.map((set, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-col gap-2"
                                                >
                                                    <div className="p-2">
                                                        <p className="font-medium text-slate-600">
                                                            {set.date}
                                                        </p>
                                                    </div>
                                                    {set.annotations.map(
                                                        (annotation, index) => (
                                                            <button
                                                                onClick={() =>
                                                                    inspectAnnotation(
                                                                        annotation
                                                                    )
                                                                }
                                                                key={index}
                                                                className="rounded-md border border-transparent p-2 flex gap-2 items-center w-full hover:bg-primary-light hover:border hover:border-primary"
                                                            >
                                                                <div
                                                                    className={`rounded-md min-w-6 w-6 h-6 border-2 border-black bg-level-${annotation.level}`}
                                                                ></div>
                                                                <p className="truncate max-w-[230px]">
                                                                    {
                                                                        annotation.name
                                                                    }
                                                                </p>
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {data.length >= 20 && (
                                        <button className="text-slate-600 hover:text-primary-dark duration-100">
                                            View all annotations
                                        </button>
                                    )}
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    )
}

export default Sidebar
