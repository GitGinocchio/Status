
.PHONY: install run build

venv:

ifeq ($(OS), Windows_NT)
	@if not exist .venv ( python3 -m venv .venv )
else
	@if [ ! -d ".venv" ]; then python3 -m venv .venv; fi
endif

install:
	@make venv
	@pip3 install -r requirements.txt
	@echo Installation completed.

build: 
	@make venv
	python ./src/build.py
	@echo Build completed.

unbuild:
	@make venv
	python ./src/unbuild.py
	@echo Unbuild completed.


run:
	@make venv
	python ./src/main.py
