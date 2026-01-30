import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { AgentsModule } from './agents/agents.module';
import { AgentAttributesModule } from './agent-attributes/agent-attributes.module';
import { GenerationLogsModule } from './generation-logs/generation-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    CategoriesModule,
    AgentsModule,
    AgentAttributesModule,
    GenerationLogsModule,
  ],
})
export class AppModule { }

