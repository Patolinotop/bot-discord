import { Client, GatewayIntentBits } from "discord.js"
import OpenAI from "openai"
import http from "http"

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
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "responda curto e direto" },
        { role: "user", content: mensagem.content }
      ],
      max_tokens: 60
    })

    await mensagem.reply(resposta.choices[0].message.content)
  } catch {
    await mensagem.reply("deu erro 😕")
  }
})

cliente.login(process.env.DISCORD_BOT_TOKEN)

const servidor = http.createServer((req, res) => {
  res.writeHead(200)
  res.end("ok")
})

servidor.listen(process.env.PORT || 3000)
