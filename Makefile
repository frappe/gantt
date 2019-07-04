.PHONY: start
.PHONY: build
.PHONY: publish

start: build
	open ./index.html

build:
	yarn run rollup -c

publish:
	yarn publish --access public
