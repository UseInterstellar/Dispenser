import {Modal, Bot, CommandPermissions} from "../classes/Bot";
import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import Utils from "../classes/Utils";
import DB from "../classes/DB";

export default class extends Modal {
    override async run(interaction: ModalSubmitInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply({ephemeral: true});
        let usr = await DB.getUser(interaction.user.id, interaction.guildId!)
        if (usr.banned) {
            await interaction.editReply({
                embeds: [
                    Utils.getEmbed(Utils.EmbedType.Red, {
                        title: "Unable to submit report",
                        description: "You are banned."
                    })
                ]
            });
            return;
        }
        try {
            await Utils.sendWebhook(interaction.guildId!, Utils.WebhookType.Reports, [
                Utils.getEmbed(Utils.EmbedType.Red, {
                    title: "New Report",
                    fields: [
                        {
                            name: "Reporter",
                            value: `<@${interaction.user.id}> (${interaction.user.tag} | ${interaction.user.id})`,
                        },
                        {
                            name: "Domain",
                            value: interaction.fields.getTextInputValue('domainInput'),
                        },
                        {
                            name: "Reason",
                            value: interaction.fields.getTextInputValue('reasonInput'),
                        },
                        {
                            name: "Blocker",
                            value: interaction.fields.getTextInputValue('schoolFilterInput'),
                        }
                    ],
                    author: {
                        name: interaction.user.username,
                        iconURL: interaction.user.avatarURL()!
                    }
                })
            ])
        } catch (e) {
            await interaction.editReply({
                embeds: [
                    Utils.getEmbed(Utils.EmbedType.Red, {
                        title: "Failed to send report",
                    })
                ]
            });
            return;
        }

        await interaction.editReply({
            embeds: [
                Utils.getEmbed(Utils.EmbedType.Default, {
                    title: "Success",
                    description: "Your report has been sent!"
                })
            ]
        });
    }

    override name(): string {
        return "Report";
    }

    override id(): string {
        return "reportmdl";
    }

    override async build(): Promise<ModalBuilder> {
        return new ModalBuilder()
            .setCustomId(this.id())
            .setTitle(this.name())
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('domainInput')
                            .setLabel('Domain to report')
                            .setPlaceholder("example.com")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ),
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('reasonInput')
                            .setLabel('Reason for report')
                            .setPlaceholder("Reason")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ),
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('schoolFilterInput')
                            .setLabel('The filter you have')
                            .setPlaceholder("lightspeed, goguardian, etc.")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ),
            )
    }

    override permissions(): CommandPermissions {
        return {
            adminRole: false
        }
    }
}