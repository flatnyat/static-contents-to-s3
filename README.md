### About

Deploy static contents from CodePipeline to S3. (invoke Lambda)

### How to use

1. `.env`

```.env
AWS_ACCESS_KEY_ID={Your AWS Access Key ID}
AWS_SECRET_ACCESS_KEY={Your AWS Secret Access Key}
```

2. Configure Docker.

```
$ docker run -it --rm -v $PWD:/app --env-file .env -w /app node:10 /bin/bash
```

3. Execute command inside container.

```
# yarn run deploy -- --stage dev
```