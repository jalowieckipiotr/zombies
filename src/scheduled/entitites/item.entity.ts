import { Zombie } from '../../zombies/zombie.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  price: number;
  @ManyToMany(() => Zombie, (zombie) => zombie.items)
  zombies: Zombie[];
}
