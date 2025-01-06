import { ChatInputCommandInteraction } from "discord.js";
import { ProtectedCollection } from "../../collection";
import { MiauSlashCommandParam } from "../../../interfaces/interaction";
import client from "../../../..";
import { interactionNameRegEx } from "../../../constants/discord";

class MiauSlashSubcommandBuilder {
    constructor() { }

    private console = client.utils.console

    execution(interaction: ChatInputCommandInteraction, params: ProtectedCollection<MiauSlashCommandParam>) {

    }

    params: MiauSlashCommandParam[] = []
    name: string | undefined = undefined
    description: string | undefined = undefined

    setName(name: string): this {
        if (name.length < 1 || name.length > 32) {
            this.console.error(
                ["error", "commandBuildError"],
                "Tamaño incorrecto en el nombre. Debe ser de 1 a 32 caracteres."
            );
            throw new Error("El nombre debe tener entre 1 y 32 caracteres.");
        }
        if (name != name.toLowerCase()) {
            this.console.warning(
                ["commandBuildError"],
                "Los comandos slash no aceptan mayúsculas en su nombre."
            );
        }
        if (!interactionNameRegEx.test(name)) {
            this.console.error(
                ["error", "commandBuildError"],
                "El nombre contiene caracteres inválidos."
            );
            throw new Error("El nombre contiene caracteres inválidos.");
        }
        this.name = name
        return this
    }

    setDescription(description: string): this {
        if (description.length < 1) {
            this.console.error(
                ["error", "commandBuildError"], 
                "La descripción debe tener al menos un carácter."
            );
            throw new Error("La descripción debe tener al menos un carácter.");
        }
        if (description.length > 100) {
            this.console.warning(
                ["commandBuildError"], 
                "La descripción no puede exceder los 100 caracteres."
            );
            description = description.substring(0, 100); // Recorta a 100 caracteres si es necesario
        }
        this.description = description
        return this
    }

    setExecution(f: (interaction: ChatInputCommandInteraction, params: ProtectedCollection<MiauSlashCommandParam>) => void): this {
        this.execution = f
        return this
    }

    addParam(param: MiauSlashCommandParam): this {
        if (!client.utils.Interactions.verify.param.slash(param)) throw new Error("Parámetro con estructura incorrecta.")
        this.params.push(param)
        return this
    }

    test():boolean {
        return (
            typeof this.name === 'string' &&
            typeof this.description === 'string' &&
            this.name.length > 1 &&
            this.name.length <= 32 &&
            this.description.length > 1 &&
            this.description.length <= 100
        );
    }
    

    toJSON() {
        if (!this.name || !this.description) {
            this.console.error(["error", "commandBuildError"], "Los campos de nombre y descripción son obligatorios.")
            throw new Error("Los campos de nombre y descripción son obligatorios.")
        }
        return {
            name: this.name.toLowerCase(),
            description: this.description,
            options: this.paramsToOptionsJSON()
        }
    }

    private paramsToOptionsJSON() {
        this.params.forEach(param => {
            this.console.log(["commandBuildLog"], `Comprobando parámetro ${param.customId}`)
            if (!client.utils.Interactions.verify.param.slash(param)) throw new Error("Existen parámetros inválidos:\n"+param)
        })
        let dupp = this.params.some((param, index, array) =>
            array.findIndex(p => p.customId === param.customId) !== index
        );
        if (dupp) {
            this.console.error(['error', 'commandBuildError'], 'Dos o más parámetros tienen la misma ID.')
            throw new Error("Dos o más parámetros tienen la misma ID.")
        }
    }
}

export default MiauSlashSubcommandBuilder