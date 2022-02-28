import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('GasPrice')
export class GasPrice extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'fast', type: 'decimal', precision: 10, scale: 2 })
  fast: number;

  @Column({ name: 'average', type: 'decimal', precision: 10, scale: 2 })
  average: number;

  @Column({ name: 'low', type: 'decimal', precision: 10, scale: 2 })
  low: number;

  @Column({ name: 'blockNum', type: 'decimal' })
  blockNum: number;

  @Column({
    name: 'createdAt',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  setGasPrice(f: number, a: number, l: number, bn: number): void {
    this.fast = f;
    this.average = a;
    this.low = l;
    this.blockNum = bn;
  }
}
