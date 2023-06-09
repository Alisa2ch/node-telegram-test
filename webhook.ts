import { Bot, webhookCallback } from 'grammy';
import { PrismaClient } from '@prisma/client';
import logger from './logger';
import express from 'express';
import { channel } from 'diagnostics_channel';

const prisma = new PrismaClient();
const bot = new Bot(process.env.TELEGRAM_TOKEN as string, {
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
					}
				})
				logger.info(newUser);
			}else{
				logger.info(user);
			}

		} catch(e){
			logger.error(e);
		}

	}
	try{
		await ctx.reply("welcome");
	} catch(e){
		logger.error(e);
	}
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
