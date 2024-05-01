import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    getFirestore,
    addDoc,
    collection,
    query,
    limit,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    where,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore'

//get storage from firebase
import { getStorage } from 'firebase/storage'

import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_APPID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
}

const app = initializeApp(firebaseConfig, 'BlueAndGo')

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

let userRef
let courseCollection

onAuthStateChanged(auth, (user) => {
    try {
        if (user) {
            userRef = doc(db, 'users', user.uid)
            courseCollection = collection(userRef, 'courses')
        }
    } catch (error) {
        alert('No user found. Please login again.')
        console.log('error: ', error)
    }
})

// FIREBASE FUCTIONS ---------------------------------------------

//get all courses from firebase
export async function getAllCourses() {
    const coursesData = []
    const courses = await getDocs(courseCollection)
    courses.forEach((doc) => {
        coursesData.push(doc.data())
    })
    return coursesData
}

export async function getAllUnfinishedCourses() {
    const coursesData = []
    const q = query(courseCollection, where('done', '==', false))
    const courses = await getDocs(q)
    courses.forEach((doc) => {
        coursesData.push(doc.data())
    })

    return coursesData
}

//get all finished courses from firebase
export async function getAllFinishedCourses() {
    const coursesData = []
    const q = query(courseCollection, where('done', '==', true))
    const courses = await getDocs(q)
    courses.forEach((doc) => {
        coursesData.push(doc.data())
    })

    return coursesData
}

//get course by docRef id
export async function getCourseByDocumentId(documentId) {
    const courseDoc = await getDoc(doc(db, 'courses', documentId))
    console.log('courseDoc: ', courseDoc.data())
    return courseDoc.data()
}

//get course by course id inside course document
export async function getCourseById(courseId, setCourse) {
    const q = query(courseCollection, where('id', '==', courseId), limit(1))
    onSnapshot(q, (querySnapshot) => {
        querySnapshot.docs.map((doc) => {
            console.log(`Course getting by id:`, doc.data())
            setCourse(doc.data())
        })
    })
}

//adding new course to firebase
export async function addNewCourse(title) {
    const teams = []
    for (let i = 1; i <= 5; i++) {
        const team = {
            id: i,
            teamName: `Team ${i}`,
            buttonStatus: 'Pending',
            isSync: false,
            point: 0,
        }
        teams.push(team)
    }
    const courses = await getDocs(courseCollection)

    // const id = courses.size == 0 ? 0 : courses.size + 1
    const uuid = uuidv4() // Generate a new UUIDv4
    const hashId = crypto.createHash('sha256').update(uuid).digest('hex') // Encrypt the UUIDv4 with SHA-256
    const newCourse = {
        // id: id.toString(),
        // id: uuidv4(),
        id: hashId,
        title: title,
        createdAt: serverTimestamp(),
        teams: teams,
        done: false,
    }
    const docRef = await addDoc(courseCollection, newCourse)
    console.log('Document written with ID: ', docRef)

    return docRef
}

//delete course by course id and title
export async function deleteCourseByIdTitle(courseId, courseTitle) {
    const q = query(
        courseCollection,
        where('id', '==', courseId),
        where('title', '==', courseTitle),
        limit(1)
    )
    onSnapshot(q, (querySnapshot) => {
        querySnapshot.docs.map(async (doc) => {
            const docRef = doc.ref
            await deleteDoc(docRef)
        })
    })
}

//update team data in firebase by course id
export async function updateGameData(gameId, teamsData) {
    let newTeams = []
    try {
        const q = query(courseCollection, where('id', '==', gameId), limit(1))
        onSnapshot(q, (querySnapshot) => {
            querySnapshot.docs.map(async (courseDoc) => {
                const teams = courseDoc.data().teams

                newTeams = teams.map((team) => {
                    //overwrite team data with new data or keep the same
                    const newTeam =
                        teamsData.find((t) => t.id == team.id) || team
                    return newTeam
                })
                //update course document in firebase
                const docRef = doc(db, 'courses', courseDoc.id)
                //parsing data to update
                const data = {
                    teams: newTeams,
                    done: true,
                }
                await updateDoc(docRef, data).then(() => {
                    console.log('Document successfully updated!')
                })
            })
        })
    } catch (error) {
        console.log('error: ', error)
    }

    // const q = query(courseCollection, where('id', '==', gameId), limit(1))
    // onSnapshot(q, (querySnapshot) => {
    //     querySnapshot.docs.map(async (courseDoc) => {
    //         const teams = courseDoc.data().teams

    //         newTeams = teams.map((team) => {
    //             //overwrite team data with new data or keep the same
    //             const newTeam = teamsData.find((t) => t.id == team.id) || team
    //             return newTeam
    //         })
    //         //update course document in firebase
    //         const docRef = doc(db, 'courses', courseDoc.id)
    //         //parsing data to update
    //         const data = {
    //             teams: newTeams,
    //             done: true,
    //         }
    //         await updateDoc(docRef, data).then(() => {
    //             console.log('Document successfully updated!')
    //         })
    //     })
    // })
}

//get teams data in one course by course id
export async function getTeamsByCourseId(courseId, setTeamsData) {
    const q = query(courseCollection, where('id', '==', courseId), limit(1))
    onSnapshot(q, (querySnapshot) => {
        querySnapshot.docs.map((doc) => {
            console.log(`Course getting by id:`, doc.data())
            setTeamsData(doc.data().teams)
        })
    })
}
