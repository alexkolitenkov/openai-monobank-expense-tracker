import Config from "react-native-config";
import OpenAI from 'react-native-openai'

export const openai = new OpenAI({
    apiKey: Config.OPENAI_KEY,
    organization: Config.OPENAI_ORGANIZATION_ID
})

export const chatStream = (prompt) => {
    return openai.chat.stream({
        messages: [
            {
                role: 'user',
                content: prompt
            },
        ],
        temperature: 1,
        // model: 'gpt-4o',
        model: 'gpt-3.5-turbo-0125',
    })
}
