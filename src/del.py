from utils.db import Database
from utils.config import config
import requests

db = Database()


with db:
    name = "Google"

    if db.hasService(name):
        db.delService(name)