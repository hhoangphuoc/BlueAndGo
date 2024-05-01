import React, { useState, useEffect, useCallback } from 'react'

import { writeData, reader } from '../constant/constants'

export default function QuestionModal({ teamsList, setTeamsList }) {
    //states
    const [showModal, setShowModal] = useState(false)
    const [isClicked, setIsClicked] = useState(false)

    const [team, setTeam] = useState({})

    //create a new course and updated the courses
    function handleClose(e) {
        if (e.target.id === 'wrapper') {
            setShowModal(false)
        }
    }
    const updatePoint = useCallback(
        (teamId, point) => {
            const team = teamsList.find((team) => team.id === teamId)
            team.point = Math.max(team.point + point, 0)

            setTeamsList([...teamsList])
        },
        [teamsList, setTeamsList]
    )

    const handleStartQuestion = useCallback(async () => {
        //writeData to set the question state for all the buttons
        teamsList.forEach(async (team) => {
            writeData(team.id, 1)
        })
        setIsClicked(true)
        try {
            while (true) {
                const { value, done } = await reader.read()
                if (done) {
                    // |reader| has been canceled.
                    reader.releaseLock()
                    break
                }
                const teamId = value[0]

                //get the team object from the team id
                const team = teamsList.find((team) => team.id === teamId)
                setTeam(team)
                if (team) {
                    setShowModal(true)
                }
            }
        } catch (error) {
            // Handle |error|…
            console.log('error', error)
        } finally {
        }
    }, [teamsList])
    const handleStopQuestion = useCallback(async () => {
        //writeData to set the stop state for all the buttons
        teamsList.forEach(async (team) => {
            writeData(team.id, 2)
        })
        setIsClicked(false)
    }, [teamsList])

    const handleCorrectAnswer = useCallback(async () => {
        setShowModal(false)

        //write the button state to be "correct"
        writeData(team.id, 6)

        updatePoint(team.id, 100)
        //when correct answer, switch to start button
        setIsClicked(false)
    }, [team, updatePoint])
    const handleWrongAnswer = useCallback(async () => {
        setShowModal(false)
        //write the button state to be "wrong"
        writeData(team.id, 7)

        updatePoint(team.id, -50)
    }, [team, updatePoint])

    //BUTTONS COMPONENTS
    const StartQuestionButton = () => {
        return (
            <button
                id="question"
                className="px-4 bg-blue-500 p-3 rounded-lg text-white hover:bg-blue-600 font-semibold"
                type="button"
                onClick={
                    //start with the button on interface
                    handleStartQuestion
                }
            >
                Start the question
            </button>
        )
    }
    const StopQuestionButton = () => {
        return (
            <button
                id="stop"
                className="px-4 bg-red-500 p-3 rounded-lg text-white hover:bg-red-600 font-semibold"
                type="button"
                //stop with the button on interface
                onClick={handleStopQuestion}
            >
                Stop the question
            </button>
        )
    }

    const handleKeyDown = useCallback(
        async (e) => {
            console.log('e.key', e.key)
            if (e.key === 'b') {
                if (isClicked) {
                    handleStopQuestion()
                } else {
                    handleStartQuestion()
                }
            } else if (e.key === 'PageDown') {
                handleCorrectAnswer()
            } else if (e.key === 'PageUp') {
                handleWrongAnswer()
            } else {
                return
            }
        },
        [
            isClicked,
            handleStartQuestion,
            handleStopQuestion,
            handleCorrectAnswer,
            handleWrongAnswer,
        ]
    )

    //using useEffect to handle the event from keyboard, instead of using onClick
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    return (
        <>
            {isClicked ? <StopQuestionButton /> : <StartQuestionButton />}
            {showModal ? (
                <>
                    <div
                        onClick={handleClose}
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-sm"
                        id="wrapper"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-4xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200">
                                    <h3 className="text-3xl font-semibold select-none">
                                        Questions
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
                                <div className="flex flex-col justify-between h-full">
                                    {/* Bell Icon */}
                                    <i
                                        className="fa-solid fa-bell-concierge w-56 h-56 mx-auto mt-4 text-blue-500"
                                        style={{ fontSize: '12rem' }}
                                    />
                                    <div className="flex-col justify-center">
                                        <p className="text-xl text-gray-800 mt-2 px-6 font-bold">
                                            Congrats!{' '}
                                            <span className=" text-blue-500">
                                                #{team.teamName}
                                            </span>{' '}
                                            has pressed the button first!
                                        </p>
                                        <p className="mb-4 px-6 py-2 text-md text-gray-600">
                                            You are the fastest team. But are
                                            you also the smartest?
                                        </p>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="bg-red-500 text-white hover:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 select-none"
                                        type="button"
                                        onClick={handleWrongAnswer}
                                    >
                                        Wrong Answer
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 select-none"
                                        type="button"
                                        onClick={handleCorrectAnswer}
                                    >
                                        Correct Answer
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
