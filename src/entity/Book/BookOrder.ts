import moment = require("moment");
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  Timestamp,
} from "typeorm";
import { Student } from "../Student/Student";
import { User } from "../User/User";
import { BookDetail } from "./BookDetails";

export type BookOrderConfig = {
  id?: number;
  BorrowDate?: Date;
  PayDate?: Date;
  bookdetailId?: string;
  studentId?: string;
  userCheckIn?: number;
  userCheckOut?: number;
};
@Entity()
export class BookOrder {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  borrowDate: Date;
  @Column({ nullable: true })
  payDate: Date;
  @OneToOne((type) => BookDetail)
  @JoinColumn()
  bookdetail: BookDetail;
  @ManyToOne((type) => Student, (o) => o.bookOrders, {
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  })
  student: Student;
  @Column({
    nullable: false,
  })
  deadline: Date;
  @ManyToOne((type) => User)
  @JoinColumn()
  UserCheckIn: User;
  @ManyToOne((type) => User)
  @JoinColumn()
  UserCheckOut: User;
}
