import React, { useState } from 'react'

import Router, { useRouter } from 'next/router'
import { Leaderboard, QuestionModal } from '../../components'
import {
    // syncTeamsData,
    writeData,
} from '../../constant/constants'

//Path:(new path: ../game/[gameid])
function GameScreen() {
    const router = useRouter()

    const { gameId } = router.query
    console.log('gameId from game page:', gameId)

    //get syncTeamsData from local storage
    const syncTeamsData = JSON.parse(
        window.localStorage.getItem('syncTeamsData')
    )

    const [teamsList, setTeamsList] = useState(syncTeamsData)
    return (
        <div className="flex flex-auto flex-col h-screen">
            {/* Text Header */}
            <div className="px-4 pt-4 w-full justify-end">
                <h2 className="text-4xl font-light"> Lets play Blue & Go!</h2>
                <hr className="mb-0 mt-3" />
            </div>

            {/* Game Body */}
            <div className="flex-auto flex flex-col flex-wrap">
                {/* Question Modal */}
                <div className="flex justify-center mt-4 mx-auto">
                    <QuestionModal
                        teamsList={teamsList}
                        setTeamsList={setTeamsList}
                    />
                </div>
                {/* Game Table */}
                <Leaderboard
                    teamsList={teamsList}
                    setTeamsList={setTeamsList}
                />
            </div>

            {/* //Add a button to save and continue to result page */}
            <div className="flex justify-end my-4 mr-10">
                <button
                    className="bg-red-500 hover:bg-red-600 rounded-md my-3 flex flex-row items-center"
                    onClick={() => {
                        console.log('current team list:', teamsList)
                        // set the button status 3, team id 0 for all the teams
                        teamsList.forEach(() => {
                            writeData(0, 3)
                        })

                        //save the data to local storage
                        window.localStorage.setItem(
                            'syncTeamsData',
                            JSON.stringify(teamsList)
                        )
                        router.push({
                            pathname: `/results/${gameId}`,
                            query: { gameId: gameId },
                        })
                    }}
                >
                    <i className="fa-solid fa-flag-checkered mx-3 text-white"></i>
                    <span className=" text-white font-medium justify-center py-2 pr-2">
                        End Session
                    </span>
                </button>
            </div>
        </div>
    )
}

export default GameScreen
