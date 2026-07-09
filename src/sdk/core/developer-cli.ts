export type CLICommandDefinition = {
  name: string
  description: string
  category: "scaffold" | "diagnostics" | "docs" | "marketplace" | "package"
}

export type TemplateDefinition = {
  id: string
  name: string
  description: string
  language: string
}

export class DeveloperCLIRegistry {
  private readonly commands = new Map<string, CLICommandDefinition>()
  private readonly templates = new Map<string, TemplateDefinition>()

  registerCommand(command: CLICommandDefinition): void {
    this.commands.set(command.name, command)
  }

  listCommands(): CLICommandDefinition[] {
    return Array.from(this.commands.values())
  }

  registerTemplate(template: TemplateDefinition): void {
    this.templates.set(template.id, template)
  }

  listTemplates(): TemplateDefinition[] {
    return Array.from(this.templates.values())
  }
}
