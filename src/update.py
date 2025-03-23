import requests

from utils.db import Database
from utils.config import config
from utils.terminal import getlogger

logger = getlogger()

db = Database()

with db:

    for service in db.getServices():
        name = service['name']
        endpoint = service['endpoint']

        code = "UnknownError"
        try:
            response = requests.head(endpoint, timeout=5)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            if e.response:
                latency = e.response.elapsed.total_seconds()
                code = e.response.status_code
            else:
                exception_type = e.__class__.__name__
                latency = None
                code = e.errno if e.errno else exception_type
        else:
            latency = response.elapsed.total_seconds()
            code = response.status_code
        finally:
            status : str = config['default-errors'].get(str(code), config['default-errors']["UnknownError"])

        db.addMetric(name, code, latency, status)