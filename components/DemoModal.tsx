import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Image from 'next/image'

import useAnnotationStore from '@/store/annotation'

interface DemoModalProps {
    isOpen: boolean
    onClose: () => void
    onStartDemo: () => void
}

export default function DemoModal({
    isOpen,
    onClose,
    onStartDemo,
}: DemoModalProps) {
    const { demoStep } = useAnnotationStore()
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[999]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h2"
                                    className="text-3xl font-bold leading-6 text-gray-900 mb-4 text-center"
                                >
                                    {demoStep === 0
                                        ? 'Welcome to Lakbai!👷'
                                        : "You're All Set! 🎉"}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-lg text-gray-500">
                                        {demoStep === 0
                                            ? 'Welcome to Lakbai! This quick tour will help you navigate the app and start annotating sidewalks to improve accessibility.'
                                            : "Congratulations on adding your first annotation! Your contribution helps make sidewalks more accessible for everyone. Continue exploring or add more annotations whenever you're ready."}
                                    </p>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                    {demoStep === 0 && (
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/80 focus:outline-none"
                                            onClick={onStartDemo}
                                        >
                                            Start Demo
                                        </button>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
