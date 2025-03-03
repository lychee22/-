import CryptoJS from 'crypto-js';

export const md5Encryted = (password: string) => {
    // 计算密码的 MD5 值
    const md5Hex = CryptoJS.MD5(password).toString();
    console.log('----注册的md5HEx----', md5Hex);

    // 根据验证码加密，验证码暂时写死为 666，填充 \0 到 16 位
    const keyString = '666'.padEnd(16, '\0');
    const key = CryptoJS.enc.Utf8.parse(keyString);

    // 初始化向量，16 字节
    const ivString = '0123456789abcdef';
    const iv = CryptoJS.enc.Utf8.parse(ivString);

    // 创建 AES - CBC 加密器
    const encrypted = CryptoJS.AES.encrypt(md5Hex, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // 获取加密后的结果并转换为 Base64 编码的字符串
    const encryptedBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    console.log(encryptedBase64);

    // 将密码的 MD5 哈希值存储到 localStorage 里
    localStorage.setItem('passwordMd5', md5Hex);

    return encryptedBase64;
};