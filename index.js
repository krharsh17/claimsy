var botName = require('./package.json').name
const configFile = 'claimsy.yml'
const defaultConfig = {
  selfAssignCommands: ['assign me'],
  assignCommands: ['assign USERNAME'],
  reviewers: []
}

module.exports = app => {

  app.on('issue_comment.created', async context => {
    // Ignore if the comment was made by the bot
    if (context.payload.comment.user.login === botName + '[bot]') { return }

    context.log("1")

    const config = await context.config(configFile, defaultConfig)

    let assignToUser = {
      assign: false,
      user: context.payload.comment.user.login
    }
    context.log("2")

    // Extract comment body
    const commentBody = context.payload.comment.body.toString().toLowerCase()

    // Check for self-assignments
    config.selfAssignCommands.forEach((command) => {
      if (commentBody.includes(command.toLowerCase())) {
        assignToUser = {
          assign: true,
          user: context.payload.comment.user.login
        }
      }
    })
    
    context.log("3")

    // Check for mentions only if not self-assigned
    if (assignToUser.assign !== true) {
      // Check for mentioned user assignments
      config.assignCommands.forEach((command) => {
        command = command.toLowerCase()
        context.log(command)
        // eslint-disable-next-line no-useless-escape
        if (commentBody.includes(command.replace('username', '@$').split('$')[0])) {
          if (assignToUser.assign !== true) {
            assignToUser = {
              assign: true,
              user: commentBody.split(command.split('username')[0])[1].split(' ')[0].replace('@', '')
            }
          }
          context.log(assignToUser.assign)
          context.log(assignToUser.user)
        }
      })
    }

    
    context.log("4")
    // Check for duplicate assignment
    context.payload.issue.assignees.forEach((user) => {
      if (assignToUser.user === user.login) {
        assignToUser.assign = false
      }
    })
    
    context.log("5")

    // Do nothing for non-assignment comments
    if (assignToUser.assign === false) { return }

    context.log("6")
    // Choose photo
    const img = (Math.random() * 10 % 2 === 0 ? 'https://media1.tenor.com/images/494ba2ef2a2826323f5bf82e9e357283/tenor.gif?itemid=16349021' : 'https://media1.tenor.com/images/72a9ce1fe0e4b94d46684ad710b27c13/tenor.gif')

    context.log("7")
    const newAssignees = context.issue({ assignees: assignToUser.user })

    context.log("8")
    await context.github.issues.addAssignees(newAssignees)
    
    context.log("9")
    return context.github.issues.createComment(context.issue({ body: '<h3 align="center">Done! 🎉 </h3> \n\n ![image](' + img + ')' }))
  })
}
