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

interface Validate {
	[name: string]: (arg: string) => boolean;
}

const validations:Validate = {
	date: (date: string): boolean => {
		const reg = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/; 
		return reg.test(date)
	},
	name: (name: string): boolean => {
		const reg = /^[a-zA-Z]+$/; 
		return reg.test(name);
	},
	companyId: (companyId: string): boolean => {
		const reg = /^[A-Z][0-9]{4}$/;
		return reg.test(companyId);
	}
}

type customContext = Context & 
SessionFlavor<SessionData> & 
ConversationFlavor;
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

const getAskForConv = async (name: string) => {
	return await prisma.dataForConv.findMany({
		where: {
			name
		}
	});
}

const testConversation = async (conversation: customConversation, ctx: customContext) => {
	await ctx.reply("Wellcome to conversation 'test'\nEnter name ask");
	const name: string = await conversation.form.text();
	const asks = await conversation.external(() => getAskForConv(name));
	logger.info(asks);
	for (let indexAsk = 0; indexAsk < asks.length; indexAsk++) {
		const {ask, validate} = asks[indexAsk];
		let checkValidate: boolean = !false;
		while(checkValidate){
			await ctx.reply(`${ask}`);
			const answer: string = await conversation.form.text();
			checkValidate = !validations[validate](answer)
			if(!checkValidate){
				await ctx.reply("OK");
			}else{
				await ctx.reply("Try again");
			}
		}
	}
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
