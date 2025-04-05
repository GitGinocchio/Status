import requests

from utils.db import Database
from utils.config import config
from utils.terminal import getlogger

logger = getlogger()

db = Database()

with db:
    db.executeQueryScript("""
UPDATE services
SET endpoint = 'http://fi5.bot-hosting.net:21662'
WHERE name = 'ggsbot';
""")