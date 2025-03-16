from utils.templates import loader, build_dir
import os

if __name__ == "__main__":
    for template_name in loader.list_templates():
        if os.path.exists(f'{build_dir}/{template_name}'):
            os.remove(f'{build_dir}/{template_name}')