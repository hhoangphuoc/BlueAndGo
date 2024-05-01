import React, { useState, useEffect } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/router'
import {
    connect,
    courseThumbnail,
    // syncTeamsData,
} from '../../constant/constants'
import { StatusTable } from '../../components'
import { getCourseById, getTeamsByCourseId } from '../../firebase'

// Path: pages\courses\[courseid].js

const CoursePage = () => {
    const router = useRouter()

    //STATES:
    const [isConnected, setIsConnected] = useState(false)
    //set the sync state in wrapper component
    const [syncState, setSyncState] = useState(false)
    const [course, setCourse] = useState({})
    const [teamsData, setTeamsData] = useState([])

    //FUNCTIONS:
    //fetch the teams data:
    const courseId = router.query.courseid

    useEffect(() => {
        getCourseById(courseId, setCourse)
        getTeamsByCourseId(courseId, setTeamsData)
    }, [courseId])

    // useEffect(() => {
    //     getTeamsByCourseId(courseId, setTeamsData)
    // }, [courseId])

    //LOCAL STORAGE ------------------------
    useEffect(() => {
        // get the id of the course from local storage
        const courseIdData = window.localStorage.getItem('COURSE_ID')
        if (courseIdData === courseId) {
            const isConnectedData = JSON.parse(
                window.localStorage.getItem('isConnected')
            )
            if (isConnectedData) {
                setIsConnected(isConnectedData)
            }
        } else {
            //clear the local storage
            window.localStorage.clear()
        }
    }, [courseId])

    useEffect(() => {
        // set the id of the course in local storage
        window.localStorage.setItem('COURSE_ID', courseId)
        window.localStorage.setItem('isConnected', JSON.stringify(isConnected))
    }, [isConnected, courseId])

    //-------------------------

    //handle the start button
    const handleStartButton = () => {
        if (isConnected) {
            //router push with query
            router.push({
                pathname: `/games/${courseId}`,
                query: { gameId: courseId },
            })
        }
    }

    return (
        <div className="flex flex-auto flex-col">
            {/* Text Header */}
            <div className="px-4 pt-4 w-full justify-end">
                <h2 className="text-4xl font-light">{course.title}</h2>
                <hr className="mb-0 mt-3" />
            </div>
            {/* Course Body */}
            <div className="flex-auto flex flex-col xl:flex-wrap">
                {/* Course Thumbnail */}
                <div className="flex justify-center h-1/3 mb-4">
                    <Image
                        className="w-7/12 h-full object-cover object-center rounded-md my-6"
                        src={courseThumbnail}
                        alt="Course Thumbnail"
                    />
                </div>

                {/* Start the game button */}
                <div className="flex justify-center mt-4">
                    {isConnected ? (
                        <>
                            {syncState ? (
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md my-6"
                                    onClick={() => {
                                        handleStartButton()
                                    }}
                                >
                                    Start the game
                                </button>
                            ) : (
                                <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-md my-6">
                                    Device already connected
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md my-6"
                            onClick={async () => {
                                try {
                                    const { reader, writer, connected } =
                                        await connect()
                                    if (reader !== null && writer !== null) {
                                        setIsConnected(connected)
                                    }
                                } catch (error) {
                                    console.log(error)
                                }
                            }}
                        >
                            Connect to device
                        </button>
                    )}
                </div>

                {/* Large Text */}
                <div className="flex justify-center">
                    <p
                        className={`text-2xl text-black font-sans sm:hidden xs:hidden`}
                    >
                        {isConnected
                            ? syncState
                                ? 'You are sync ! start the game...'
                                : 'Please sync the button to start...'
                            : 'Please connect to a device first...'}
                    </p>
                </div>

                {/* Status Table */}
                <StatusTable
                    courseId={courseId}
                    teams={teamsData}
                    isConnected={isConnected}
                    syncState={syncState}
                    setSyncState={setSyncState}
                />
            </div>
        </div>
    )
}

export default CoursePage
