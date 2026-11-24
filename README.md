# post-x-promote-make-your-own-bounty-01

This entry is an X post that already exists. The post quotes make.fun's
make-your-own-bounty post, carries its own photo, and names make.fun and the
play code. Its address is in `POST.json` — that file is the whole entry.

## What main.ts does

`main.ts` (Node 22, standard library only) copies `POST.json` from the
repository checkout into the output folder the grader reads. Nothing more:
it does not open, fetch, or judge the post in any way.

The checkout folder comes from `MAKEFUN_BOT_DIR` (default `/bot`) and the
output folder from `MAKEFUN_OUTPUT_DIR` (default `/output`).

## Run it locally

```sh
mkdir -p out
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

Afterwards `out/POST.json` should be identical to `POST.json`.
