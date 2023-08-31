import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {BetPlace, RouletteService} from "./roulette.service";
import {AuthService} from "../auth/auth.service";

@WebSocketGateway({cors: '*:*'})
export class RouletteGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private rouletteService: RouletteService,
              private authService: AuthService
  ) {
  }
  @WebSocketServer()
  server: Server;
  clients: Map<string, Socket> = new Map();
  async handleConnection(client: Socket) {
    if(client.handshake.headers.authorization) {
      try {
        const auth = await this.authService.verifyAccessToken(client.handshake.headers.authorization)
      } catch (e) {
        client.disconnect(true)
      }
    }
    if(true) {
      this.clients.set(client.id, client);
      console.log(`Client connected: ${client.id}`);
      await this.rouletteService.sendServerState(client);
    } else {
      client.disconnect(true)
    }
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    this.rouletteService.disconnectPlayer(client)
    console.log(`Client disconnected: ${client.id}`);
  }

  afterInit() {
    this.rouletteService.setSocket(this.server);
    this.rouletteService.startRoulette();
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: { userId: string }) {
    // Обработка присоединения игрока к игре
    client.join('roulette');
    // Отправка информации о текущем раунде на клиент
  }

  @SubscribeMessage('newBet')
  async newBet(client: Socket, payload: BetPlace) {
    // Обработка присоединения игрока к игре
    await this.rouletteService.handlePlaceBet(client, payload)
  }

  // Добавьте другие методы для обработки ставок, обратного отсчета, выбора победителя и создания нового раунда
}

