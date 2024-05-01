import React from 'react'

function CourseCard({
    course,
    cardColor,
    // onClick
}) {
    const cardStyle =
        'mx-3 mb-3 shadow-sm hover:shadow-lg d-flex bg-white rounded border border-solid m-4 relative flex flex-col duration-300'

    return (
        <div
            class={`h-56 w-64
             bg-white ${cardStyle}`}
            // key={key}
            // onClick={onClick}
        >
            {/* card header */}
            <div class={`h-40 px-5 py-3 flex justify-center ${cardColor}`}>
                {/* image */}
                <div className="mx-auto my-auto text-center">
                    <i className="fa-solid fa-book text-5xl text-white"></i>
                </div>
            </div>
            {/* card body */}
            <div class="py-3 flex-auto text-center">
                <div class="font-medium text-md mb-2 mx-4 truncate">
                    {course.title}
                </div>
            </div>
        </div>
    )
}
export default CourseCard
