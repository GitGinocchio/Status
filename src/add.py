from utils.db import Database
from utils.config import config
import requests

db = Database()


with db:
    name = "captchapi"
    display_name="Captcha API"
    description="A blazingly fast, Rust-powered RESTful API for generating secure text-based CAPTCHA images."
    url="https://captchapi.giulioo.workers.dev"
    endpoint="https://captchapi.giulioo.workers.dev/status"
    type="HTTP"
    method="HEAD"
    
    if not db.hasService(name):
        db.addService(
            name=name, 
            display_name=display_name,
            description=description,
            url=url,
            endpoint=endpoint,
            type=type,
            method=method
        )