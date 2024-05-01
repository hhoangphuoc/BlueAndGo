import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { HistoryTable } from '@/components'

import { getAllFinishedCourses } from '../firebase'
import { data } from 'autoprefixer'

function HistoryPage() {
    const router = useRouter()

    //create a course list to dynamically updated it
    const [courseList, setCourseList] = useState([])

    // Searching Filter:_________________________________________________________________
    //search Data:
    const [filterData, setFilterData] = useState([])
    //search input:
    const [search, setSearch] = useState('')

    //FIXME: Currently get all courses, but should only get courses which has been done
    useEffect(() => {
        getAllFinishedCourses().then((data) => {
            setCourseList(data)
            setFilterData(data)
        })
    }, [])

    const searchFilter = (text) => {
        if (text) {
            const newData = courseList.filter((course) => {
                const courseTitle = course.title
                    ? course.title.toLowerCase()
                    : ''.toLowerCase()
                // const courseId = course.id
                //     ? course.id.toLowerCase()
                //     : ''.toLowerCase()
                const textData = text.toLowerCase()
                return (
                    courseTitle.indexOf(textData) > -1
                    // ||courseId.indexOf(textData) > -1
                )
            })
            setFilterData(newData)
            setSearch(text)
        } else {
            setFilterData(courseList)
            setSearch(text)
        }
    }
    //__________________________________________________________________________________
    return (
        <>
            <div className="flex flex-auto flex-col h-screen">
                {/* Text Header */}
                <div className="px-4 pt-4 w-full justify-end">
                    <h2 className="text-4xl font-light"> Game History</h2>
                    <hr className="mb-0 mt-3" />
                </div>
                {/* Search Bar */}
                <div className="relative flex items-center w-full pl-1 lg:max-w-68 sm:pr-2 sm:ml-0 justify-center mx-6 my-8">
                    <div className="container relative left-0 z-50 flex w-3/4 h-full">
                        <div className="relative flex items-center w-full h-full lg:w-3/4 group">
                            <i className="fa-solid fa-magnifying-glass pr-2"></i>
                            <input
                                type="text"
                                className="block w-full xs:hidden py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 text-gray-400 aa-input"
                                placeholder="Filter by title"
                                value={search}
                                onChange={(e) => searchFilter(e.target.value)}
                            />
                            {/* TODO: Date Icon for filter by date */}
                            <i className="fa-solid fa-calendar-days pl-4"></i>
                        </div>
                    </div>
                </div>
                {/* History Table */}
                <div className="flex flex-col justify-center">
                    <HistoryTable
                        courses={filterData}
                        setCourses={setFilterData}
                    />
                </div>
            </div>
        </>
    )
}

export default HistoryPage
