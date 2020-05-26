var botName = require('./package.json').name
const configFile = 'claimsy.yml'
const defaultConfig = {
  selfAssignCommands: ['assign me'],
  assignCommands: ['assign USERNAME'],
  enableUniversalAssign: false, 
  enableDefaultLabels: false,
  defaultLabels: []
}

module.exports = app => {

  app.on('issue_comment.created', async context => {
    // Ignore if the comment was made by the bot
    if (context.payload.comment.user.login === botName + '[bot]') { return }

    const config = await context.config(configFile, defaultConfig)

    let assignToUser = {
      assign: false,
      user: context.payload.comment.user.login
    }

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
    

    // Check for mentions only if not self-assigned
    if (config.enableUniversalAssign && assignToUser.assign !== true) {
      // Check for mentioned user assignments
      config.assignCommands.forEach((command) => {
        command = command.toLowerCase()
        if (commentBody.includes(command.replace('username', '@$').split('$')[0])) {
          if (assignToUser.assign !== true) {
            assignToUser = {
              assign: true,
              user: commentBody.split(command.split('username')[0])[1].split(' ')[0].replace('@', '')
            }
          }
        }
      })
    }

    
    // Check for duplicate assignment
    context.payload.issue.assignees.forEach((user) => {
      if (assignToUser.user === user.login) {
        assignToUser.assign = false
      }
    })
    

    // Do nothing for non-assignment comments
    if (assignToUser.assign === false) { return }

    // Choose photo
    const img = (Math.random() * 10 % 2 === 0 ? 'https://media1.tenor.com/images/494ba2ef2a2826323f5bf82e9e357283/tenor.gif?itemid=16349021' : 'https://media1.tenor.com/images/72a9ce1fe0e4b94d46684ad710b27c13/tenor.gif')

    const newAssignees = context.issue({ assignees: assignToUser.user })
    await context.github.issues.addAssignees(newAssignees)
    
    return context.github.issues.createComment(context.issue({ body: '<h3 align="center">Done! 🎉 </h3> \n\n ![image](' + img + ')' }))
  })
}
