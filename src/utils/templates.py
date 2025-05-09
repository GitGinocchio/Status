from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup
from functools import partial
from .config import config
from os import makedirs
from os.path import dirname, relpath, abspath, join, normpath

templates_dir : str = config['templates-dir']
build_dir : str = config['build-dir']

loader = FileSystemLoader(templates_dir)
env = Environment(loader=loader, autoescape=True, trim_blocks=True, lstrip_blocks=True)

def relative_url(filename : str, base : str):
    normalized = normpath(filename)
    if not base or base == '/404': return normalized if filename.startswith((".")) else "." + normalized
    return relpath(filename,base)

templates = loader.list_templates()

def build_page(template_name: str, **kwargs):
    template = env.get_template(template_name)
    page = template.render(**kwargs, 
                           relative_url=partial(relative_url, base=dirname(template_name)),
                           default_route='/Status'
    )

    template_path = f"{build_dir}/{template_name}"

    makedirs(dirname(template_path), exist_ok=True)

    with open(template_path, "w", encoding='utf-8') as file: 
        file.write(page)