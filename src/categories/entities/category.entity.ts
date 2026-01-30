import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number; 

    @Column({length: 100, unique: true})
    name: string

    @Column({type:'text', nullable: true})
    description?: string

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;
}
