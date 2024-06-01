const messageModel = require("../models/messages.model");

const getToken = (sender, receiver) => {
  const key = [sender, receiver].sort().join("_");
  return key;
}

const saveMessages = async ({ from, to, message, time }) => {
  const token = getToken(from, to);
  const messages = message;
  const data = {
    from, messages, time
  };

  try {
    const result = await messageModel.updateOne(
      {userToken: token},
      {$push: {messages: data}}
    );
  } catch (err) {
    console.error('메시지 저장 중 오류 발생:', err);
  }
}

const fetchMessages = async(io, sender, receiver) => {
  const token = getToken(sender,receiver);

  const foundToken = await messageModel.findOne({userToken: token});
  if (foundToken) {
    io.to(sender).emit('stored-messages', {messages: foundToken.messages});
  }
  else {
    const data = {
      userToken: token,
      messages: []
    }
    const message = new messageModel(data);
    const saveMessage = await message.save();
    if (saveMessage) {
      console.log('메시지가 저장되었음')
    }
    else {
      console.log('메시지 저장 실패')
    }
  }
}

module.exports = {
  saveMessages,
  fetchMessages
};
