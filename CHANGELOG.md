Kiwiibot


<a name="v2.2.0"></a>
## v2.2.0

> 2021-12-24

### Bug Fixes

* body-case to sentence-case ([141786e](https://github.com/Rapougnac/Kiwiibot-typescript/commit/141786e37bb56470ba4ab421b8efd942163a4d89))
* Typo locales ([989e11b](https://github.com/Rapougnac/Kiwiibot-typescript/commit/989e11be45f7bd35b68266e1f568ca3c56c747f0))
* **Event:** Event on/once ([420c76d](https://github.com/Rapougnac/Kiwiibot-typescript/commit/420c76d3166c49f6ebc56cc0d7b9d44247c6e0b5))
* **InteractionCreate:** Added instanceof CommandInteraction ([fba18b4](https://github.com/Rapougnac/Kiwiibot-typescript/commit/fba18b4d18ef306003ea873d31fe6f203d61ba36))
* **PHCommentCommand:** Fix axios response ([4dd1681](https://github.com/Rapougnac/Kiwiibot-typescript/commit/4dd1681ad369a40d57ef6bdb742182a7e79e48a7))
* **PingCommand:** Unknow interaction triggers ([947d5ef](https://github.com/Rapougnac/Kiwiibot-typescript/commit/947d5ef12a7405fe265917917e2bd7df8de2d974))
* **PrefixResetCommand:** Fix filter ([dcbb90c](https://github.com/Rapougnac/Kiwiibot-typescript/commit/dcbb90c76e673994fe817a7530ea737abfb04be9))
* **ReadyEvent:** Fixed const assertion ([27ba029](https://github.com/Rapougnac/Kiwiibot-typescript/commit/27ba029d13f1ad1eb78238317a63ac96305dbd8f))
* **SlashCommand:** Fixed types ([4d336d8](https://github.com/Rapougnac/Kiwiibot-typescript/commit/4d336d8996d677cc237be7f4dd14a694718c10d0))
* **Transcript:** Awaited react ([d631afd](https://github.com/Rapougnac/Kiwiibot-typescript/commit/d631afdd4ccfd3384d5dbe7a5e76a6c94537a6fb))
* **TrumpSlashCommand:** Checked if text is > 20 chars ([be7859e](https://github.com/Rapougnac/Kiwiibot-typescript/commit/be7859e522041b100d2a8cbd684eb18614bb608f))
* **load:** Set default locale to all guilds ([3f76bd5](https://github.com/Rapougnac/Kiwiibot-typescript/commit/3f76bd570377a4a437b60f7193bcf23261481f24))

### Chore

* Tabwidth to `2` ([a76e81e](https://github.com/Rapougnac/Kiwiibot-typescript/commit/a76e81efaf77102611349cecad35ffb405f20eb1))
* Deleted crowdin.yml ([d3d69c3](https://github.com/Rapougnac/Kiwiibot-typescript/commit/d3d69c39b4a657ac484dc39e37877c9705e0a42d))
* Added `yoda` rule ([3a172f0](https://github.com/Rapougnac/Kiwiibot-typescript/commit/3a172f0c828dbc16614dc18292f1d02f74b6bb57))
* Git ignored `.env` ([37287c0](https://github.com/Rapougnac/Kiwiibot-typescript/commit/37287c0f1d4ab2ba14921cf8070eb63630e93951))
* **setup:** Forgot to install dependencies ([dc62ca3](https://github.com/Rapougnac/Kiwiibot-typescript/commit/dc62ca35def7bd26dd7fe15b3c99ed2329098594))

### Code Refactoring

* Removed eslint comment ([c99ad46](https://github.com/Rapougnac/Kiwiibot-typescript/commit/c99ad46e8b7d4a593413ab6aa30f4f1d770a41c5))
* Format amethyste ([7597469](https://github.com/Rapougnac/Kiwiibot-typescript/commit/759746948f14a9ac735ebd5a03d0979eb327191a))
* Prettier tab width to 2 ([160e77d](https://github.com/Rapougnac/Kiwiibot-typescript/commit/160e77d18cac9762c0f2560288ed9fcd484a7848))
* fr.json ([8b9760a](https://github.com/Rapougnac/Kiwiibot-typescript/commit/8b9760aaeb13edc4c70ee5e1be8afdfe79de338a))
* **Client:** Prettier ([e6b3446](https://github.com/Rapougnac/Kiwiibot-typescript/commit/e6b3446d574f3d78d263207b7f6eeb4935a4937c))
* **Commands:** Applied prettier rules ([b8dc869](https://github.com/Rapougnac/Kiwiibot-typescript/commit/b8dc869d762c91da9b7ec3b11d43bd54749a6443))
* **SlashCommand:** Use discord.js's types ([d874733](https://github.com/Rapougnac/Kiwiibot-typescript/commit/d874733cc23e93e12384c74a8c0dd4d7641813ca))
* **Transcript:** Filter for channels (`GUILD_TEXT`) ([715b272](https://github.com/Rapougnac/Kiwiibot-typescript/commit/715b272222464b6a97dde89da9eb593c2e69f317))
* **locales:** Prettier ([e93b4b3](https://github.com/Rapougnac/Kiwiibot-typescript/commit/e93b4b3e01abd674025f6d5d8389f7b31c5356cb))

### Docs

* **Readme:** Add python notice ([fbd2f76](https://github.com/Rapougnac/Kiwiibot-typescript/commit/fbd2f7649d83b9ba1b4a91d818e298ca7c44eb4d))

### Features

* Add transcript in slash commands ([9365e52](https://github.com/Rapougnac/Kiwiibot-typescript/commit/9365e5280cdd8e446a8b2c903a446e78b47bd1b2))
* Added bdsm.ts ([54bd031](https://github.com/Rapougnac/Kiwiibot-typescript/commit/54bd0316df9281ce6bd43c3de323263e9ab7c1af))
* Add commit lint ([076fa2a](https://github.com/Rapougnac/Kiwiibot-typescript/commit/076fa2a7da3c17b659e5708fc06a8d4e4f67167e))
* Added AnimeSlashCommand ([7010d55](https://github.com/Rapougnac/Kiwiibot-typescript/commit/7010d5593a2f67a2fcb0e6665ac2084a87f59d88))
* Add interaction support loading bar ([353d69c](https://github.com/Rapougnac/Kiwiibot-typescript/commit/353d69c1fd847a559fe3930220d26babe0d02f22))
* Created trump.ts ([5e1b0c6](https://github.com/Rapougnac/Kiwiibot-typescript/commit/5e1b0c6af7a8d165c2df20b6a199e1cfa1493d96))
* Add rule34.ts slash ([f17285c](https://github.com/Rapougnac/Kiwiibot-typescript/commit/f17285c9fd10fa5b26ad8bc875b09a933a419390))
* Added new strings ([9e8d4e7](https://github.com/Rapougnac/Kiwiibot-typescript/commit/9e8d4e7639e47cb08205fb828d193c4a545a3653))
* Added message delete + setlogs ([928b50a](https://github.com/Rapougnac/Kiwiibot-typescript/commit/928b50ac89c124005729ec428a79419d822b638a))
* **AvatarCommand:** Added translated description ([18f37a1](https://github.com/Rapougnac/Kiwiibot-typescript/commit/18f37a1f9d7f39e1856943f3dfab289f60a6fc1f))
* **CommandInteraction:** Added CommandInteraction#react() ([9f1aa3d](https://github.com/Rapougnac/Kiwiibot-typescript/commit/9f1aa3d3c5ab0a68c2b0df761c4a9c6461b27e9a))
* **CommandInteraction:** Import for side-effects ([b0d61e8](https://github.com/Rapougnac/Kiwiibot-typescript/commit/b0d61e83883ce8ee2db0c60302d929193f486d70))
* **LookWhatKarenHave:** Added lookwhatkarenhave ([5f8a3b5](https://github.com/Rapougnac/Kiwiibot-typescript/commit/5f8a3b554ef60d73ebf333881836c3b5ab78f149))
* **ReadyEvent:** Refactor code + added dashboard ([2914acf](https://github.com/Rapougnac/Kiwiibot-typescript/commit/2914acf3d6d1013204322bf3240b32b9a4afc704))
* **Typings:** Added typings for CommandInteraction#react() ([19e7a3b](https://github.com/Rapougnac/Kiwiibot-typescript/commit/19e7a3b3a8ed95dfa1dd1d97487fd5a12bfec15d))

### Types

* **akaneko:** Override base typings ([3ea900e](https://github.com/Rapougnac/Kiwiibot-typescript/commit/3ea900e5297754d223c03671daaf1831076b8a1c))

### Pull Requests

* Merge pull request [#5](https://github.com/Rapougnac/Kiwiibot-typescript/pull/5) from Rapougnac/dev
* Merge pull request [#10](https://github.com/Rapougnac/Kiwiibot-typescript/pull/10) from Rapougnac/mysql
* Merge pull request [#7](https://github.com/Rapougnac/Kiwiibot-typescript/pull/7) from Rapougnac/add-license
* Merge pull request [#6](https://github.com/Rapougnac/Kiwiibot-typescript/pull/6) from Rapougnac/dev-eslint
* Merge pull request [#2](https://github.com/Rapougnac/Kiwiibot-typescript/pull/2) from Rapougnac/v13

