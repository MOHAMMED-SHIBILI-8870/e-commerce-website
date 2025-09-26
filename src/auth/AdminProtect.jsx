import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function AdminProtect({children}) {
    let admin=localStorage.getItem("admin")
    let conv=JSON.parse(admin);
let nav=useNavigate()
useEffect(()=>{
    let res=axios.get(`http://localhost:5000/Admin?email=${conv.email}&password=${conv.password}`)
    if(res[0]?.length>0){
      nav('/login')
    }

})
  return children
}

export default AdminProtect