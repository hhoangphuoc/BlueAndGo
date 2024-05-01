import React, { useState, useEffect } from 'react'
import {
    writeData,
    // syncTeamsData
} from '../constant/constants'

//TODO: Find a way to put the syncTeamsData array in local storage so that it can be accessed by other pages

let syncTeamsData = []

function TableRow({
    courseId,
    team,
    isConnected,
    syncState,
    setSyncState,
    onChange,
    // setIsConnected,
}) {
    //set the color based on the status
    const buttonStatusColor = {
        Pending: 'bg-orange-100 text-orange-600',
        Active: 'bg-green-200 text-green-600',
        Inactive: 'bg-red-200 text-red-600',
        IsPushed: 'bg-blue-200 text-blue-600',
    }

    const [status, setStatus] = useState('Inactive')
    const [isSynced, setIsSynced] = useState(syncState)

    //handle the sync button
    const handleSyncButton = async () => {
        if (isSynced) {
            //remove the team from the syncTeamsData array
            const index = syncTeamsData.findIndex((item) => item.id === team.id)
            syncTeamsData.splice(index, 1)

            //send end signal to the button
            writeData(team.id, 3)
        } else {
            //set the status of the button to active and the state to true
            team = { ...team, buttonStatus: 'Active', isSync: true }
            console.log(
                `Team ${team.id} data before adding to syncTeamsData:`,
                team
            )

            syncTeamsData.push(team) //add the team to the syncTeamsData array
            writeData(team.id, 4)
        }
        console.log('syncTeamsData array:', syncTeamsData)
        setIsSynced((prev) => !prev)
        setStatus((prev) => (prev === 'Inactive' ? 'Active' : 'Inactive'))

        //update the syncState, by checking if the syncTeamsData array is empty or not
        setSyncState(syncTeamsData.length > 0)

        //finally, store syncTeamsData array in the local storage
        localStorage.setItem('syncTeamsData', JSON.stringify(syncTeamsData))
    }

    //LOCAL STORAGE CONTROL ------------------------

    //get the id of the course from local storage first
    const courseIdData = window.localStorage.getItem('COURSE_ID')

    //get the connected state from the local storage when the page is refreshed
    useEffect(() => {
        if (courseIdData === courseId) {
            const syncState = window.localStorage.getItem('Already Synced')
            setSyncState(JSON.parse(syncState))
        }
    }, [setSyncState, courseIdData, courseId])

    //keep the connected state and sync state in the local storage
    useEffect(() => {
        window.localStorage.setItem('Is Connected', isConnected)
        window.localStorage.setItem('Already Synced', syncState)
    }, [isConnected, syncState])

    //when the page is refreshed, get the status of the button from the local storage
    useEffect(() => {
        if (courseIdData === courseId) {
            const status = JSON.parse(
                window.localStorage.getItem(`Team ${team.id} status`)
            )
            const isSynced = JSON.parse(
                window.localStorage.getItem(`Team ${team.id} isSynced`)
            )
            if (isSynced) {
                setStatus(status)
                setIsSynced(isSynced)
            }
        } else {
            //clear the local storage

            console.log(
                'Go to other course, send end signal to the button',
                team.id
            )

            writeData(team.id, 3)

            window.localStorage.clear()
        }
    }, [team, courseIdData, courseId])

    //keep the entire team states in the local storage
    useEffect(() => {
        team.buttonStatus = status
        team.isSync = isSynced
        window.localStorage.setItem(
            `Team ${team.id} status`,
            JSON.stringify(status)
        )
        window.localStorage.setItem(
            `Team ${team.id} isSynced`,
            JSON.stringify(isSynced)
        )
    }, [status, isSynced, team])

    //-------------------------------------

    return (
        <tr className="border-b border-gray-200 hover:bg-blue-200">
            <td className="py-3 px-6 text-left xs:hidden sm:hidden md:hidden">
                <span
                    className={`${buttonStatusColor[status]} py-1 px-3 rounded-full text-xs`}
                >
                    {team.id}
                </span>
            </td>
            <td className="py-3 px-6 text-left">
                {/* <span className="font-medium">{team.teamName}</span>
                 */}
                {/* TODO: Change to editable field */}
                <input
                    type="text"
                    className="w-60 border-1 border-gray-100 bg-white h-8 px-5 pr-16 rounded-lg text-sm focus:outline-none font-medium"
                    name="teamName"
                    value={team.teamName}
                    onChange={onChange}
                    placeholder="Team Name"
                />
            </td>
            <td className="py-3 px-6 text-center">
                <span
                    className={`${buttonStatusColor[status]} py-1 px-3 rounded-full text-xs`}
                >
                    {status}
                </span>
            </td>
            {isConnected ? (
                <td className="py-3 px-6  justify-center text-center">
                    <button
                        id={`begin-${team.id}`}
                        className={`py-1 px-3 text-xs ${
                            isSynced
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white font-bold rounded-md`}
                        onClick={() => {
                            handleSyncButton()
                        }}
                    >
                        {isSynced ? 'Unsync' : 'Sync'}
                    </button>
                </td>
            ) : (
                <td className="py-3 px-6  justify-center text-center">
                    <span className="py-1 px-3 text-xs font-medium">
                        Unable to Sync
                    </span>
                </td>
            )}
        </tr>
    )
}
function StatusTable({
    courseId,
    teams,
    isConnected,
    syncState,
    setSyncState,
}) {
    //set the syncTeamsData array to the local storage
    if (localStorage.getItem('syncTeamsData') !== null) {
        syncTeamsData = JSON.parse(localStorage.getItem('syncTeamsData'))
    } else {
        localStorage.setItem('syncTeamsData', JSON.stringify(syncTeamsData))
    }

    const [editableTeams, setEditableTeams] = useState([])
    //handle input change
    const handleInputChange = (e, teamId) => {
        const { name, value } = e.target

        const editData = editableTeams.map((item) =>
            item.id === teamId ? { ...item, [name]: value } : item
        )
        setEditableTeams(editData)
    }
    useEffect(() => {
        console.log('teams', teams)
        setEditableTeams(teams)
    }, [teams])
    return (
        <div className="overflow-y-auto">
            <div
                className="min-w-screen flex items-center justify-center bg-white
             font-sans overflow-hidden"
            >
                <div className="w-5/6 2xl:w-4/6">
                    <div className="bg-white shadow-md rounded my-6 overflow-scroll h-56 2xl:h-64 overflow-x-hidden border-t">
                        <table className="min-w-max w-full table-auto">
                            <tbody className="text-gray-600 text-sm font-light">
                                {editableTeams.map((team) => {
                                    return (
                                        <TableRow
                                            key={team.id}
                                            courseId={courseId}
                                            team={team}
                                            isConnected={isConnected}
                                            syncState={syncState}
                                            setSyncState={setSyncState}
                                            onChange={(e) =>
                                                handleInputChange(e, team.id)
                                            }
                                        />
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusTable
