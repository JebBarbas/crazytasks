import React, {useState, useEffect} from 'react'
import { db } from '../firebase'

import { useAuth } from '../contexts/AuthContext'

import { toastError, toastSuccess } from '../toast'

const TasklistForm = ({idEditando, setIdEditando}) => {
    const {currentUser} = useAuth()

    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)

    const submitForm = (e) => {
        e.preventDefault()
        setLoading(true)

        const tasklist = {
            title,
            /* Esto servia para guardar como referencia
            styleId: db.doc(`styles/${styleId}`),
            userId: db.doc(`users/${currentUser.uid}`)
            */
           userId: currentUser.uid
        }

        if(idEditando === ''){
            addTasklist(tasklist)
        }
        else{
            editTasklist(tasklist)
        }
    }

    const editTasklist = async (tasklistObject) => {
        try{
            await db.collection('tasklists').doc(idEditando).update(tasklistObject)
            toastSuccess('Lista editada')
        }
        catch(err){
            const {message} = err
            toastError(message)
        }

        setIdEditando('')
        setLoading(false)
    }

    const addTasklist = async (tasklistObject) => {
        try{
            await db.collection('tasklists').doc().set(tasklistObject)
            toastSuccess('Lista añadida')
        }
        catch(err){
            const {message} = err
            toastError(message)
        }

        setTitle('')
        setLoading(false)
    }

    const getTasklistById = async (id) => {
        const doc = await db.collection('tasklists').doc(id).get()
        setTitle(doc.data().title)
    }

    useEffect(() => {
        if(idEditando === ''){
            setTitle('')
        }
        else{
            getTasklistById(idEditando)
        }
    },[idEditando])

    return <>
        <form onSubmit={submitForm}>
            <div className="input-group mb-3">
                <span className="input-group-text material-icons">title</span>
                <input type="text" className="form-control" value={title} placeholder="Título de tasklist" required onChange={e => {setTitle(e.target.value)}}/>
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

export default TasklistForm
