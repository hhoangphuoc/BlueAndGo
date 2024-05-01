import React, { useState } from 'react'
import Image from 'next/image'
import Router, { useRouter } from 'next/router'
import {
    // syncTeamsData,
    goldMedal,
    bronzeMedal,
    silverMedal,
    educationPack,
} from '../../constant/constants'
import { updateGameData } from '../../firebase'

function TableHeaderResult() {
    return (
        <thead>
            <tr className="bg-blue-400 text-gray-600 uppercase xs:text-sm text-md 2xl:text-lg leading-normal">
                <th className="py-3 px-6 text-center">Rank</th>
                <th className="py-3 px-6 text-center">Team name</th>
                <th className="py-3 px-6 text-center">Point</th>
            </tr>
        </thead>
    )
}
function TableRowResult({ team, rank }) {
    return (
        <tr className="border-b border-gray-200 hover:bg-gray-200 space-y-12">
            <td className="py-3 px-6 text-center">
                <span className="font-medium"># {rank}</span>
            </td>
            <td className="py-3 px-6 text-center">
                <span className="font-medium">{team.teamName}</span>
            </td>
            <td className="py-3 px-6 text-center">
                <span className="font-medium">{team.point}</span>
            </td>
        </tr>
    )
}

function TeamColumn({ teamName, score, rank }) {
    const rankProps = {
        1: {
            rankColor: 'bg-amber-400',
            width: 'w-2/5',
            height: 'h-72 2xl:h-96',
            icon: goldMedal,
        },
        2: {
            rankColor: 'bg-slate-400',
            width: 'w-2/5',
            height: 'h-52 2xl:h-72',
            icon: silverMedal,
        },
        3: {
            rankColor: 'bg-orange-400',
            width: 'w-2/5',
            height: 'h-36 2xl:h-56',
            icon: bronzeMedal,
        },
    }
    const { rankColor, width, height, icon } = rankProps[rank]

    return (
        <div
            className={`flex flex-col ${rankColor} ${width} ${height} items-center rounded-t-xl justify-end py-auto pb-4 text-white space-y-8 md:space-y-4 2xl:space-y-12`}
        >
            <Image
                className="w-2/5 h-3/5 object-fill md:hidden sm:hidden xs:hidden"
                src={icon}
                alt="rank"
            />
            <h2 className="text-xl 2xl:text-2xl md:text-lg sm:text-sm xs:text-sm font-medium">
                #{teamName}
            </h2>
            <h2 className="text-2xl 2xl:text-3xl md:text-xl sm:text-lg xs:text-sm font-medium">
                {score}
            </h2>
        </div>
    )
}

function RenderTopThree({ topThree }) {
    return (
        <div className="flex flex-row justify-center self-center items-end border-spacing-1 mt-8 w-2/3 2xl:w-2/5">
            <TeamColumn
                teamName={topThree[1].teamName}
                score={topThree[1].point}
                rank="2"
            />
            <TeamColumn
                teamName={topThree[0].teamName}
                score={topThree[0].point}
                rank="1"
            />
            <TeamColumn
                teamName={topThree[2].teamName}
                score={topThree[2].point}
                rank="3"
            />
        </div>
    )
}

//MAIN PAGE------------------------------------------------

function ResultPage() {
    const router = useRouter()
    const { gameId } = router.query

    //get syncTeamsData from local storage
    const syncTeamsData = JSON.parse(localStorage.getItem('syncTeamsData'))

    const [teamList, setTeamList] = useState(syncTeamsData)

    let topThreeTeams = []
    let restOfTeams = []

    if (teamList.length >= 3) {
        topThreeTeams = teamList.slice(0, 3)
        // Get the rest of the team
        restOfTeams = teamList.slice(3, teamList.length)
    } else {
        restOfTeams = teamList
    }

    return (
        <div className="flex flex-auto flex-col h-screen mx-8">
            {/* Text Header */}
            <div className="px-4 pt-4 w-full justify-end">
                <h2 className="text-4xl font-light"> Result</h2>
                <hr className="mb-0 mt-3" />
            </div>
            <Image
                className="absolute top-4 right-4 w-1/12 h-1/12 object-fill z-20 md:hidden sm:hidden xs:hidden"
                src={educationPack}
                alt="education pack"
            />
            <div className="flex flex-col justify-center ">
                {/* Result Body */}
                {/* First Part: 3 first teams with the highest score */}
                {topThreeTeams.length > 0 && (
                    <RenderTopThree topThree={topThreeTeams} />
                )}

                {/* Second Part: Leaderboard */}
                {restOfTeams.length > 0 && (
                    <table className="min-w-max w-full table-auto mt-10 max-w-8xl">
                        <TableHeaderResult />
                        <tbody className="text-gray-600 text-md xs:text-sm 2xl:text-lg font-light">
                            {restOfTeams.map((team, index) => (
                                <TableRowResult
                                    key={team.id}
                                    team={team}
                                    rank={
                                        topThreeTeams.length > 0
                                            ? index + 4
                                            : index + 1
                                    }
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Third Part: Save and Continue Button */}
            <div className="flex justify-end my-4 mr-10">
                <button
                    className="bg-blue-500 hover:bg-blue-600 rounded-md my-8 mx-4 flex flex-row items-center"
                    onClick={() => {
                        //reset the buttonStatus and isSync in teamList first
                        teamList.forEach((team) => {
                            team.buttonStatus = 'Pending'
                            team.isSync = false
                        })

                        //TODO: Update the syncTeamsData to teamList in firebase
                        updateGameData(gameId, teamList)
                            .then(() => {
                                console.log('update team data successfully')
                                //TODO: reset everything after update

                                //reset the team list
                                setTeamList([])
                                //clear the local storage and redirect to home page
                                window.localStorage.clear()
                                router.push('/')
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                            .finally(console.log('finally'))
                        // //reset the team list
                        // setTeamList([])

                        // //clear the local storage and redirect to home page
                        // window.localStorage.clear()

                        // router.push('/')
                    }}
                >
                    <i className="fa-solid fa-floppy-disk mx-3 text-white"></i>
                    <span className=" text-white font-medium text-xl xs:text-sm justify-center py-2 pr-2">
                        Save and Continue
                    </span>
                </button>
            </div>
        </div>
    )
}

export default ResultPage
