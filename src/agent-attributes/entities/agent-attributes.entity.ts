import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Agent } from 'src/agents/entities/agent.entity';

@Entity('agent_attributes')
@Unique(['agent', 'attrKey'])
export class AgentAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Agent, agent => agent.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'agent_id'})
  agent: Agent;

  @Column({ name: 'attr_key' })
  attrKey: string;

  @Column({ name: 'attr_value', type: 'text', nullable: true })
  attrValue?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
