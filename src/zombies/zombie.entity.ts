import { Item } from '../scheduled/entitites/item.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
@Entity()
export class Zombie {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @CreateDateColumn()
  createdAt: Date;
  @Column({default:0})
  itemsValuePLN: number;
  @Column({default:0})
  itemsValueUSD: number;
  @Column({default:0})
  itemsValueEUR: number;
  @ManyToMany(() => Item, (item) => item.zombies)
  @JoinTable()
  items: Item[];
}
