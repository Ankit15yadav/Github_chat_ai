// Import the functions you need from the SDKs you need
import { rejects } from "assert";
import { error } from "console";
import { set } from "date-fns";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyA1bP3zsAdwjbFovX85l2UVO5nCJKolKjM",
    authDomain: "github-ai-c3a15.firebaseapp.com",
    projectId: "github-ai-c3a15",
    storageBucket: "github-ai-c3a15.firebasestorage.app",
    messagingSenderId: "849936995503",
    appId: "1:849936995503:web:b14dbfba4a73f289f9705a",
    measurementId: "G-EPJXL0M0D9"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export async function uploadFile(file: File, setProgress?: (progress: number) => void) {
    return new Promise((resolve, reject) => {
        try {
            const storageRef = ref(storage, file.name)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on('state_changed', snapshot => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                if (setProgress) setProgress(progress)

                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused'); break;
                    case 'running':
                        console.log('Upload is running'); break;
                }
            }, error => {
                reject(error)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
                    resolve(downloadUrl)
                })
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })

}