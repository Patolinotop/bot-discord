import { Client, GatewayIntentBits } from "discord.js"
import OpenAI from "openai"

const cliente = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

cliente.once("ready", () => {
  console.log("bot ligado")
})

cliente.on("messageCreate", async (mensagem) => {
  if (mensagem.author.bot) return
  if (mensagem.channel.name !== "chat") return

  try {
    const resposta = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        { role: "system", content: "responda curto, direto e como um bot de discord" },
        { role: "user", content: mensagem.content }
      ],
      max_tokens: 60
    })

    await mensagem.reply(resposta.choices[0].message.content)
  } catch (erro) {
    await mensagem.reply("deu erro aqui 😕")
  }
})

cliente.login(process.env.DISCORD_BOT_TOKEN)
