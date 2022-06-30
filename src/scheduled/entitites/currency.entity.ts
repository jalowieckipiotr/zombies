import { Entity, Column, PrimaryColumn} from 'typeorm';
@Entity()
export class Currency {
  @PrimaryColumn()
  code: string;
  @Column()
  currency: string;
  @Column()
  bid: number;
  @Column()
  ask: number;
}
