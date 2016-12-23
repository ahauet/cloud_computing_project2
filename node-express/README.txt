# Launching the web application from eb cli.

You need to add three environment variables in the file /node-express/.ebextensions/nodecommand.config
Add these lines with the correct indentation (it's a yaml file). With the corresponding attributes.

`
aws:elasticbeanstalk:application:environment:
    AWS_REGION : REGION
    S3_ACCESS_KEY: ACCESS
    S3_SECRET_KEY: SECRET
    S3_BUCKET: BUCKET
    CDN : URL
`

If you want to launch the website from the eb cli (need extra instalation), you have to create a git from this folder.
`git init`
`git add .`
`git commit -m "First deployment"`

After that you need to create the eb environment :
`eb init --platform node.js --region eu-west-1`
`eb create --sample lingi2145-project2`
`eb deploy`
`eb open`
