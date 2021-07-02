import React, { useState, useEffect } from 'react'
import { db } from "../firebase";
//import { useAuth } from "../contexts/AuthContext";
import {useParams} from "react-router";

import TaskForm from './TaskForm'
import { toastError, AskYesNo, toastSuccess } from '../toast';

import './Tasklist.css'

const Tasklist = () => {
    const [idEditando, setIdEditando] = useState('')
    const [tasks, setTasks] = useState([])
    const [tasklistTitle, setTasklistTitle] = useState('')

    const {tasklistId} = useParams()

    const getImportance = (importance) => {
        switch(importance){
            case 1: return 'todo'
            case 2: return 'important'
            case 3: return 'urgent'
            default: return 'todo'
        }
    }


    const getTasks = () => {
        db.collection('tasks').where('tasklistId','==',tasklistId).onSnapshot(querySnapshot => {
            const arrayTasks = []
            querySnapshot.forEach(doc => {
                const task = doc.data()
                task.id = doc.id
                arrayTasks.push(task)
            })
            arrayTasks.sort((a,b) => b.importance - a.importance)
            setTasks(arrayTasks)
        })

    }

    const changeDone = async (id, actualDone) => {
        try{
            await db.collection('tasks').doc(id).update({done: !actualDone})
        }
        catch(err){
            const {message} = err
            toastError(message)
        }
    }

    const deleteTask = async (id, title) => {
        try{
            const result = await AskYesNo('Cuidado',`¿Seguro/a que quieres borrar "${title}"?`)
            if(result.isConfirmed){
                await db.collection('tasks').doc(id).delete()
                toastSuccess('Tarea eliminada')
            }
        }
        catch(err){
            const {message} = err
            toastError(message)
        }
    }

    const changeImportance = async (id, actualImportance, howMuch) => {
        try{
            const inferiorLimit = 1
            const superiorLimit = 3

            let newImportance = actualImportance + howMuch
            if(newImportance < inferiorLimit) newImportance = inferiorLimit
            if(newImportance > superiorLimit) newImportance = superiorLimit

            if(newImportance !== actualImportance){
                await db.collection('tasks').doc(id).update({importance: newImportance})
            }
        }
        catch(err){
            const {message} = err
            toastError(message)
        }
    }

    const getTasklistTitle = async () => {
        const doc = await db.collection('tasklists').doc(tasklistId).get()
        const tasklist = doc.data()
        setTasklistTitle(tasklist.title)
    }

    useEffect(() => {
        getTasklistTitle()
        getTasks()

        // eslint-disable-next-line
    },[])
    
    return <>
        <h1>{tasklistTitle}</h1>
        <TaskForm idEditando={idEditando} setIdEditando={setIdEditando}/>
        <h3>Tareas pendientes:</h3>
        {
            // incompleted tasks
            tasks.filter(task => !task.done).map(task => <div className="row mb-3" key={task.id}>
                <div className="col">
                    <div className={`card ${getImportance(task.importance)}`}>
                        <div className="card-header d-flex justify-content-between">
                            <div>
                                <button className="btn btn-warning btn-sm me-1" onClick={() => {setIdEditando(task.id)}}>
                                    <span className="material-icons">edit</span>
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => {deleteTask(task.id, task.title)}}>
                                    <span className="material-icons">delete</span>
                                </button>
                            </div>
                            <div>
                                <button className="btn btn-info btn-sm me-1" onClick={() => {changeImportance(task.id, task.importance, 1)}}>
                                    <span className="material-icons">arrow_upward</span>
                                </button>
                                <button className="btn btn-info btn-sm" onClick={() => {changeImportance(task.id, task.importance, -1)}}>
                                    <span className="material-icons">arrow_downward</span>
                                </button>
                            </div>
                        </div>
                        <div className="card-body d-flex justify-content-between">
                            <h5 className="card-title">{task.title}</h5>
                            <input className="form-check-input" type="checkbox" checked={task.done} onChange={()=>{changeDone(task.id,task.done)}} />
                        </div>
                    </div>
                </div>
            </div>)
        }
        <h3>Tareas terminadas:</h3>
        {
            // completed tasks
            tasks.filter(task => task.done).map(task => <div className="row mb-3" key={task.id}>
                <div className="col">
                    <div className={`card ${getImportance(task.importance)}`}>
                        <div className="card-header d-flex justify-content-between">
                            <button className="btn btn-warning btn-sm" onClick={() => {setIdEditando(task.id)}}>
                                <span className="material-icons">edit</span>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => {deleteTask(task.id, task.title)}}>
                                <span className="material-icons">delete</span>
                            </button>
                        </div>
                        <div className="card-body d-flex justify-content-between">
                            <h5 className="card-title">{task.title}</h5>
                            <input className="form-check-input" type="checkbox" checked={task.done} onChange={()=>{changeDone(task.id,task.done)}} />
                        </div>
                    </div>
                </div>
            </div>)
        }
    </>
}

export default Tasklist