import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { setGlobalToken } from '../context/useAuth';
import { decodeMessage, encodeMessage } from './protoUtils';
import { message } from 'antd';
import { generateJWT } from './jwtUtils';
// import { user_id, secretkey } from './config';

const instance = axios.create({
    baseURL: window.location.origin,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/octet-stream',
    },
    responseType: 'arraybuffer'
});

// 请求拦截器，添加 JWT 到请求头并编码请求数据
instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        console.log('getUSerId----', localStorage.getItem('userId'))
        console.log('getmd5Hex----', localStorage.getItem('md5Hex'))

        if (localStorage.getItem('md5Hex') && localStorage.getItem('userId')) {
            const md5hex = localStorage.getItem('md5Hex') as string
            const t = await generateJWT(localStorage.getItem('userId') as string, md5hex);
            config.headers.Authorization = `Bearer ${t}`;
        }

        if (config.data) {
            config.data = encodeMessage('Msg', config.data);
            config.headers['Content-Length'] = config.data.length;
        }
        console.log('----request----');
        console.log(decodeMessage('Msg', config.data));
        console.log('----request----');

        return config;
    },
    (error: any) => {
        message.error('请求出错，请检查网络并重试');
        return Promise.reject(error);
    }
);

// 响应拦截器，处理 Protobuf 解码和 JWT 刷新
instance.interceptors.response.use(
    async (response: AxiosResponse) => {
        try {
            const buffer = response.data;
            console.log('------responese-----', response);
            const decodedMsg = decodeMessage('Msg', buffer);
            console.log(decodedMsg);
            response.data = decodedMsg;

            // 检查响应中的 error 字段
            if (decodedMsg.error && decodedMsg.error.errorCode === 2) {
                const originalRequest = response.config;
                try {
                    const secretkey = localStorage.getItem('md5Hex') as string
                    const userId = localStorage.getItem('userId') as string
                    // 重新生成 JWT
                    const newToken = await generateJWT(userId, secretkey);
                    // 更新全局 token
                    setGlobalToken(newToken);
                    // 更新原请求的请求头
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    // 重新发送请求
                    // return instance(originalRequest);
                } catch (refreshError) {
                    console.error('刷新 JWT 时出错:', refreshError);
                    return Promise.reject(refreshError);
                }
            }
        } catch (decodeError) {
            console.error('解码响应数据时出错:', decodeError);
        }
        return response.data;
    },
    async (error: any) => {
        // const originalRequest = error.config;
        // if (error.status === '401') {
        //     try {
        //         const secretkey = localStorage.getItem('serverkey') as string
        //         const userId = localStorage.getItem('userId') as string
        //         // 重新生成 JWT
        //         const newToken = await generateJWT(userId, secretkey);
        //         // 更新全局 token
        //         setGlobalToken(newToken);
        //         // 更新原请求的请求头
        //         originalRequest.headers.Authorization = `Bearer ${newToken}`;
        //         // 重新发送请求
        //         // return instance(originalRequest);
        //     } catch (refreshError) {
        //         console.error('刷新 JWT 时出错:', refreshError);
        //         // return Promise.reject(refreshError);
        //     }
        // }
        console.log(error)
        return Promise.reject(error);
    }
);

// 通用请求函数
function request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any): Promise<T> {
    const config: AxiosRequestConfig = {
        method,
        url,
        data
    };
    return instance(config) as Promise<T>;
}

// 封装 API 请求
const api = {
    get: <T>(url: string, params?: any): Promise<T> => request<T>('GET', url, params),
    post: <T>(url: string, data?: any): Promise<T> => request<T>('POST', url, data),
    put: <T>(url: string, data?: any): Promise<T> => request<T>('PUT', url, data),
    delete: <T>(url: string): Promise<T> => request<T>('DELETE', url),
};

export default api;