import prisma from "../libs/prisma";
import { Router } from "express";
import { isAuthentified } from "../libs/middleware/auth";
import { Message, User } from "@prisma/client";

const chatRouter = Router();

chatRouter.get("/", isAuthentified, async (req, res) => {
  const user = req.user as User;
  const chatsList = await prisma.ticket.findMany({
    where: {
      userId: user.id,
    },
    include: {
      chat: true,
    },
  });
  res.json(chatsList);
});

chatRouter.get("/:chatId", isAuthentified, async (req, res) => {
  const user = req.user as User;
  const chatId = req.params.chatId;

  const existingTicket = await prisma.ticket.findUnique({
    where: {
      userId_chatId: {
        userId: user.id,
        chatId: chatId,
      },
    },
  });
  if (!existingTicket) return res.json({ message: "Ticket doesn't exist" });
  const existingChat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      messages: {
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  if (!existingChat) return res.json({ message: "Chat doesn't exist" });

  res.json(existingChat.messages.reverse());
});

chatRouter.post("/createchat", isAuthentified, async (req, res) => {
  const user = req.user as User;
  const name = req.body.name as string;
  const participants = req.body.participants as User[]; //doesn't include current user

  if (participants.length === 0)
    return res.json({ message: "Can't create a chat by yourself :(" });
  const newChat = await prisma.chat.create({
    data: {
      name: name ? name : user.nickname + "CHAT" + Date.now(),
    },
  });
  const currentUserTicket = await prisma.ticket.create({
    data: {
      userId: user.id,
      chatId: newChat.id,
    },
  });
  participants.forEach(async (e) => {
    //remove current user if exists
    await prisma.ticket.create({
      data: {
        userId: e.id,
        chatId: newChat.id,
      },
    });
  });
  //need to also give tickets to other participants
  res.json({
    message: "Created new chat and ticket",
    chat: newChat,
    ticket: currentUserTicket,
  });
});

chatRouter.post("/:chatId/sendmessage", isAuthentified, async (req, res) => {
  const chatId = req.params.chatId;
  const user = req.user as User;
  const body = req.body as Message;

  const existingTicket = await prisma.ticket.findUnique({
    where: {
      userId_chatId: {
        userId: user.id,
        chatId: chatId,
      },
    },
  });
  if (!existingTicket) return res.json({ message: "Ticket doesn't exist" });
  const existingChat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
  });
  if (!existingChat) return res.json({ message: "Chat doesn't exist" });
  const newMessage = await prisma.message.create({
    data: {
      ownerName: user.nickname,
      chatId: chatId,
      content: body.content,
    },
  });
  res.json(newMessage);
});

export = chatRouter;
