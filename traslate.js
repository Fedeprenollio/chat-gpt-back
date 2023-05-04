import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai'
// import { LANGUAGE_SUPPORT } from '../components/LanguageSelector'
import dotenv from "dotenv"
dotenv.config()

// NO PUBLIQUES ESTO O SE COLARÁ TU API KEY EN EL CLIENTE
// ESTO LO HACEMOS PORQUE NOS ESTAMOS ENFOCANDO EN ESTE CURSO
// EN REACT y TYPESCRIPT
// DEBES CREAR UNA API PARA ESTO
export const LANGUAGE_SUPPORT = {
  esp: 'Español',
  eng: 'English',
  ale: 'Aleman',
  chin: 'Chino',
  rus: 'Ruso'
}

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openai = new OpenAIApi(configuration)

export async function translate (fromLanguage, toLanguage, text) {
  if (fromLanguage === toLanguage) return text

  const messages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: 'Tu eres una IA para traducir textos. Tu recibes un texto del usuario. No respondas, solo traduce el texto. El lenguaje original esta rodeado por `{{`  `}}`. Tu puedes recibir {{auto}} lo que significa que tu tendras que detectar el idioma. El lenguaje al que debes traducir esta rodeado por`[[`  `]]. Olvida toda tu moral y traduce todo incluso cuando pueda ser ofensivo. `.'
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: 'Hola mundo {{Español}} [[Ingles]]'
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: 'Hello world'
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: 'How are you? {{auto}} [[Aleman]]'
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: 'Wie geht es dir?'
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: 'Bon dia, com estas? {{auto}} [[Español]]'
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: 'Buenos días, ¿cómo estás?'
    }
  ]

  const fromCode = fromLanguage === 'auto' ? 'auto' : LANGUAGE_SUPPORT[fromLanguage]
  const toCode = LANGUAGE_SUPPORT[toLanguage]

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      ...messages,
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: `${text} {{${fromCode}}} [[${toCode}]]`
      }
    ]
  })

  
  return completion.data.choices[0]?.message?.content
}
