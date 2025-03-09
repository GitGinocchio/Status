
.PHONY: install

venv:

ifeq ($(OS), Windows_NT)
	@if not exist .venv ( python3 -m venv .venv )
else
	@if [ ! -d ".venv" ]; then python3 -m venv .venv; fi
endif

install:
	@make venv
	@pip3 install -r dev-requirements.txt

run:
	@make venv
	python ./src/main.py
