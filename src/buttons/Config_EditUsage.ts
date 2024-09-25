import {Button, Bot, CommandPermissions} from "../classes/Bot";
import { ButtonInteraction, ButtonStyle, ButtonBuilder } from "discord.js";

export default class extends Button {
    override async build(): Promise<ButtonBuilder> {
        return new ButtonBuilder()
        .setLabel("Edit Usage")
        .setStyle(ButtonStyle.Primary)
            .setCustomId(await this.id());
    }

    override id(): string {
        return "btnconfigeditusage";
    }

    override async run (interaction: ButtonInteraction, bot: Bot): Promise<void> {
        await interaction.showModal(await bot.getModal("configeditusagemdl")!.build([interaction.guild!.id]));
    }

    override permissions(): CommandPermissions {
        return {
            adminRole: true
        }
    }

}