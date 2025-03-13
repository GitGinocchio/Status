from jinja2 import Environment, FileSystemLoader
from .config import config
from os import makedirs
from os.path import dirname

templates_dir : str = config['templates-dir']
build_dir : str = config['build-dir']

loader = FileSystemLoader(templates_dir)
env = Environment(loader=loader, autoescape=True, trim_blocks=True, lstrip_blocks=True)

templates = loader.list_templates()

def build_page(template_name: str, **kwargs):
    template = env.get_template(template_name)
    page = template.render(**kwargs)

    template_path = f"{build_dir}/{template_name}"

    makedirs(dirname(template_path), exist_ok=True)

    with open(template_path, "w", encoding='utf-8') as file: 
        file.write(page)