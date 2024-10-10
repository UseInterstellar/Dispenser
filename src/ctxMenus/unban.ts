import {ContextMenu, Bot, CommandPermissions} from "../classes/Bot";
import {
    ContextMenuCommandType,
    ApplicationCommandType, //PermissionsBitField,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import DB from "../classes/DB";
import Utils from "../classes/Utils";

export default class extends ContextMenu {
    override async run(interaction: MessageContextMenuCommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply({ephemeral: true});
        try {
            await DB.unbanUser(interaction.targetId, interaction.guildId!);
        } catch (e) {
            await interaction.editReply({ embeds: [ Utils.getEmbed(Utils.EmbedType.Red, { title: `Failed to unban user`, description: e!.toString() }) ] });
            return;
        }

        await interaction.editReply({ embeds: [
                Utils.getEmbed(Utils.EmbedType.Default, { title: `Success!`, description: `Unbanned user <@${interaction.targetId}>` })
            ]})

        await Utils.sendWebhook(interaction.guildId!, Utils.WebhookType.Logs, [
            Utils.getEmbed(Utils.EmbedType.Default, {
                title: `User Unbanned`,
                fields: [
                    {
                        name: "User",
                        value: `<@${interaction.targetId}> (${interaction.targetId})`,
                    },
                    {
                        name: "Unbanned By",
                        value: `<@${interaction.user.id}> (${interaction.user.tag} | ${interaction.user.id})`,
                    },
                    {
                        name: "Unban Method",
                        value: "Context menu"
                    }
                ]
            })
        ])
    }

    override name(): string {
        return "Unban";
    }

    override type(): ContextMenuCommandType {
        return ApplicationCommandType.User
    }

    override permissions(): CommandPermissions {
        return {
            //permissions: PermissionsBitField.Flags.BanMembers,
            dmUsable: false,
            adminRole: true,
        }
    }
}