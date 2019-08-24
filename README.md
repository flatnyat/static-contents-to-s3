
### コンテナ

```
$ docker run -it --rm -v $PWD:/app --env-file .env -w /app node:10 /bin/bash
```

```
# yarn run deploy -- --stage dev
```