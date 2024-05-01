import React, { useState, useEffect } from 'react'
import { Reorder } from 'framer-motion'

//HANDLE STATE FUNCTION
function sortedTeamsList({ teamsList, setTeamsList }) {
    const sortedTeams = teamsList.sort((a, b) => {
        return b.point - a.point
    })
    setTeamsList(sortedTeams)
    return teamsList
}
//COMPONENTS FUNCTIONS
function TableHeader() {
    return (
        <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left xs:hidden">TeamID</th>
                <th className="py-3 px-6 text-left">Team name</th>
                <th className="py-3 px-6 text-center">Point</th>
                {/* <th className="py-3 px-6 text-center">Action</th> */}
            </tr>
        </thead>
    )
}
function TableRow({ team }) {
    //set the color based on the status
    const buttonStatusColor = {
        Pending: 'bg-orange-100 text-orange-600',
        Active: 'bg-green-200 text-green-600',
        Inactive: 'bg-red-200 text-red-600',
        IsPushed: 'bg-blue-200 text-blue-600',
    }
    const [status, setStatus] = useState(team.buttonStatus)
    const [point, setPoint] = useState(team.point)

    useEffect(() => {
        //update the status of the button
        team.buttonStatus = status
        team.point = point
    }, [status, point, team])
    return (
        <Reorder.Item
            as="tr"
            className="border-b border-gray-200 hover:bg-blue-200"
            key={team.id}
            value={team}
            layout
            transition={{
                duration: 0.75,
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
            <td className="py-3 px-6 text-left xs:hidden">
                <span
                    className={`${buttonStatusColor[status]} py-1 px-3 rounded-full text-xs`}
                >
                    {team.id}
                </span>
            </td>
            <td className="py-3 px-6 text-left">
                <span className="font-medium">{team.teamName}</span>
            </td>
            <td className="py-3 px-6 text-center">
                <span className="font-medium">{team.point}</span>
            </td>
        </Reorder.Item>
    )
}

function Leaderboard({ teamsList, setTeamsList }) {
    //sorted the teamsList based on the point
    sortedTeamsList({ teamsList, setTeamsList })

    useEffect(() => {
        console.log('teamsList updated in Leaderboard')
    }, [teamsList])

    //TODO: Reorder the teamsList based on the point
    return (
        <div className="overflow-x-auto">
            <div
                className="min-w-screen flex items-center justify-center bg-white
             font-sans overflow-hidden"
            >
                <div className="w-5/6 2xl:w-3/6">
                    <div className="bg-white shadow-md rounded my-6">
                        <Reorder.Group
                            values={teamsList}
                            onReorder={setTeamsList}
                        >
                            <table className="min-w-max w-full table-auto">
                                <TableHeader />
                                <tbody className="text-gray-600 text-sm font-light">
                                    {teamsList.map((team) => (
                                        <TableRow key={team.id} team={team} />
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

export default Leaderboard
