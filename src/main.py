from utils.db import Database
import requests

db = Database()


with db:
    """
    db.addService(
        name="Google", 
        display_name="Google website",
        description="Google website",
        endpoint="https://www.google.com",
        type="HTTP"
    )
    """

    try:
        response = requests.get("https://www.google.com")
        response.raise_for_status()
    except requests.HTTPError as e:
        latency = e.response.elapsed.total_seconds()
        code = e.response.status_code
        status = e.response.reason
    except requests.ConnectionError as e:
        if e.response:
            latency = e.response.elapsed.total_seconds()
            code = e.response.status_code
            status = e.response.reason
        else:
            latency = float('inf')
            code = 404
            status = str(e.strerror)
    else:
        latency = response.elapsed.total_seconds()
        code = response.status_code
        status = response.reason

    db.addMetric("Google", code, latency, status)