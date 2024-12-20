'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const FullScreenLoader = () => {
    const [isStarted, setIsStarted] = useState(false)

    useEffect(() => {
        const startTimer = setTimeout(() => {
            setIsStarted(true)
        }, 50)

        return () => {
            clearTimeout(startTimer)
        }
    }, [])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="min-h-screen w-full bg-white flex items-center justify-center">
                {isStarted && (
                    <div
                        className="inline-flex items-center bg-primary border-2 border-black rounded-lg p-6"
                        style={{
                            animation:
                                'scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                        }}
                    >
                        <div className="flex items-center gap-[0.2rem]">
                            <span
                                className="text-5xl font-medium font-inter"
                                style={{
                                    animation:
                                        'fadeInUp 0.6s ease-out forwards',
                                    animationDelay: '0.2s',
                                    opacity: 0,
                                }}
                            >
                                L
                            </span>
                            <div
                                className="relative w-[45px] h-[45px] translate-x-1 translate-y-[2px]"
                                style={{
                                    animation:
                                        'slideIn 2s ease-in-out forwards, fadeIn 0.3s ease-out forwards',
                                }}
                            >
                                <Image
                                    src="/Pedestrian.gif"
                                    alt="Pedestrian icon"
                                    fill
                                    priority
                                    className="object-contain"
                                    style={{
                                        WebkitAnimationPlayState: 'paused',
                                        animationPlayState: 'paused',
                                        WebkitAnimationDelay: '99999s',
                                        animationDelay: '99999s',
                                    }}
                                />
                            </div>
                            <span
                                className="text-5xl font-medium font-inter tracking-[0.2rem]"
                                style={{
                                    animation:
                                        'fadeInUp 0.6s ease-out forwards',
                                    animationDelay: '0.6s',
                                    opacity: 0,
                                }}
                            >
                                KBAI
                            </span>
                        </div>
                    </div>
                )}
                <style jsx>{`
                    @keyframes scaleIn {
                        0% {
                            transform: scale(0.8);
                            opacity: 0;
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }

                    @keyframes fadeInUp {
                        0% {
                            transform: translateY(20px);
                            opacity: 0;
                        }
                        100% {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }

                    @keyframes fadeIn {
                        0% {
                            opacity: 0;
                        }
                        100% {
                            opacity: 1;
                        }
                    }

                    @keyframes slideIn {
                        0% {
                            transform: translateX(-125px);
                        }
                        100% {
                            transform: translateX(0);
                        }
                    }
                `}</style>
            </div>
        </div>
    )
}

export default FullScreenLoader
