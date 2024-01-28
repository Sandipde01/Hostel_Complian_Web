import { initializeApp } from "firebase/app";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB7ndrPs4NHWQGsVfwAPNxnZr7R_5Y4l5s",
  authDomain: "college-hostel-project.firebaseapp.com",
  projectId: "college-hostel-project",
  storageBucket: "college-hostel-project.appspot.com",
  messagingSenderId: "177104720898",
  appId: "1:177104720898:web:2ef6d931941e6d3309431b",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();

export const cretaeuserDocumentFromAuth = async (userAuth) => {
  const userDocRef = doc(db, "students", userAuth.id);
  const userSnapshot = await getDoc(userDocRef);
  const userDocCollege = doc(db, "college", userAuth.id);
  const docSnapCollege = await getDoc(userDocCollege);

  const { name, ph } = docSnapCollege.data();

  if (!userSnapshot.exists()) {
    const { id, password, room } = userAuth;
    const createAt = new Date();
    const complaine = [];
    try {
      const encryptPassword = await bcrypt.hash(password, 10);
      await setDoc(userDocRef, {
        id,
        name,
        password: encryptPassword,
        room,
        ph,
        complaine,
        createAt,
      });

    } catch (err) {
      console.log("erroor on set data");
    }
  }
  return userDocRef;
};
export const cretaeAdminDocumentFromAuth = async (userAuth) => {
  const adminDocRef = doc(db, "college", userAuth.id);
  const adminSnapshot = await getDoc(adminDocRef);
  const adminDoc = doc(db, "admin", userAuth.id);
  const adminSnap = await getDoc(adminDoc);
  const { name} = adminSnapshot.data();

  if (!adminSnap.exists()) {
    const { id, password } = userAuth;
    const createAt = new Date();
    try {
      const encryptPassword = await bcrypt.hash(password, 10);
      await setDoc(adminDoc, {
        id,
        name,
        password: encryptPassword,
        createAt,
      });
    } catch (err) {
      console.log("erroor on set admin data");
    }
  }
  return adminSnapshot;
};

export const getDataFromDocument = async (userAuth) => {
  try {
    const userDoc = doc(db, "students", userAuth.id);
    const docSnap = await getDoc(userDoc);
    const userDocCollege = doc(db, "college", userAuth.id);
    const docSnapCollege = await getDoc(userDocCollege);
    if (!docSnap.exists()) {
      return {
        success: false,
        message: "Invalid User",
      };
    }

    const checkPassword = await bcrypt.compare(
      userAuth.password,
      docSnap.data().password
    );
    if (docSnap.exists() && checkPassword) {
      const {room, complaine, ph} = docSnap.data();
      const {id, name} = docSnapCollege.data()
      const userdata = {
        id,
        name,
        room,
        complaine,
        ph
      }
      return {
        success: true,
        data: userdata,
      };
    } else {
      return {
        success: false,
        message: "Check user and Password",
      };
    }
  } catch (err) {
    console.log(err);
  }
};

export const getDataFromComplaine = async (userAuth) => {
  try {
    const userDoc = doc(db, "students", userAuth.id);
    const docSnap = await getDoc(userDoc);
      return {
        id:userAuth.id,
        success: true,
        data: docSnap.data().complaine,
      };
  } catch (err) {
    console.log(err);
  }
};
export const getDataFromDocumentadmin = async (userAuth) => {
  try {
    const userDoc = doc(db, "admin", userAuth.id);
    const docSnap = await getDoc(userDoc);
    if (!docSnap.exists()) {
      return {
        success: false,
        message: "Invalid Admin",
      };
    }

    const checkPassword = await bcrypt.compare(
      userAuth.password,
      docSnap.data().password
    );
    if (docSnap.exists() && checkPassword) {
      const data = docSnap.data();
      data.password = undefined;
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        message: "Check user and Password",
      };
    }
  } catch (err) {
    console.log(err);
  }
};

export const checkUserInfo = async (userAuth) => {
  const userDocCollege = doc(db, "college", userAuth.id);
  const docSnapCollege = await getDoc(userDocCollege);
  const userDoc = doc(db, "students", userAuth.id);
  const docSnap = await getDoc(userDoc);
  
  if (!docSnapCollege.exists()) {
    return {
      success: true,
      message: "You are not the college student",
    };
  } else if (docSnapCollege.data().admin) {
    return {
      success: true,
      message: "You are a admin go to admin",
    };
  } else if (docSnapCollege.exists() && docSnap.exists()) {
    return {
      success: true,
      message: "User Already registered",
    };
  } else {
    return {
      success: false,
    };
  }
};
export const checkAdminInfo = async (userAuth) => {
  const adminDocCollege = doc(db, "college", userAuth.id);
  const admindocSnapCollege = await getDoc(adminDocCollege);
  const adminDoc = doc(db, "admin", userAuth.id);
  const admindocSnap = await getDoc(adminDoc);
  if (!admindocSnapCollege.exists()) {
    return {
      success: true,
      message: "You are not the college student",
    };
  } else if (!admindocSnapCollege.data().admin) {
    return {
      success: true,
      message: "You are not an admin go to student section",
    };
  } else if (admindocSnap.exists()) {
    return {
      success: true,
      message: "User Already registered",
    };
  } else {
    return {
      success: false,
      message: "Succefully registered",
    };
  }
};

export const getAllStudentData = async () => {
  const getsnap = collection(db, "students");
  const querySnapshot = await getDocs(getsnap);
  let data = [];
  querySnapshot.docs.forEach((doc) => {
    data.push({ ...doc.data() });
  });

  data.forEach((d) => {
    d.password = undefined;
  });
  return data;
};


export const setComplaine = async (userAuth) => {
  try {
    const userDoc = doc(db, "students", userAuth.id);
    const docSnap = await getDoc(userDoc);
    if (!docSnap.exists()) {
      return {
        success: false,
        message: "You are not the college student",
      };
    }
    const createAt = new Date();
    const { id, password, name, room, complaine,ph } = docSnap.data();
    const complaines = [];
    const newComplaint = {
      type: userAuth.ctype,
      description: userAuth.description,
    };
    complaines.push(...complaine, newComplaint);
    await setDoc(userDoc, {
      id,
      password,
      room,
      createAt,
      name,
      ph,
      complaine: complaines,
    });
    const userDocUpdate = doc(db, "students", userAuth.id);
    const docSnapUpdate = await getDoc(userDocUpdate);
    return {
      success: true,
      message: "successfully updated",
      data: docSnapUpdate.data(),
    };
  } catch (err) {
    console.log("problem on set Complaine");
  }
};

export const deleteData = async (userAuth) => {
  try {
    const userDoc = doc(db, "students", userAuth.id);
    const docSnap = await getDoc(userDoc);
    if (!docSnap.exists()) {
      return {
        success: false,
        message: "You are not the college student",
      };
    }
    const createAt = new Date();
    const { id, password, name, room, complaine, ph} = docSnap.data();
    complaine.splice(userAuth.index, 1);
    await setDoc(userDoc, {
      id,
      password,
      room,
      createAt,
      name,
      ph,
      complaine
    });
    const userDocUpdate = doc(db, "students", userAuth.id);
    const docSnapUpdate = await getDoc(userDocUpdate);
    return {
      success: true,
      message: "successfully deleted",
      data: docSnapUpdate.data(),
    };
  } catch (err) {
    console.log("problem on set Complaine");
  }
};
