import React, { useEffect, useState } from 'react'
import AccountMenu from './AccountMenu'

//TODO: FIx the bug

//set the screen size to the window size
function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    })

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        window.addEventListener('resize', handleResize)

        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowSize
}

//set active menu to false if the screen size is greater than 768px

export default function TopBar(props) {
    // handle the active menu
    const { width, height } = useWindowSize()
    const [activeMenu, setActiveMenu] = useState(false)
    const { setOpenSidebar, openSidebar, search, searchFilter } = props

    useEffect(() => {
        if (width <= 768) {
            setActiveMenu(false)
        } else {
            setActiveMenu(true)
        }
    }, [width])
    // const handleActiveMenu = () => setActiveMenu(!activeMenu)
    return (
        <div className="relative flex items-center w-auto pl-1 sm:pr-2 sm:ml-0 justify-between mx-6 my-5">
            {/* hamburger menu */}
            <div className="block pr-4"></div>
            {/* search bar */}
            <div className="container relative left-0 z-50 flex w-3/4 h-full">
                <div className="relative flex items-center w-full h-full lg:w-3/4 group">
                    <i className="fa-solid fa-magnifying-glass pr-4"></i>
                    <input
                        type="text"
                        className="block w-full xs:hidden py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 text-gray-400 aa-input"
                        placeholder="Search for current games"
                        value={search}
                        onChange={(e) => searchFilter(e.target.value)}
                    />
                </div>
            </div>
            {/* user icon */}
            <div className="block pr-10 ">
                <AccountMenu />
                {/* <i className="fa-solid fa-user mx-auto object-cover rounded-full hover:scale-110 hover:opacity-60 duration-150 cursor-pointer p-3 -mr-3" /> */}
            </div>
        </div>
    )
}
