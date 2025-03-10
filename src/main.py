from utils.db import Database
from utils.config import config
import requests

db = Database()


with db:
    name = "Google"
    display_name="Google website"
    description="Google website"
    endpoint="https://www.google.com"
    type="HTTP"
    
    if not db.hasService(name):
        db.addService(
            name=name, 
            display_name=display_name,
            description=description,
            endpoint=endpoint,
            type=type
        )

    code = "UnknownError"
    try:
        response = requests.get("https://www.google.com")
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