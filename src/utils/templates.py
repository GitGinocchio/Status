from jinja2 import Environment, FileSystemLoader
from .config import config

templates_dir : str = config['templates-dir']
build_dir : str = config['build-dir']

loader = FileSystemLoader(templates_dir)
env = Environment(loader=loader, autoescape=True)

def build_page(template_name: str, **kwargs):
    template = env.get_template(template_name)
    page = template.render(**kwargs)

    with open(f"{build_dir}/{template_name}", "w", encoding='utf-8') as file: 
        file.write(page)