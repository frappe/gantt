.PHONY: start
.PHONY: build

start: build
	open ./index.html

build:
	yarn run rollup -c
