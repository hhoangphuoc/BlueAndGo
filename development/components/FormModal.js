import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { addNewCourse, getCourseByDocumentId } from '../firebase'
// import { courses, colors } from '../constant/constants'
export default function FormModal() {
    // { courseList, setCourseList }
    const [showModal, setShowModal] = useState(false)
    const [courseName, setCourseName] = useState('')

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.key === 'Escape') {
                setShowModal(false)
            }
        }

        document.addEventListener('keydown', keyDownHandler)
        return () => {
            document.removeEventListener('keydown', keyDownHandler)
        }
    }, [])

    const router = useRouter()

    //create a new course and updated the courses
    const CreateNewCourse = () => {
        //add new course to the database, then use the id to redirect to the new course page
        addNewCourse(courseName).then((docRef) => {
            console.log('New document added with ID: ', docRef.id)
            const course = getCourseByDocumentId(docRef.id)

            console.log('New course created with course id:', course.id)

            //reload the page to update the course list
            router.reload()
        })
    }

    function handleClose(e) {
        if (e.target.id === 'wrapper') {
            setShowModal(false)
        }
    }
    return (
        <>
            <button
                className="px-4 bg-blue-500 p-3 rounded-lg text-white hover:bg-blue-600 font-semibold duration-150"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Add New Game
            </button>
            {showModal ? (
                <>
                    <div
                        onClick={handleClose}
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-sm"
                        id="wrapper"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold select-none">
                                        Create New Course
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <p className="my-4 text-slate-500 text-lg leading-relaxed select-none">
                                        Create a new course? Enter the course
                                        name below.
                                    </p>
                                    <div className="relative w-full mb-3 mt-8">
                                        <label
                                            className="block uppercase text-slate-600 text-xs font-bold mb-2 select-none"
                                            htmlFor="courseName"
                                        >
                                            Course Name
                                        </label>
                                        <input
                                            type="text"
                                            className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border border-slate-300 outline-none focus:outline-none focus:shadow-outline w-full pr-10"
                                            placeholder="Example. AS1: Team Formation"
                                            value={courseName}
                                            onChange={(e) =>
                                                setCourseName(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 select-none hover:text-red-600"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 select-none"
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false)
                                            CreateNewCourse()
                                        }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    )
}
