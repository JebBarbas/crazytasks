import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import 'firebase/firestore'

const app = firebase.initializeApp({
    apiKey: "AIzaSyAAzIqfzgnB7UAYgHcBWTVQLecnG5tO1nw",
    authDomain: "crazytasks.firebaseapp.com",
    projectId: "crazytasks",
    storageBucket: "crazytasks.appspot.com",
    messagingSenderId: "896063437417",
    appId: "1:896063437417:web:1691a11365a50a49e240f8",
    measurementId: "G-33QH3CDLX1"
})
app.analytics()

export const auth = app.auth()
export const db = app.firestore()

export const googleProvider = new firebase.auth.GoogleAuthProvider()

export default app