import { HandelStatus } from "../HandelAction";
import { __dir } from "../../libs/path";
import { UserService } from "../../CRUD/User/user";
import { plainToClass } from "class-transformer";
import { UserInputDto, UserUpdateInputDto } from "../../dto/user/user.dto";

const getAll = async (req, res) => {
  let skip = req.params.skip || 0;
  let take = req.params.take || 10;
  let key = req.query.search || "";

  let result = await UserService.getAll(skip, take, key);
  return res.send(result);
};
const create = async (req, res) => {
  let userSend = req.body;
  let user = plainToClass(UserInputDto, userSend);
  user.born = user.born || new Date();
  user.avatar = req.file ? req.file.path : undefined;
  let response = await UserService.create(user);
  res.send(response);
};
const getById = async (req, res) => {
  let id = req.params.id;
  if (!id) {
    res.send(HandelStatus(204, null, id));
    return;
  }
  let response = await UserService.getById(id);
  res.send(response);
};

const update = async (req, res) => {
  let body = req.body;
  let userConfig = plainToClass(UserUpdateInputDto, body, {
    excludeExtraneousValues: true,
  });
  userConfig.avatar = req.file ? req.file.path : undefined;
  userConfig.id = res.locals ? res.locals.userId : undefined;
  if (!userConfig.name) {
    res.send(HandelStatus(204));
    return;
  }
  let user = userConfig;
  let response = await UserService.update(user, res.locals.userId);
  res.send(response);
};
const updateRole = async (req, res) => {
  let user = req.body.user;
  if (!user) return HandelStatus(400);
  let userInput = plainToClass(UserInputDto, user, {
    excludeExtraneousValues: true,
  });
  let result = await UserService.changeRoleOrDepartment(userInput);
  res.send(result);
};
const UploadFile = async (req, res, next) => {
  const processedFile = req.file;

  if (!processedFile) {
    next();
  } else {
    res.locals.filePath = req.file.path;
    next();
  }
};
const deleteById = async (req, res) => {
  let id = req.params.id;
  let result = await UserService.RemoveById(id);
  res.send(result);
};
const GetNameFile = (str: string) => {
  let nameFile = str.replace("/public", "");
  return nameFile;
};
export const UserController = {
  getAll,
  create,
  getById,
  update,
  updateRole,
  UploadFile,
  deleteById,
};
