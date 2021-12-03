const { ERROR_MESSAGE } = require('../../config/constants');
const { generateBasicAck } = require('../helpers/socket.helper');
const logger = require('../../config/logger');
const RoomService = require('../../services/room.service');
const MessageService = require('../../services/message.service');

class MessageSocket {
  constructor() {
    this.roomService = RoomService;
    this.messageService = MessageService;
  }

  async sendMessage(socket, chatRooms) {
    socket.on('send-message', async (data, callback) => {
      try {
        const { content, roomId, userId } = data;
        logger.Info(`on event 'send-message' to roomId: ${roomId} with userId: ${userId}`);

        // save the message to database
        const newMessage = await this.messageService.saveMessage({
          messageContent: content,
          roomId,
          userId,
        });

        // broadcast message to all users inside chat room
        socket.broadcast.to(roomId).emit('receive-message', {
          content,
          type: newMessage.type,
          user: newMessage.user,
          time: newMessage.time,
        });

        // notify all users outside chat room
        const { usersOutside, usersInside } = await this.getUsersInsideAndOutsideChatRoom(roomId, chatRooms);
        usersOutside.forEach(user => {
          socket.to(user._id).emit('receive-new-message', {
            content,
            type: newMessage.type,
            room: newMessage.room,
            user: newMessage.user,
            time: newMessage.time,
          });
        });
        
        // setup user in room read this message
        const userInsideIds = usersInside.map(user => user.userId);
        await this.roomService.setUsersReadMessage({
          userIds: userInsideIds,
          roomId,
        });

        callback(generateBasicAck(true, false, 'message was sent successfully'));
        logger.Info(`emit event 'receive-message' to roomId: ${roomId} with userId: ${userId} and time: ${newMessage.time}`);
      } catch (error) {
        callback(generateBasicAck(false, true, error.message));
      }
    });
  }

  typingInRoom(socket) {
    socket.on('typing-message', (options, callback) => {
      try {
        const { roomId, userId } = options;
        logger.Info(`on event 'typing-message' from roomId: ${roomId} with userId: ${userId}`);
        const user = this.userService.getUserInfoById({ userId });

        // broadcast to all users in this room
        socket.broadcast.to(roomId).emit('receive-typing-message', {
          userName: user.profile.fullname,
        });

        callback(generateBasicAck(true, false, `typing in room ${roomId}`));
      } catch (error) {
        callback(generateBasicAck(false, true, error.message));
      }
      
    });
  }

  //#region methods helper
  async getUsersInsideAndOutsideChatRoom(roomId, chatRooms) {
    const users = await this.roomService.getMembersFromRoom(roomId);
    const usersCurrent = chatRooms[roomId] ? chatRooms[roomId] : [];

    const usersOutside = users.map(user => {
      if (!usersCurrent.find(userCurrent => userCurrent.userId === user._id)) {
        return user;
      }
    });

    return {
      usersOutside,
      usersInside: usersCurrent,
    }
  }
  //#endregion
}

module.exports = new MessageSocket();
