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

#To test locally
Change the variables in the `app.js`. You just have to hardcode values inside the `nodecommand.config` (in the .ebextensions folder).
*  accessKey : process.env.S3_ACCESS_KEY,
*  secretKey : process.env.S3_SECRET_KEY,
*  bucket : process.env.S3_BUCKET,

In the ddb.js file
* ddbTable
* AWS.config.region

Then you can just run `node bin/www`

#To terminate the elasticBeanstalk
`eb terminate` then confirm in typing the environment name

#Thanks
To this article to explain how easily using S3
https://leonid.shevtsov.me/post/demystifying-s3-browser-upload/
