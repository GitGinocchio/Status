
.PHONY: install run build

venv:

ifeq ($(OS), Windows_NT)
	@if not exist .venv ( python -m venv .venv )
else
	@if [ ! -d ".venv" ]; then python3 -m venv .venv; fi
endif

install:
	@make venv
	@pip install -r requirements.txt
	@echo Installation completed.

build: 
	@make venv
	python ./src/build.py
	@echo Build completed.

unbuild:
	@make venv
	python ./src/unbuild.py
	@echo Unbuild completed.

add:
	@make venv
	python ./src/add.py
	@echo Add completed.

del:
	@make venv
	python ./src/del.py
	@echo Del completed.

update:
	@make venv
	python ./src/update.py
	@echo Update completed.

run:
	@make venv
	python ./src/main.py
