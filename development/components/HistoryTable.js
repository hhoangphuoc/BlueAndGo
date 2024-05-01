import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Reorder } from 'framer-motion'
import { CSVLink } from 'react-csv'
import { deleteCourseByIdTitle } from '@/firebase'

//COMPONENTS FUNCTIONS
function TableHeader() {
    return (
        <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                {/* <th className="py-3 px-6 text-left xs:hidden">GAMEID</th> */}
                <th className="py-3 px-6 text-left">TITLE</th>
                <th className="py-3 px-6 text-center xs:hidden">CREATED AT</th>
                <th className="py-3 px-6 text-center">ACTION</th>
            </tr>
        </thead>
    )
}
function TableRow({ course }) {
    const router = useRouter()
    const data = []

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    data.push({
        gameId: course.id,
        title: course.title,
        createdAt: course.createdAt
            ? course.createdAt.toDate().toLocaleDateString('en-US', options)
            : null, // Convert the timestamp to a Date object
    })
    course.teams.forEach((team) => {
        data.push({
            teamId: team.id,
            teamName: team.teamName,
            point: team.point,
        })
    })
    return (
        <Reorder.Item
            as="tr"
            className="border-b border-gray-200 hover:bg-blue-200"
            key={course.id}
            value={course}
            layout
            transition={{
                duration: 0.5,
                ease: 'easeInOut',
            }}
            initial={{
                opacity: 0,
                y: -50,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: 50,
            }}
        >
            {/* <tr> */}
            {/* <td className="py-3 px-6 text-left xs:hidden">
                <span className="font-medium text-md">{course.id}</span>
            </td> */}

            <td className="py-3 px-6 text-left">
                <span className="font-medium text-md">{course.title}</span>
            </td>
            <td className="py-3 px-6 text-center xs:hidden">
                <span className="font-medium text-md">
                    {course.createdAt
                        ? course.createdAt
                              .toDate()
                              .toLocaleDateString('en-US', options)
                        : '-'}
                </span>
            </td>
            <td className="flex flex-row justify-center py-3 px-6 text-center">
                {/* Download Button */}
                <CSVLink data={data} filename={`Game-${course.title}.csv`}>
                    <button
                        className="font-bold py-2 px-4 rounded"
                        type="button"
                    >
                        <i className="fa-solid fa-download text-lg text-blue-500 hover:text-blue-600 " />
                    </button>
                </CSVLink>

                {/* Delete Button */}
                <button
                    className="font-bold py-2 px-4 rounded z-50"
                    type="button"
                    onClick={async () => {
                        console.log(
                            'Delete game: ',
                            course.id,
                            'with title:',
                            course.title
                        )
                        await deleteCourseByIdTitle(course.id, course.title)
                            .then(() => {
                                console.log(
                                    'Delete game: ',
                                    course.id,
                                    'with title:',
                                    course.title
                                )
                                alert(
                                    `Delete successfully: "${course.title}", please refresh the page`
                                )
                            })
                            .catch((error) => {})
                    }}
                >
                    <i className="fa-solid fa-trash-can text-lg text-red-500 hover:text-red-600"></i>
                </button>
            </td>
            {/* </tr> */}
        </Reorder.Item>
    )
}

function HistoryTable({ courses, setCourses }) {
    //TODO: Reorder the teamsList based on the point

    // useEffect(() => {
    //     console.log('courses: ', courses)
    // }, [courses, setCourses])
    return (
        <div className="overflow-x-auto">
            <div
                className="min-w-screen flex items-center justify-center bg-white
             font-sans overflow-hidden"
            >
                <div className="w-5/6 2xl:w-3/6">
                    <div className="bg-white shadow-md rounded my-6">
                        <Reorder.Group values={courses} onReorder={setCourses}>
                            <table className="min-w-max w-full table-auto">
                                <TableHeader />
                                <tbody className="text-gray-600 text-sm font-light">
                                    {courses.map((course) => (
                                        <TableRow
                                            key={course.id}
                                            course={course}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </Reorder.Group>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HistoryTable
