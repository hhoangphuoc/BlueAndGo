import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CourseCard, TopBar, FormModal } from '../components'
import {
    getAllCourses,
    getAllFinishedCourses,
    getAllUnfinishedCourses,
} from '../firebase'
export default function Home() {
    const [loading, setLoading] = useState(false)
    const colors = [
        'bg-green-400',
        'bg-blue-400',
        'bg-yellow-400',
        'bg-red-400',
        'bg-purple-400',
        'bg-pink-400',
        'bg-indigo-400',
        'bg-emerald-400',
        'bg-teal-400',
        'bg-cyan-400',
        'bg-orange-400',
        'bg-lime-400',
        'bg-rose-400',
        'bg-fuchsia-400',
        'bg-violet-400',
        'bg-sky-400',
    ]
    //create a course list to dynamically updated it
    const [courseList, setCourseList] = useState([])
    const [unfinishedCourse, setUnfinishedCourse] = useState([])
    //const [finishedCourse, setFinishedCourse] = useState([])
    const [filterCourse, setFilterCourse] = useState([])

    const [search, setSearch] = useState('')

    //get all the courses from the database
    //render the course list once when the page is loaded
    useEffect(() => {
        getAllCourses().then((data) => {
            setCourseList(data)
        })
        getAllUnfinishedCourses().then((data) => {
            setUnfinishedCourse(data)

            //initialize the filterCourse
            setFilterCourse(data)
        })
        // getAllFinishedCourses().then((data) => {
        //     setFinishedCourse(data)
        // })
    }, [])
    const searchFilter = (text) => {
        if (text) {
            const newData = unfinishedCourse.filter((course) => {
                const courseTitle = course.title
                    ? course.title.toLowerCase()
                    : ''.toLowerCase()
                const textData = text.toLowerCase()
                return (
                    courseTitle.indexOf(textData) > -1
                    // ||courseId.indexOf(textData) > -1
                )
            })
            setFilterCourse(newData)
            setSearch(text)
        } else {
            setFilterCourse(unfinishedCourse)
            setSearch(text)
        }
    }

    return (
        <>
            {/* TopBar */}
            <TopBar search={search} searchFilter={searchFilter} />
            <div class="flex-auto flex flex-col">
                {/* <Add course button /> */}
                <div className="flex justify-end px-4 pt-4 w-full">
                    <FormModal />
                </div>
                {/* Text Header */}
                <div className="px-8 pt-4 w-full justify-end">
                    {loading ? (
                        <i className="fa-solid fa-spinner animate-spin text-2xl"></i>
                    ) : (
                        <h2 className="text-2xl font-medium">
                            Current Game Sessions
                        </h2>
                    )}
                    <hr className="mb-0 mt-3" />
                </div>
                {/* Main Dashboard */}
                <div className="flex flex-row flex-wrap justify-center">
                    {unfinishedCourse.length > 0 ? (
                        filterCourse.map((course, index) => {
                            return (
                                <Link
                                    onClick={() => setLoading(true)}
                                    key={course.id}
                                    href={`courses/${course.id}`}
                                >
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        cardColor={
                                            colors[index % colors.length]
                                        }
                                    />
                                </Link>
                            )
                        })
                    ) : (
                        <div class="flex flex-col justify-center items-center mt-12">
                            <h2 class="text-2xl font-medium p-4">
                                No game matches your search
                            </h2>
                            <h2 className="text-2xl font-light p-2">
                                Click the button above to create a new game
                            </h2>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
