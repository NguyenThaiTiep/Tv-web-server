import { plainToClass } from "class-transformer";
import {
  AfterInsert,
  Any,
  FindOperator,
  getRepository,
  In,
  Raw,
} from "typeorm";
import { Alias } from "typeorm/query-builder/Alias";
import { io } from "../..";
import { HandelStatus } from "../../controllers/HandelAction";
import {
  NotificationGetList,
  NotificationInput,
  NotificationSeenDto,
} from "../../dto/poster/notification.dto";
import { UserNotificationDto } from "../../dto/user/user.dto";
import { NotificationPoster } from "../../entity/Poster/Notifical";
import { User } from "../../entity/User/User";
import { IoEmit } from "../../libs/constans";

const create = async (input: NotificationInput) => {
  let notification = plainToClass(NotificationPoster, input);
  try {
    await getRepository(NotificationPoster).save(notification);
    io.emit(IoEmit.NEW_NOTIFICATION);
  } catch (e) {
    console.log(e);
  }
};
const seen = async (userId: number, id: number) => {
  let user = await getRepository(User).findOne(userId);
  let notification = await getRepository(NotificationPoster).findOne({
    relations: ["userSeen"],
    where: { id: id },
  });
  if (!notification || !user) console.log("not found");
  try {
    if (!notification.userSeen || notification.userSeen.length == 0) {
      notification.userSeen = [];
      if (notification.userSeen.find((o) => o.id == userId) == null) {
        notification.userSeen.push(user);
        await await getRepository(NotificationPoster).save(notification);
      }
    }
  } catch (e) {
    console.log(e);
  }
};
const getAll = async (userId: number, take, skip) => {
  let notification = await getRepository(NotificationPoster)
    .createQueryBuilder("notification")
    .innerJoin(
      "notification_poster_user_subscribe_user",
      "userSubscribe",
      "userSubscribe.notificationPosterId =notification.id && userSubscribe.userId=:userId",
      { userId: userId }
    )
    .leftJoin(
      "notification_poster_user_seen_user",
      "userSeen",
      "userSeen.notificationPosterId =notification.id && userSeen.userId =:userId",
      { userId: userId }
    )
    .leftJoinAndSelect("notification.userCreate", "userCreate")
    .leftJoinAndSelect("notification.poster", "poster")
    .addSelect("IF(userSeen.userId IS NOT NULL, true, false)", "isSeen")
    .orderBy("notification.creat_at", "DESC")
    .take(take || 10)
    .skip(skip || 0)
    .getRawMany();

  try {
    let result = plainToClass(NotificationGetList, notification, {
      excludeExtraneousValues: true,
    });

    return HandelStatus(200, null, {
      notifications: result,
    });
  } catch (e) {
    return HandelStatus(500, e);
  }
};
const getNews = async (userId: number) => {
  let SubCount = await getRepository(NotificationPoster)
    .createQueryBuilder("notification")
    .innerJoin(
      "notification_poster_user_subscribe_user",
      "userSubscribe",
      "userSubscribe.notificationPosterId =notification.id && userSubscribe.userId=:userId",
      { userId: userId }
    )
    .getCount();

  let SeenCount = await getRepository(NotificationPoster)
    .createQueryBuilder("notification")
    .innerJoin(
      "notification_poster_user_subscribe_user",
      "userSubscribe",
      "userSubscribe.notificationPosterId =notification.id && userSubscribe.userId=:userId",
      { userId: userId }
    )
    .innerJoin(
      "notification_poster_user_seen_user",
      "userSeen",
      "userSeen.notificationPosterId =notification.id && userSeen.userId =:userId",
      { userId: userId }
    )
    .getCount();

  return HandelStatus(200, null, {
    count: SubCount - SeenCount,
  });
};
export const NotificationService = { create, seen, getAll, getNews };
