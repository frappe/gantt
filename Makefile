.PHONY: start

build:
	yarn build

start: build
	open ./index.html
