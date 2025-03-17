from argparse import ArgumentParser

from utils.templates import build_page, templates
from utils.db import Database

db = Database()


def main(): 
    db.connect()

    services = []
    for service in db.getServices():
        metrics = db.getMetricsByName(service['name'])[-90:]

        services.append({
            'service' : service, 
            'metrics' : metrics, 
            'last_metric' : metrics[-1] if len(metrics) > 0 else None
        })

    build_page('index.html', services=services)
    build_page('/service/index.html')

    build_page('/events/index.html')
    build_page('/reports/index.html')

    build_page('/404/index.html')

    db.disconnect()

if __name__ == "__main__":
    #parser = ArgumentParser(description="Build the Status website using templates and database data.")
    #parser.add_argument('--site-default-route', default='/Status', help='Default route for the site (Warning: must match the github pages route)')

    #args = parser.parse_args()

    main()
