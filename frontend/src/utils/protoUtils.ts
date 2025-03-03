import protobuf from 'protobufjs';

// 定义一个全局变量来存储根对象
let root = new protobuf.Root({ keepCase: true });;

// 异步加载 proto 文件
async function loadProto() {
    try {
        await root.load('/proto/client2server.proto');
    } catch (error) {
        console.error('Failed to load proto file:', error);
    }
}

// 初始化加载 proto 文件
loadProto();

// 通用编码函数
export function encodeMessage(messageName: string, data: any): Uint8Array | null {
    if (!root) {
        console.error('Proto file is not loaded yet.');
        return null;
    }
    const messageType = root.lookupType(`client2server.${messageName}`);
    if (!messageType) {
        console.error(`Message type ${messageName} not found.`);
        return null;
    }
    // const payload = {Msg:data}
    const errMsg = messageType.verify(data);
    console.log('---Msg', data)
    if (errMsg) {
        console.error('Verification error:', errMsg);
        return null;
    }
    const message = messageType.create(data);
    const encodeData = messageType.encode(message).finish();
    return encodeData.slice(0, encodeData.length)
}


// 通用解码函数
export function decodeMessage(messageName: string, buffer: Uint8Array): any | null {
    if (!root) {
        console.error('Proto file is not loaded yet.');
        return null;
    }
    const messageType = root.lookupType(`client2server.${messageName}`);
    if (!messageType) {
        console.error(`Message type ${messageName} not found.`);
        return null;
    }
    try {
        const u8a = new Uint8Array(buffer, 0, buffer?.byteLength)
        const message = messageType.decode(u8a);
        console.log('----decodeU8a----', message)
        return messageType.toObject(message, {
            longs: String,
            enums: String,
            bytes: String,
        });
    } catch (error) {
        console.error('Decoding error:', error);
        return null;
    }
}