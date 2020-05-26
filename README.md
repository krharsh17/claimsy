<h1 align="center">Claimsy</h1>

<span style="display:block;text-align:center">![image](https://media1.tenor.com/images/72a9ce1fe0e4b94d46684ad710b27c13/tenor.gif)</span>

A GitHub App built with [Probot](https://github.com/probot/probot) that helps maintainers by automatically assigning willing contributors to issues! 🎉

## How does it work?

**Step 1** 👨‍💻 - A willing user comments on an issue with phrases like "Please assign me" or "I'd like to work on this"

**Step 2** 🤖 - The bot will automatically recognize the comment and assign the commenter! 

> ***Alternatively*** - You can try configuring the bot to recognize @mentions in comments and assign users accordingly!


![image](https://media.tenor.com/images/618576ebcc4f6d2a12438624be77c54f/tenor.gif)

## How do I get it running?

- Simply go to the app listing and click the install button
- Choose your account & repository, and install the app!
- Optionally, you can provide a `.github/claimsy.yml` in your repo to customize some features of the app

## Customizations?

Here's a sample `.github/claimsy.yml` to let you know how to tell Claimsy what comments to look for - 

```yml
# Commands to allow contributors to get issues assigned to themselves
selfAssignCommands:
  - I'll do it
  - May I do it

# A flag value to allow anyone to assign anyone to an issue. This is currently experimental so use it at your own risk!
allowUserAssignments: false

# Commands to allow anyone to assign issues to anyone, including themselves
assignCommands:
  - assign this to USERNAME
  - will be done by USERNAME

# Remember to put in the term USERNAME as a placeholder for the @mentions that will be made in comments
```

Clarification:
> To handle a comment such as 'assign this issue to @krharsh17', make sure to include 'assign this issue to USERNAME' in your `assignCommands` list. The keyword USERNAME is mandatory and to be used as is for placeholder of @mentions


## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Contributing

If you have suggestions for how claim-issue-probot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2020 krharsh17 <kharsh39@gmail.com>
