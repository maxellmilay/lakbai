'use client'

import { Icon } from '@iconify/react'

interface PropsInterface {
    expand: boolean
    pickLocation: () => void
    setExpandSidebar: (expand: boolean) => void
    setSelectedAnnotationId: (id: number | null) => void
    isPickingLocation: boolean
}

function Sidebar(props: PropsInterface) {
    const {
        expand = true,
        setExpandSidebar,
        pickLocation,
        setSelectedAnnotationId,
        isPickingLocation,
    } = props

    const data = [
        {
            date: 'Today',
            annotations: [
                {
                    id: 1,
                    level: 4,
                    name: 'T Padilla St, Gaisano Saversmart',
                },
                {
                    id: 2,
                    level: 5,
                    name: 'Lopez Jaena St, Upper Malibu',
                },
                {
                    id: 3,
                    level: 2,
                    name: "Hernan Cortes St, Jullie's Bakeshop & Restaurant",
                },
                {
                    id: 4,
                    level: 3,
                    name: 'T Padilla St, Gaisano Saversmart side bridge',
                },
            ],
        },
        {
            date: 'October 13, 2024',
            annotations: [
                {
                    id: 5,
                    level: 1,
                    name: 'T Padilla St corner Lopez Jaena St',
                },
                {
                    id: 6,
                    level: 3,
                    name: 'Mabolo St, Mabolo Church',
                },
                {
                    id: 7,
                    level: 2,
                    name: 'Banilad Rd, Gaisano Country Mall',
                },
                {
                    id: 8,
                    level: 4,
                    name: 'Mango Ave, Robinsons Cybergate',
                },
                {
                    id: 9,
                    level: 5,
                    name: 'Colon St, Metro Colon',
                },
                {
                    id: 10,
                    level: 3,
                    name: 'Osmeña Blvd, Fuente Osmeña Circle',
                },
                {
                    id: 11,
                    level: 2,
                    name: 'Ayala Center Cebu, The Terraces',
                },
                {
                    id: 12,
                    level: 5,
                    name: 'Colon St, Metro Colon',
                },
                {
                    id: 13,
                    level: 3,
                    name: 'Osmeña Blvd, Fuente Osmeña Circle',
                },
            ],
        },
    ]

    const toggleSidebar = () => {
        if (isPickingLocation) {
            return
        }
        setExpandSidebar(!expand)
    }

    return (
        <div>
            <div className="z-20 top-[26px] left-[26px] absolute flex gap-6 p-3 items-center">
                <button
                    onClick={toggleSidebar}
                    className={`${isPickingLocation && 'pointer-events-none'}`}
                >
                    <Icon
                        icon="material-symbols:view-sidebar-outline"
                        className="w-8 h-8"
                    />
                </button>
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold">Lakb.</h1>
                    <div className="font-bold text-2xl flex w-9 h-9 bg-primary border-2 border-black rounded-md  justify-center items-center">
                        AI
                    </div>
                </div>
            </div>
            <div className="absolute h-lvh p-4 z-10">
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
                        <p className="font-medium">Add annotation</p>
                    </button>
                    <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                        {data.map((set, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <div className="p-2">
                                    <p className="font-medium text-slate-600">
                                        {set.date}
                                    </p>
                                </div>
                                {set.annotations.map((annotation, index) => (
                                    <button
                                        onClick={() =>
                                            setSelectedAnnotationId(
                                                annotation.id
                                            )
                                        }
                                        key={index}
                                        className="rounded-md border border-transparent p-2 flex gap-2 items-center w-full hover:bg-primary-light hover:border hover:border-primary"
                                    >
                                        <div
                                            className={`rounded-md min-w-6 w-6 h-6 border-2 border-black bg-level-${annotation.level}`}
                                        ></div>
                                        <p className="truncate max-w-[230px]">
                                            {annotation.name}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                    <button className="text-slate-600 hover:text-primary-dark duration-100">
                        View all annotations
                    </button>
                </nav>
            </div>
        </div>
    )
}

export default Sidebar
