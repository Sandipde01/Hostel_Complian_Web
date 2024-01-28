import {
  checkAdminInfo,
  checkUserInfo,
  cretaeAdminDocumentFromAuth,
  cretaeuserDocumentFromAuth,
  deleteData,
  getAllStudentData,
  getDataFromComplaine,
  getDataFromDocument,
  getDataFromDocumentadmin,
  setComplaine,
} from "../db_config/db.js";

export const userRegister = async (req, res) => {
  try {
    const userInfo = await checkUserInfo(req.body);
    if (userInfo.success) {
      const err = {
        success: false,
        message: userInfo.message,
      }
      res.render("error.ejs",{err})
    } else {
    await cretaeuserDocumentFromAuth(req.body);
     const data = await getDataFromDocument(req.body)
      const info = {success:true,data:data.data}
    res.render("viewpage.ejs",{
      info 
    });
    }
  } catch (err) {
    console.log("Error in registering the user");
  }
};
export const adminRegister = async (req, res) => {
  try { 
    const adminInfo = await checkAdminInfo(req.body);
    if (adminInfo.success) {
      const err = {
        success: false,
        message: adminInfo.message,
      }
      res.render("error.ejs",{err})
    } else {
      await cretaeAdminDocumentFromAuth(req.body);
      const newData = await getAllStudentData();
      res.render("admin_complain.ejs",{newData});
    }
  } catch (err) {
    console.log("Error in registering the user");
  }
};

export const userLogin = async (req, res) => {
  const data = await getDataFromDocument(req.body);
  if (!data.success) {
    const err = {
      success: false,
      message: data.message,
    }
    res.render("error.ejs",{err})
  } else {
    const info = {success:true,data:data.data}
   
    res.render("viewpage.ejs",{
      info 
    });
   
  }
};
export const adminLogin = async (req, res) => {
  const data = await getDataFromDocumentadmin(req.body);
  if (!data.success) {
    const err = {
      success: false,
      message: data.message,
    }
    res.render("error.ejs", {err});
  } else {
    const newData = await getAllStudentData();
    res.render("admin_complain.ejs",{newData});
  }
};

export const getData = async (req, res) => {
  const allData = await getAllStudentData();
  res.status(200).json({ allData });
};

export const complaine = async (req, res) => {
  const id = req.body.id;
  const obj = await setComplaine(req.body);
  if (!obj.success) {
    const err = { 
      success: false,
      message: obj.message,
    }
    res.render("error.ejs",{err})   
  } else {
    res.redirect(`/viewusercomplain/${id}`); 
  } 
};
export const deleteDataFromDb = async (req, res) => {
  const obj = await deleteData(req.body);
  if (!obj.success) {
    const err = {
      success: false,
      message: obj.message,
    }
    res.render("error.ejs",{err})
  } else {
    res.status(200).json({
      success: obj.success,
      message: obj.message,
      data: obj.data,
    });
  }
};
 
export const view = (req, res) => {
  
  res.render("student_register.ejs");
  
}

export const main = (req, res) => {
  
  res.render("index.ejs");
  
}

export const viewLogin = (req, res) => {
  
  res.render("login.ejs");
  
}

export const viewRegister = (req, res) => {
  
  res.render("student_register.ejs");
  
}


export const viewadminLogin = (req, res) => {
  
  res.render("admin_login.ejs");
  
}

export const viewadminRegister = (req, res) => {
  
  res.render("admin_register.ejs");
  
}

  
export const viewComplain =async (req, res) => {
   const datas = await getDataFromComplaine(req.params)
 res.render("complain.ejs", {data:datas.data, id: datas.id})
   
}
 
  
export const contact = (req, res) => {
  
  res.render("contact.ejs");
  
}


export const about = (req, res) => {
  
  res.render("about.ejs");
  
}


export const deleteDataCom = async (req, res) => {
  const ress = await deleteData(req.params);
  res.redirect(`/viewusercomplain/${req.params.id}`); 
  
}
