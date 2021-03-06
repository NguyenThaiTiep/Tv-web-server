import { plainToClass } from "class-transformer";
import { getRepository } from "typeorm";
import { BookDetailService } from "../../CRUD/Book/bookDetails";
import { BookDetailInputDto } from "../../dto/Book/book.detail.dto";

import { BookDetail } from "../../entity/Book/BookDetails";
import { getIdBook } from "../../libs/Book";
import { AddBySheet } from "../../service/google-api/addStudentBySheest";
import { BookCopyId, BookId } from "../../service/Id/id";
import { HandelStatus } from "../HandelAction";

const Create = async (req, res) => {
  let bookDetails = req.body.bookdetail;
  if (!bookDetails) return res.send(HandelStatus(400));
  let bookDetailInput = plainToClass(BookDetailInputDto, bookDetails, {
    excludeExtraneousValues: true,
  });
  let result = await BookDetailService.Create(bookDetailInput);
  res.send(result);
};
const CreateBySheet = async (req, res) => {
  let BookDetailsRepo = getRepository(BookDetail);

  let Id = BookCopyId;
  let arr = await AddBySheet(Id);
  let data = (arr.result as any).data;
  let result = { success: 0, fail: 0 };
  for (let index = 0; index < data.length; index++) {
    if (index > 0) {
      let item = data[index];
      if (index > 0) {
        let bookConfig = {
          idBookDetails: item[0],
          idBook: getIdBook(item[0]),
        };
        let bookdetail = plainToClass(BookDetailInputDto, bookConfig, {
          excludeExtraneousValues: true,
        });

        let r = await BookDetailService.Create(bookdetail);

        if (r.status == 200) {
          result.success++;
        } else {
          result.fail++;
          console.log(r, bookdetail);
        }
      }
    }
  }

  res.send(HandelStatus(200, null, result));
};
const GetAll = async (req, res) => {
  let IdBook = req.params.IdBook;
  let result = await BookDetailService.GetAll(IdBook);
  res.send(result);
};
const GetById = async (req, res) => {
  let idBookDetails = req.params.IdBook;

  let result = await BookDetailService.GetById(idBookDetails);
  res.send(result);
};
const removeById = async (req, res) => {
  let idBookDetails = req.params.id;
  let result = await BookDetailService.RemoveById(idBookDetails);
  res.send(result);
};
export const BookDetailController = {
  Create,
  CreateBySheet,
  GetAll,
  GetById,
  removeById,
};
