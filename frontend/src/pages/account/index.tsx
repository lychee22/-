import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Checkbox, Card } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useUserInfo } from '../../context/useAuth';
import api from '../../utils/request';
// import { generateJWT } from '../../utils/jwtUtils';
import { encodeMessage, decodeMessage } from '../../utils/protoUtils';
import { useNavigate } from 'react-router-dom';
import { md5Encryted } from '../../utils/pswMd5';
import CryptoJS from 'crypto-js';

const AccountPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForget, setIsForget] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [verifyCodeSent, setVerifyCodeSent] = useState(false);
    const [serverkey, setServerkey] = useState();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const { setUserInfo } = useUserInfo();

    // 校验用户名，这里简单设置为必填且长度不超过20
    // @ts-ignore
    const validateUsername = (rule: any, value: string) => {
        if (!value) {
            return Promise.reject('请输入用户名');
        } else if (value.length > 20) {
            return Promise.reject('用户名长度不能超过20');
        }
        return Promise.resolve();
    };

    // 校验电话号码，设置为必填且为11位数字
    // @ts-ignore
    const validatePhone = (rule: any, value: string) => {
        if (!value) {
            return Promise.reject('请输入电话号码');
        } else if (!/^1[3-9]\d{9}$/.test(value)) {
            // return Promise.reject('请输入有效的11位电话号码');
        }
        return Promise.resolve();
    };

    // 获取验证码
    const getVerifyCode = async () => {
        const { phone } = form.getFieldsValue();
        if (countdown > 0) {
            return;
        }
        if (!phone) {
            message.error('请先输入电话号码');
            return;
        }
        try {
            // 假设这里调用后端接口发送验证码
            const sendVerifyCodeReq = {
                sendVerifyCodeReq: {
                    phoneNumber: phone
                }
            };
            const response = await api.post<any>('/edit', sendVerifyCodeReq);
            localStorage.setItem('serverkey', response.sendVerifyCodeRsp.serverkey);
            setServerkey(response.sendVerifyCodeRsp.serverkey);
            if (response) {
                message.success('验证码已发送，请查收');
                setCountdown(30);
                setVerifyCodeSent(true);
            } else {
                message.error('验证码发送失败，请稍后重试');
            }
        } catch (error) {
            console.error('请求出错:', error);
            message.error('验证码发送失败，请稍后重试');
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [countdown]);

    const onFinish = async (values: { username: string; password: string; phone: string; email?: string; verifyCode?: string }) => {
        if (!isLogin && !verifyCodeSent) {
            message.error('请先获取验证码');
            return;
        }
        values.phone = values.phone ? values.phone : '19987887776';

        try {
            let response;
            const passwordMd5 = md5Encryted(values.password);
            const user = {
                username: values.username,
                userId: values.phone,
                userRole: 'auditor', // 根据实际情况设置
                authority: 'audit_article' // 根据实际情况设置
            };
            const registerReq = {
                user,
                passwordMd5Encrypted: passwordMd5,
                serverkey: serverkey,
                email: values.email || '111@qq.com'
            };
            const registerMessage = {
                registerReq: registerReq
            };
            // 编码注册消息 
            const registerEncode = encodeMessage('Msg', registerMessage);
            console.log('registerEncode:', registerEncode);

            if (registerEncode) {
                console.log('registerDecode: ', decodeMessage('Msg', registerEncode));
            }

            const md5Hex = CryptoJS.MD5(values.password).toString();
            localStorage.setItem('md5Hex', md5Hex);
            localStorage.setItem('userId', values.phone)
            if (isLogin) {
                // 登录逻辑
                const loginReq = {
                    getUserInfoReq: {
                        userId: values.phone
                    }
                };
                response = await api.post<any>('/edit', loginReq);
                if (response.error) {
                    message.error(response.error.errorDesc);
                } else {
                    setUserInfo(response.getUserInfoRsp);
                    message.success('登录成功');
                    navigate('/');
                }
            } else {
                // 注册逻辑
                const updatedRegisterMessage = {
                    registerReq: registerReq
                };
                response = await api.post<any>('/edit', updatedRegisterMessage);
                if (response.error) {
                    message.error(response.error.errorDesc);
                } else {
                    message.success('注册成功');
                    toggleMode();
                }

            }
        } catch (error) {
            console.error('请求出错:', error);
            message.error('操作失败，请稍后重试');
        }
    };

    const forgetOnFinish = async (values: { newPassword: string; phone: string; verifyCode: string }) => {
        if (!verifyCodeSent) {
            message.error('请先获取验证码');
            return;
        }
        const pswMd5 = md5Encryted(values.newPassword);
        const resetReq = {
            resetPasswordReq: {
                userId: values.phone,
                serverkey: serverkey,
                passwordMd5Encrypted: pswMd5,
                // verifyCode: values.verifyCode // 带上验证码
            }
        };
        try {
            const response = await api.post<any>('/edit', resetReq);
            console.log('-----resetPsw----');
            console.log(response);
            console.log('-----resetPsw----');
            if (response.error) {
                message.error(response.error.errorDesc);
            } else {
                message.success('重置成功');
                setIsForget(!isForget);
            }
        } catch (error) {
            console.error('请求出错:', error);
            message.error('操作失败，请稍后重试');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('表单提交失败:', errorInfo);
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setVerifyCodeSent(false);
        setCountdown(0);
    };

    // @ts-ignore
    const validatePassword = (rule: any, value: string) => {
        console.log('password--values=====', value)
        if (value.length < 2 || value.length > 16) {
            return Promise.reject('密码长度需为 2 - 16 位');
        }
        return Promise.resolve();
    };

    const validateConfirmPassword = () => {
        const { newPassword, confirmPassword } = form.getFieldsValue();
        if (confirmPassword && confirmPassword !== newPassword) {
            return Promise.reject('两次输入的密码不一致');
        }
        return Promise.resolve();
    };

    const LoginPage = (
        <Form
            form={form} // 传递表单实例
            name="login_register"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{ width: 320 }}
        >
            <h1>新闻资讯</h1>
            {
                !isLogin ?
                    (<Form.Item
                        name="username"
                        rules={[{ validator: validateUsername as any }]}
                    >
                        <Input allowClear prefix={<UserOutlined />} placeholder="请输入用户名" />
                    </Form.Item>) :
                    (<Form.Item
                        name="phone"
                        rules={[{ validator: validatePhone as any }]}
                    >
                        <Input allowClear prefix={<PhoneOutlined />} placeholder="电话号码" />
                    </Form.Item>)
            }
            <Form.Item
                name="password"
                rules={[{ validator: validatePassword as any }]}
            >
                <Input.Password allowClear prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>
            {(!isForget && isLogin) && (
                <Button type="text" onClick={() => setIsForget(!isForget)}>
                    忘记密码
                </Button>
            )}
            {!isLogin && (
                <>
                    <Form.Item
                        name="phone"
                        rules={[{ validator: validatePhone as any }]}
                    >
                        <Input allowClear prefix={<PhoneOutlined />} placeholder="电话号码" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            form={'form'}
                            type="link"
                            onClick={getVerifyCode}
                            disabled={countdown > 0}
                        >
                            {countdown > 0 ? `${countdown}s 后重试` : '获取验证码'}
                        </Button>
                    </Form.Item>

                    <Form.Item name="verifyCode" rules={[{ required: true, message: '请输入验证码' }]}>
                        <Input.OTP />
                    </Form.Item>
                </>
            )}
            {isLogin && (
                <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>记住我</Checkbox>
                </Form.Item>
            )}
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {isLogin ? '登录' : '注册'}
                </Button>
                <Button type="link" onClick={toggleMode}>
                    {isLogin ? '注册账号' : '返回登录'}
                </Button>
            </Form.Item>
        </Form>
    );

    const forgetCard = (
        <Form
            form={form} // 传递表单实例
            name="forget_password"
            onFinish={forgetOnFinish}
            initialValues={{ remember: true }}
            style={{ width: 320 }}
        >
            <h1>新闻资讯</h1>
            <Form.Item
                name="phone"
                rules={[
                    { required: true, message: '请输入手机号' },
                    { validator: validatePhone as any }
                ]}
            >
                <Input allowClear prefix={<PhoneOutlined />} placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item>
                <Button
                    form={'form'}
                    type="link"
                    onClick={getVerifyCode}
                    disabled={countdown > 0}
                >
                    {countdown > 0 ? `${countdown}s 后重试` : '获取验证码'}
                </Button>
            </Form.Item>
            <Form.Item name="verifyCode" rules={[{ required: true, message: '请输入验证码' }]}>
                <Input.OTP />
            </Form.Item>
            <Form.Item
                name="newPassword"
                rules={[
                    { required: true, message: '请设置新密码' },
                    { validator: validatePassword as any }
                ]}
            >
                <Input.Password allowClear placeholder="设置新密码" />
            </Form.Item>
            <Form.Item
                name="confirmPassword"
                rules={[
                    { required: true, message: '请重复新密码' },
                    { validator: validateConfirmPassword as any }
                ]}
            >
                <Input.Password allowClear placeholder="重复新密码" />
            </Form.Item>
            <Button type="text" onClick={() => setIsForget(!isForget)}>
                返回登录
            </Button>
            <Button type="primary" htmlType="submit">
                确定
            </Button>
        </Form>
    );

    return (
        <Card>
            {!isForget ? LoginPage : forgetCard}
        </Card>
    );
};

export default AccountPage;