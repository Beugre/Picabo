import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/' })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private userSockets = new Map<string, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET', 'default_secret'),
      });

      client.data.userId = payload.sub;
      client.data.role = payload.role;

      if (!this.userSockets.has(payload.sub)) {
        this.userSockets.set(payload.sub, new Set());
      }
      this.userSockets.get(payload.sub).add(client.id);

      client.join(`user:${payload.sub}`);
      client.join(`role:${payload.role}`);

      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub}, role: ${payload.role})`);
    } catch (err) {
      this.logger.warn(`Unauthorized WS connection: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data?.userId) {
      const sockets = this.userSockets.get(client.data.userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) this.userSockets.delete(client.data.userId);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-trip')
  handleJoinTrip(@MessageBody() tripId: string, @ConnectedSocket() client: Socket) {
    client.join(`trip:${tripId}`);
    return { event: 'joined-trip', data: tripId };
  }

  @SubscribeMessage('leave-trip')
  handleLeaveTrip(@MessageBody() tripId: string, @ConnectedSocket() client: Socket) {
    client.leave(`trip:${tripId}`);
    return { event: 'left-trip', data: tripId };
  }

  @SubscribeMessage('driver-location')
  handleDriverLocation(
    @MessageBody() data: { tripId: string; lat: number; lng: number; heading?: number },
    @ConnectedSocket() client: Socket,
  ) {
    if (data.tripId) {
      this.server.to(`trip:${data.tripId}`).emit('driver-location-update', {
        driverId: client.data.userId,
        ...data,
        timestamp: new Date(),
      });
    }
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  emitToTrip(tripId: string, event: string, data: any) {
    this.server.to(`trip:${tripId}`).emit(event, data);
  }

  emitToRole(role: string, event: string, data: any) {
    this.server.to(`role:${role}`).emit(event, data);
  }

  emitToAdmin(event: string, data: any) {
    this.server.to('role:admin').emit(event, data);
  }

  getOnlineUserCount(): number {
    return this.userSockets.size;
  }
}
