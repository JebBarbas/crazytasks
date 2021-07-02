import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router'
import { db } from '../firebase'

import { toastError, toastSuccess } from '../toast'

const TaskForm = ({idEditando, setIdEditando}) => {
    const {tasklistId} = useParams()

    const [title, setTitle] = useState('')

    const [loading, setLoading] = useState(false)

    const submitForm = (e) => {
        e.preventDefault()
        setLoading(true)

        const task = {
            title,
            importance: 1,
            done: false,
            tasklistId: tasklistId
        }

        if(idEditando === ''){
            addTask(task)
        }
        else{
            editTask(task)
        }
    }

    const editTask = async (taskObject) => {
        try{
            // para que solo actualice el titulo y no importancia ni done
            const {title} = taskObject
            await db.collection('tasks').doc(idEditando).update({title})
            toastSuccess('Tarea editada')
        }
        catch(err){
            const {message} = err
            toastError(message)
        }

        setIdEditando('')
        setLoading(false)
    }

    const addTask = async (taskObject) => {
        try{
            await db.collection('tasks').doc().set(taskObject)
            toastSuccess('Tarea añadida')
        }
        catch(err){
            const {message} = err
            toastError(message)
        }

        setTitle('')
        setLoading(false)
    }

    const getTaskById = async (id) => {
        const doc = await db.collection('tasks').doc(id).get()
        const task = doc.data()
        setTitle(task.title)
    }

    useEffect(() => {
        if(idEditando === ''){
            setTitle('')
        }
        else{
            getTaskById(idEditando)
        }
    },[idEditando])

    return <>
        <form onSubmit={submitForm}>
            <div className="input-group mb-3">
                <span className="input-group-text material-icons">title</span>
                <input type="text" className="form-control" value={title} placeholder="Título de task" required onChange={e => {setTitle(e.target.value)}}/>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {
                        loading ? <>
                            <span className="spinner-border" role="status"></span> 
                        </>
                        : <>
                            {
                                idEditando === '' ? <>
                                    <span className="material-icons me-2">add</span>
                                </>
                                : <>
                                    <span className="material-icons me-2">save</span>
                                </>
                            }
                        </>
                    }
                </button>
            </div>
        </form>
    </>
}

export default TaskForm