from utils.db import Database
from utils.config import config
import requests

db = Database()


with db:
    name = "google"
    display_name="Google"
    description="google search engine"
    endpoint="https://google.com"
    type="HTTP"
    
    if not db.hasService(name):
        db.addService(
            name=name, 
            display_name=display_name,
            description=description,
            endpoint=endpoint,
            type=type
        )