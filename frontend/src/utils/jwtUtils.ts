import CryptoJS from 'crypto-js';

// 生成 JWT 的函数
export const generateJWT = (user_id: string, pswmd5: string) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const expirationTimestamp = timestamp + 600;

    // 构建头部
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const headerJson = JSON.stringify(header);
    const encodedHeader = CryptoJS.enc.Utf8.parse(headerJson).toString(CryptoJS.enc.Base64url);

    // 构建载荷
    const payload = {
        user_id,
        iat: timestamp,
        exp: expirationTimestamp
    };
    const payloadJson = JSON.stringify(payload);
    const encodedPayload = CryptoJS.enc.Utf8.parse(payloadJson).toString(CryptoJS.enc.Base64url);

    // 待签名的数据
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    // 使用 CryptoJS 进行 HMAC - SHA256 签名
    const hmac = CryptoJS.HmacSHA256(dataToSign, pswmd5);
    let signature = hmac.toString(CryptoJS.enc.Base64);

    // 将 Base64 编码转换为 Base64URL 编码
    signature = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // 组合成完整的 JWT
    const token = `${dataToSign}.${signature}`;
    console.log(token);
    console.log('-----jwt===');

    return token;
};