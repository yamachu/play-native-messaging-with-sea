SRCS = $(wildcard src/*.ts)
ifeq ($(OS),Windows_NT)
	EXECUTABLE = dist/index.exe
	POSTJECT_OPTIONS =
else
	EXECUTABLE = dist/index
ifeq ($(shell uname -s),Darwin)
	POSTJECT_OPTIONS = --macho-segment-name NODE_SEA
else
	POSTJECT_OPTIONS =
endif
endif

.PHONY: build clean _codesign _remove_sign

build: dist/index.cjs dist/index.blob $(EXECUTABLE)
	pnpm exec postject $(EXECUTABLE) NODE_SEA_BLOB dist/index.blob \
	--sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 $(POSTJECT_OPTIONS)
	$(MAKE) _codesign

_codesign:
ifeq ($(OS),Windows_NT)
# 	signtool sign /fd SHA256 $(EXECUTABLE)
else ifeq ($(shell uname -s),Darwin)
	codesign --sign - $(EXECUTABLE)
endif

dist/index.cjs: $(SRCS)
	pnpm build

dist/index.blob: dist/index.cjs
	node --experimental-sea-config sea-config.json

# https://nodejs.org/api/single-executable-applications.html
# command -v node が使われいるが、nodenv とかで切り替えている場合、実行ファイルを取得できないため、全部 copyFileSync に変更
$(EXECUTABLE):
	node -e "require('fs').copyFileSync(process.execPath, '$@')"
	$(MAKE) _remove_sign

_remove_sign:
ifeq ($(OS),Windows_NT)
# 	signtool remove /s $(EXECUTABLE)
else ifeq ($(shell uname -s),Darwin)
	codesign --remove-signature $(EXECUTABLE)
endif

clean:
	@rm -rf dist
