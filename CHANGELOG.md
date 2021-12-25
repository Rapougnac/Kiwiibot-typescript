
<a name="v2.2.0"></a>
## v2.2.0

> 2021-12-24

### Chore

* Tabwidth to `2`
* Deleted crowdin.yml
* Added `yoda` rule
* Git ignored `.env`
* **setup:** Forgot to install dependencies

### Docs

* **Readme:** Add python notice

### Feat

* Add transcript in slash commands
* Added bdsm.ts
* Add commit lint
* Added AnimeSlashCommand
* Add interaction support loading bar
* Created trump.ts
* Add rule34.ts slash
* Added new strings
* Added message delete + setlogs
* **AvatarCommand:** Added translated description
* **CommandInteraction:** Added CommandInteraction#react()
* **CommandInteraction:** Import for side-effects
* **LookWhatKarenHave:** Added lookwhatkarenhave
* **ReadyEvent:** Refactor code + added dashboard
* **Typings:** Added typings for CommandInteraction#react()

### Fix

* body-case to sentence-case
* Typo locales
* **Event:** Event on/once
* **InteractionCreate:** Added instanceof CommandInteraction
* **PHCommentCommand:** Fix axios response
* **PingCommand:** Unknow interaction triggers
* **PrefixResetCommand:** Fix filter
* **ReadyEvent:** Fixed const assertion
* **SlashCommand:** Fixed types
* **Transcript:** Awaited react
* **TrumpSlashCommand:** Checked if text is > 20 chars
* **load:** Set default locale to all guilds

### Refactor

* Removed eslint comment
* Format amethyste
* Prettier tab width to 2
* fr.json
* **Client:** Prettier
* **Commands:** Applied prettier rules
* **SlashCommand:** Use discord.js's types
* **Transcript:** Filter for channels (`GUILD_TEXT`)
* **locales:** Prettier

### Types

* **akaneko:** Override base typings

### Pull Requests

* Merge pull request [#5](https://github.com/Rapougnac/Kiwiibot-typescript/issues/5) from Rapougnac/dev
* Merge pull request [#10](https://github.com/Rapougnac/Kiwiibot-typescript/issues/10) from Rapougnac/mysql
* Merge pull request [#7](https://github.com/Rapougnac/Kiwiibot-typescript/issues/7) from Rapougnac/add-license
* Merge pull request [#6](https://github.com/Rapougnac/Kiwiibot-typescript/issues/6) from Rapougnac/dev-eslint
* Merge pull request [#2](https://github.com/Rapougnac/Kiwiibot-typescript/issues/2) from Rapougnac/v13

