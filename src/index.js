import{initializeApp} from 'firebase/app'
import{
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy,serverTimestamp,
    getDoc,updateDoc
}from 'firebase/firestore'
import{
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAXwQ9dSvvBJMj6BmYlglUr8lej5Y-eI74",
    authDomain: "prvi-projekat-1d44b.firebaseapp.com",
    projectId: "prvi-projekat-1d44b",
    storageBucket: "prvi-projekat-1d44b.appspot.com",
    messagingSenderId: "403295112618",
    appId: "1:403295112618:web:6742decf11de8a46b7afd3"
  };
//   init firebase app

initializeApp(firebaseConfig)

//   init services
const db = getFirestore()
const auth = getAuth()


//   collection ref 
const colRef = collection(db, 'books')

// queries 
const q = query(colRef, orderBy('createdAt'))





// real time data 
const unsubCol = onSnapshot(q, (snapshot)=>{
    let books = []
    snapshot.docs.forEach((doc)=>{
     books.push({...doc.data(), id:doc.id})
    })
    console.log(books)
})

// adding documents 

const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addBookForm.reset()
    })
})


// deleting documents 

const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books',deleteBookForm.id.value)
    deleteDoc(docRef)
    .then(()=>{
        deleteBookForm.reset()
    })
})

// get a single document 


const docRef = doc(db, "books", "suHV2E5QHcxxtReg1WCC");


   const unsubDoc = onSnapshot(docRef, (doc)=>{
        console.log(doc.data(), doc.id)
    })


    // updating a document 

    const updateForm = document.querySelector('.update')
    updateForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        const docRef= doc(db, 'books',updateForm.id.value)

        updateDoc(docRef,{
            title:'updated title'
        })
        .then(()=>{
            updateForm.reset()
        })


    })

    // singning users up 

    const signupForm = document.querySelector('.signup')
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const email= signupForm.email.value
        const password = signupForm.password.value

        createUserWithEmailAndPassword(auth,email,password)
        .then((cred)=>{
            // console.log('user created:', cred.user)
            signupForm.reset()
        })
        .catch((err) => {
            console.log(err.message);
        })
    })

    // logging in and out 

    const logoutButton = document.querySelector('.logout')
    logoutButton.addEventListener('click',()=>{
    signOut(auth)
        .then(()=>{
            // console.log('the user signed out')
         })
         .catch(()=>{
            console.log(err.message)
         })
    })

    const loginForm = document.querySelector('.login')
    loginForm.addEventListener('submit', ()=>{
        e.preventDefault()
        const email = loginForm.email.value
        const pssword = loginForm.password.value

        signInWithEmailAndPassword(auth,email,password)
        .then(()=>{
            // console.log('user logged in', cred.user)
        })
        .catch(()=>{
            console.log(err.message)
        })
    })

// subscribing to auth changes 

const unsubAuth = onAuthStateChanged(auth, (user)=>{
    console.log('user status changed:', user)

})

// unsubscribing from  changes (db&auth) 
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', ()=>{
    unsubCol() 
    unsubDoc()
    unsubAuth()
})