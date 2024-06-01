const messageModel = require("../models/messages.model");

const getToken = (sender, receiver) => {
  const key = [sender, receiver].sort().join("_");
  return key;
}

const saveMessages = async ({ from, to, message, time }) => {
  const token = getToken(from, to);
  const data = {
    from, message, time
  };

  try {
    const result = await messageModel.updateOne(
      { userToken: token },
      { $push: { messages: data } },
      { upsert: true } // 필요한 경우, 문서가 없으면 생성합니다.
    );
    console.log('message가 생성되었습니다', result);
  } catch (err) {
    console.error('메시지 저장 중 오류 발생:', err);
  }
}

module.exports = saveMessages;
