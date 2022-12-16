import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public brand: string;

  @Column()
  public category: string;

  @Column()
  public thumbnail: string;

  @Column({ default:0 })
  public price: number;

  @Column({ type: 'float', default:"0", nullable: false })
  public discountPercentage: number;

  @Column({ type: 'float', default:"0", nullable: false })
  public rating: number;

  @Column({ default:0 })
  public stock: number;

  @Column({ default: true })
  public isActive: boolean;
}