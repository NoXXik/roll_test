import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  // Настройка CORS
  app.enableCors({
    origin: 'http://smarthome16.ru', // Замените на домен вашего React-приложения
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin', // Добавьте другие разрешенные заголовки, если требуется
    credentials: true, // Если в вашем приложении используются куки или аутентификация с помощью заголовка Authorization
  });

  // app.use(passport.initialize())
  // app.use(passport.session())
  app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));

  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
