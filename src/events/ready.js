export const name = "ready"
export const once = true;

export async function execute(client) {
    console.log(`Bot conectado como ${client.user.tag}`);
}
