from utils.templates import build_page, loader

data = {

}



def main(): 
    for template_name in loader.list_templates():
        build_page(template_name, data=data)

if __name__ == "__main__":
    main()
