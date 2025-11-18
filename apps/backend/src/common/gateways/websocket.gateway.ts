import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove user from active users
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    this.userSockets.set(data.userId, client.id);
    console.log(`User ${data.userId} authenticated`);
  }

  @SubscribeMessage('joinNeighborhood')
  handleJoinNeighborhood(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { neighborhoodId: string },
  ) {
    client.join(`neighborhood:${data.neighborhoodId}`);
    console.log(`Client joined neighborhood: ${data.neighborhoodId}`);
  }

  @SubscribeMessage('leaveNeighborhood')
  handleLeaveNeighborhood(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { neighborhoodId: string },
  ) {
    client.leave(`neighborhood:${data.neighborhoodId}`);
  }

  // Emit new post to neighborhood
  emitNewPost(neighborhoodId: string, post: any) {
    this.server.to(`neighborhood:${neighborhoodId}`).emit('newPost', post);
  }

  // Emit new comment on post
  emitNewComment(postId: string, comment: any) {
    this.server.emit(`post:${postId}:comment`, comment);
  }

  // Emit new event
  emitNewEvent(neighborhoodId: string, event: any) {
    this.server.to(`neighborhood:${neighborhoodId}`).emit('newEvent', event);
  }

  // Emit safety alert
  emitSafetyAlert(neighborhoodIds: string[], alert: any) {
    neighborhoodIds.forEach((id) => {
      this.server.to(`neighborhood:${id}`).emit('safetyAlert', alert);
    });
  }

  // Emit notification to specific user
  emitNotification(userId: string, notification: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  // Emit typing indicator
  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string },
  ) {
    client.broadcast.to(`conversation:${data.conversationId}`).emit('userTyping', {
      userId: data.userId,
    });
  }

  // Get online users count for neighborhood
  async getOnlineUsersCount(neighborhoodId: string): Promise<number> {
    const room = this.server.sockets.adapter.rooms.get(`neighborhood:${neighborhoodId}`);
    return room ? room.size : 0;
  }
}
