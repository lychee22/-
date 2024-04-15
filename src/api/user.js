import { dataType } from 'element-plus/es/components/table-v2/src/common.mjs';
import axios from '~/util/axios'
export function login(userName,userPwd) {
    return axios.post('/user/login', {
        userName,
        userPwd
    })
}
export function adduser(userName,userPwd) {
    let formData = new FormData();
    formData.append("userName", userName);
    formData.append("userPwd", userPwd);
    return axios.post('/user/insert', formData)
}
export function updateuser(formData) {
    //可以将form表单直接放入构造器，自动封装
    return axios({
        method: 'post',
        url:'/user/update', 
        data:formData,
        dataType: 'json',
        Headers: {
            "Content-type": "application/json"
        }
    })
}