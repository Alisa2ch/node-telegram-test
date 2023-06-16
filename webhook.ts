import { Bot, Keyboard, webhookCallback, session, SessionFlavor, Context } from 'grammy';
import { PrismaClient } from '@prisma/client';

import {
	type Conversation,
	type ConversationFlavor,
	conversations,
	createConversation,
  } from "@grammyjs/conversations";  
import logger from './logger';
import express from 'express';

const prisma = new PrismaClient();

interface SessionData {
}

type customContext = Context & SessionFlavor<SessionData> & ConversationFlavor;
type customConversation = Conversation<customContext>

const bot = new Bot<customContext>(process.env.TELEGRAM_TOKEN as string, {
	client: {
		apiRoot: process.env.TELEGRAM_SERVER || ''
	}
});

const Role: { [x: string]: 'BASIC' | 'TESTER' | 'ADMIN'} = {
	BASIC: 'BASIC',
	TESTER: 'TESTER',
	ADMIN: 'ADMIN',
  }
  
type Role = typeof Role[keyof typeof Role]
const initial = (): SessionData => {
	return {};
}

const testConversation = async (conversation: customConversation, ctx: customContext) => {
	await ctx.reply("Wellcome to conversation 'test'\nEnter your name");
	const name = await conversation.form.text();
	await ctx.reply(`Your name: ${name}`);
}

bot.use(session({
	initial
  }));

bot.use(conversations());
bot.use(createConversation(testConversation));

bot.command('start', async (ctx) => {
	logger.info(ctx?.from?.id);
	// console.log(ctx.from != null, ctx?.from?.hasOwnProperty('id'))
	if(ctx.from != null && ctx.from.hasOwnProperty('id')){
		try{
			const user = await prisma.user.findUnique({
				where: {
					id: ctx.from.id
				}
			});
			if(user == null){
				const newUser = await prisma.user.create({
					data: {
						id: ctx.from.id,
						type: Role.BASIC,
						language: 'en',
						type_date: 'ddmmyyyy',
						referral: ctx.match || ""
					}
				})
				logger.info(newUser);
			}else{
				logger.info(user);
			}
			await ctx.conversation.enter("testConversation")
		} catch(e){
			logger.error(e);
		}

	}
// 	try{
// 		const keyboard = new Keyboard()
//   .text("Yes, they certainly are").row()
//   .text("I'm not quite sure").row()
//   .text("No. 😈")
//   .text("Yes. 😈")
//   .resized();

// 		await ctx.reply("welcome", {
// 			reply_markup: keyboard,
// 		});
// 	} catch(e){
// 		logger.error(e);
// 	}
})

bot.on('message:photo', async ctx => {
	try{
	const user = await prisma.user.findUnique({
		where: {
			id: ctx.from?.id
		}
	})
	logger.info(user)
	await ctx.reply(JSON.stringify(user?.language));
	} catch(e){
		logger.error(e);
	}
})

const server = express();
server.use(express.json());

server.post('/webhook', webhookCallback(bot, 'express'));

server.listen(process.env.TELEGRAM_WEBHOOK_PORT, () => {
	logger.info(`server start on ${process.env.TELEGRAM_WEBHOOK_PORT} port`)
});

bot.api.setWebhook(process.env.TELEGRAM_WEBHOOK_SERVER as string);
