import { Message } from "discord.js"
import { MiauMessageCommandParam, MiauMessageCommandParamResponse } from "../../../interfaces/messageCommand"
import { ProtectedCollection } from "../../collection"

class MiauMessageSubcommandBuilder {
    constructor() { }

    async execution(message: Message, _: ProtectedCollection<MiauMessageCommandParamResponse>): Promise<void> {
        await message.reply('¡Hola! No tengo ni idea de qué hace ese comando...')
    }

    // TODO: Permitir precondiciones en subcomandos.

    params: MiauMessageCommandParam[] = []
    name: string | undefined = undefined
    description: string | undefined = undefined

    setName(name: string):this {
        // TODO: Verificar que la longitud es la correcta y el formato adaptado.
        this.name = name
        return this
    }

    setDescription(description: string): this {
        // TODO: Verificar que la descripción utiliza los caracteres apropiados.
        this.description = description
        return this
    }

    setExecution(f: (message: Message, params: ProtectedCollection<MiauMessageCommandParamResponse>) => Promise<void>): this {
        // TODO: Verificar que la función es correcta
        this.execution = f
        return this
    }

    addParam(param: MiauMessageCommandParam): this {
        // TODO: Verificar que el parámetro es correcto.
        this.params.push(param)
        return this
    }
}

export default MiauMessageSubcommandBuilder