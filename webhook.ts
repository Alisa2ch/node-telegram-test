import { Bot, webhookCallback } from 'grammy';
import { PrismaClient } from '@prisma/client';
import logger from './logger';
import express from 'express';

const prisma = new PrismaClient();
const bot = new Bot(process.env.TELEGRAM_TOKEN as string, {
	client: {
		apiRoot: process.env.TELEGRAM_SERVER || ''
	}
});

bot.command('start', async (ctx) => {
	logger.info(ctx?.from?.id);
	// console.log(ctx.from != null, ctx?.from?.hasOwnProperty('id'))
	if(ctx.from != null && ctx.from.hasOwnProperty('id')){
		try{
			const user = await prisma.user.create({
				data: {
					id: ctx.from.id,
					type: 'basic',
					language: 'en',
					type_date: 'ddmmyyyy',
				}
			})
			logger.info(user);
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

// bot.on('message:photo', async ctx => {
// 	// console.log(ctx);
// 	const userLang = await prisma.user.findUnique({
// 		where: {
// 			id: ctx.from?.id
// 		}
// 	})
// 	await ctx.reply(JSON.stringify(userLang?.language));
// })

const server = express();
server.use(express.json());

server.post('/webhook', webhookCallback(bot, 'express'));

server.listen(process.env.TELEGRAM_WEBHOOK_PORT, () => {
	logger.info(`server start on ${process.env.TELEGRAM_WEBHOOK_PORT} port`)
});

bot.api.setWebhook(process.env.TELEGRAM_WEBHOOK_SERVER as string);
