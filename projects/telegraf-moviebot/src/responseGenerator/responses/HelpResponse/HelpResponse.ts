import { StatelessLocalResponse } from "../StatelessLocalResponse";

export type HelpDefinitions = { [key: string]: string };

export class HelpResponse extends StatelessLocalResponse {
  helpDefinitions: HelpDefinitions;
  commands: string[];

  constructor(helpDefinitions: HelpDefinitions, commands: string[]) {
    super();
    this.helpDefinitions = helpDefinitions;
    this.commands = commands;
  }

  fire = (): string => {
    let response = "";

    for (let index = 0; index < this.commands.length; index++) {
      const command = this.commands[index];
      response = `${response}\n${command}: ${this.helpDefinitions[command]}`;
    }
    return response;
  };
}
