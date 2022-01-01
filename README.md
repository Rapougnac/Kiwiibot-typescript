# Kiwiibot but in typescript

Kiwiibot, but in typescript 'cause I was bored

This is just a refactored version in typescript of [Kiwiibot](https://github.com/Rapougnac/Kiwiibot)
I know that I have many errors I the code, but I coded like a dumb in javascript.

## Installation

1. Clone this repo

2.

- **On Windows**
  Run **as admin** powershell, then do the following command

```ps1
Set-ExecutionPolicy Unrestricted
```

Now, move to the directory of the bot, e.g

```bash
cd path/to/folder
```

And then, you can write

```ps1
.\setup.ps1
```

Once it's done, you can re-set the execution policy to restricted (default)

```ps1
Set-ExecutionPolicy Restricted
```

And you're ready to go!

### Or use [`ts-node`](https://github.com/TypeStrong/ts-node) to run the bot.

```ps1
ts-node --files .\index.ts
```

<br />
<br />

- **On Linux**
  Go to the directory of the bot, and then, type

```bash
./setup.sh
```

And you're ready to go!

### Or use [`ts-node`](https://github.com/TypeStrong/ts-node) to run the bot.

```bash
ts-node --files ./index.ts
```

- ## Requirements
  - Have MySql installed on your computer.
  - Have Nodejs installed on your computer.
  - Have TypeScript installed on your computer.
  - Have Python on your computer.

# MySql Structure

There are currently 2 tables, `guildsettings` & `usersettings`

### Guild settings schema

| #   | Name         | Type        | Collation       | Attributes | Null | Default |
| --- | ------------ | ----------- | --------------- | ---------- | ---- | ------- |
| 1   | [PK] guildId | CHAR(18)    | utf8_unicode_ci |            | No   | _None_  |
| 2   | language     | VARCHAR(50) | utf8_unicode_ci |            | Yes  | NULL    |
| 3   | prefix       | VARCHAR(5)  | utf8_unicode_ci |            | Yes  | NULL    |
| 4   | channelLogs  | CHAR(18)    | utf8_unicode_ci |            | Yes  | NULL    |

### User settings schema

| #   | Name                 | Type         | Collation       | Attributes | Null | Default |
| --- | -------------------- | ------------ | --------------- | ---------- | ---- | ------- |
| 1   | [PK] id              | CHAR(18)     | utf8_unicode_ci |            | No   | _None_  |
| 2   | bio                  | VARCHAR(255) | utf8_unicode_ci |            | Yes  | NULL    |
| 3   | thanks               | SMALLINT(6)  |                 |            | Yes  | NULL    |
|     | rateLimitedUpdatedAt | DATETIME     |                 |            | Yes  | NULL    |
