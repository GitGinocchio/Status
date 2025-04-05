import requests

from utils.db import Database
from utils.config import config
from utils.terminal import getlogger

logger = getlogger()

db = Database()

with db:
    db.executeQueryScript("""
UPDATE services
SET endpoint = 'http://188.165.224.198:6398'
WHERE name = 'ggsbot';
""")