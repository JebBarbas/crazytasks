import React, {useEffect, useState} from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router";

import { AskYesNo, toastSuccess, toastError } from "../toast";

import TasklistForm from "./TasklistForm";

import './Tasklists.css'

const Tasklists = () => {
    const {currentUser} = useAuth()

    const history = useHistory()

    const [tasklists, setTasklists] = useState([])
    const [idEditando, setIdEditando] = useState('')

    const getTasklists = () => {
        db.collection('tasklists').where('userId','==',currentUser.uid).onSnapshot(querySnapshot => {
            const arrayTasklists = []
            querySnapshot.forEach(doc => {
                const tasklist = doc.data()
                tasklist.id = doc.id

                //const styleInfo = tasklist.styleId.get()
                //console.log(styleInfo)
                //tasklist.style = styleInfo.data()

                arrayTasklists.push(tasklist)
            })
            arrayTasklists.sort((a,b) => {
                if(a.title < b.title) return -1
                if(a.title > b.title) return 1
                return 0
            })
            setTasklists(arrayTasklists)
        })

    }

    const deleteTasklist = async (id, title) => {
        try{
            const result = await AskYesNo('Cuidado',`¿Seguro/a que quieres borrar "${title}"?`)
            if(result.isConfirmed){
                await db.collection('tasklists').doc(id).delete()

                // borrar tasks que lleve dentro
                const tasks = await db.collection('tasks').where('tasklistId','==',id).get()
                tasks.forEach(async doc => {
                    await db.collection('tasks').doc(doc.id).delete()
                })
                toastSuccess('Tasklist eliminada')
            }
        }
        catch(err){
            const {message} = err
            toastError(message)
        }
    }

    useEffect(() => {
        getTasklists()

        // eslint-disable-next-line
    },[])

    return <>
        <h1>Mis listas de tareas</h1>
        <TasklistForm idEditando={idEditando} setIdEditando={setIdEditando}/>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
            {
                tasklists.map(tasklist => <div className="col" key={tasklist.id}>
                    <div className="card mb-3">
                        <div className="card-header d-flex justify-content-between">
                            <button className="btn btn-warning btn-sm" onClick={() => {setIdEditando(tasklist.id)}}>
                                <span className="material-icons">edit</span>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => {deleteTasklist(tasklist.id, tasklist.title)}}>
                                <span className="material-icons">delete</span>
                            </button>
                        </div>
                        <div className="card-body tasklist" role="button" onClick={() => {history.push(`/list/${tasklist.id}`)}}>
                            <h5 className="card-title">{tasklist.title}</h5>
                        </div>
                    </div>
                </div>)
            }
        </div>
    </>
}

export default Tasklists