#For init the eb in cli inside the node-express folder
Note : The node-express folder must have a git initiated
`eb init --platform node.js --region eu-west-1`
`eb create --sample node-express-env`

#To deploy a newest version
`git add <modified files>`
`git commit -m "<MYTEXT>"`

`eb deploy`

#To open the browser
`eb open`
