from datetime import datetime, timezone
from typing import Any
import sqlite3
import json

from utils.config import config
from utils.commons import isonline
from utils.queries import *
from utils.terminal import getlogger

logger = getlogger()

DATABASE_PATH = "./data/database.db"
SCRIPT_PATH = "./config/database.sql"

def extendavg(avg : float, n : int, element : float): return (avg * n + element) / (n + 1)

class Database:
    _instance = None
    def __init__(self):
        self._connection : sqlite3.Connection
        self._cursor : sqlite3.Cursor | None = None
        self.datefmt : str = config['db']['datefmt']

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._connection = sqlite3.connect(DATABASE_PATH)
            cls._connection.row_factory = sqlite3.Row

            with open(SCRIPT_PATH, "r") as f:
                cls._connection.executescript(f.read())
        return cls._instance

    def __enter__(self):
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, traceback):
        self.disconnect()

    @property
    def connection(self) -> sqlite3.Connection:
        if not self._connection: raise RuntimeError("Cursor has not been created yet")
        return self._connection

    @property
    def cursor(self) -> sqlite3.Cursor:
        if not self._cursor: raise RuntimeError("Cursor has not been created yet")
        return self._cursor

    def connect(self):
        self._cursor = self.connection.cursor()

    def disconnect(self):
        if self._cursor: self._cursor.close()
        self._cursor = None

    def executeQueryScript(self, script : str) -> None:
        logger.debug(f'Executing query script: {script}')
        self.cursor.executescript(script)
    
    def executeQuery(self, query : str, params : tuple | list = ()) -> sqlite3.Cursor:
        logger.debug(f'Executing query: {query} with params: {params}')
        return self.cursor.execute(query, params)

    def exportToJSON(self, filename : str):
        try:
            cursor = self.executeQuery("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()

            json_data = {}

            # Esporta i dati di ogni tabella in formato JSON
            for table in tables:
                table_name = table[0]
                cursor.execute(f"SELECT * FROM {table_name};")
                rows = cursor.fetchall()

                columns = [description[0] for description in cursor.description]
                table_data = [dict(zip(columns, row)) for row in rows]
                json_data[table_name] = table_data

            with open(filename, 'w') as f:
                json.dump(json_data, f, indent='\t')
        
        except sqlite3.IntegrityError as e: raise e

    # Services

    def getServices(self):
        try:
            cursor = self.executeQuery(GET_ALL_SERVICES_QUERY)
            result = cursor.fetchall()
        except sqlite3.IntegrityError as e: raise e
        else: 
            return [dict(row) for row in result]

    def addService(self, name : str, display_name : str, description : str, url : str, endpoint : str, type : str, method : str, enabled : bool = True):
        try:
            cursor = self.executeQuery(
                NEW_SERVICE_QUERY, 
                (name, display_name, description, url, endpoint, type, method, enabled, datetime.now(timezone.utc).strftime(self.datefmt))
            )
        except sqlite3.IntegrityError as e:
            self.connection.rollback()
            raise e
        else:
            self.connection.commit()

    def delService(self, name : str):
        try:
            self.executeQuery(DEL_SERVICE_QUERY, (name,))
        except sqlite3.IntegrityError as e:
            self.connection.rollback()
            raise e
        else:
            self.connection.commit()

    def setService(self, name : str, enabled : bool):
        try:
            cursor = self.executeQuery(SET_SERVICE_QUERY, (enabled, name))
        except sqlite3.IntegrityError as e:
            self.connection.rollback()
            raise e
        else:
            self.connection.commit()

    def hasService(self, name : str):
        try:
            cursor = self.executeQuery(HAS_SERVICE_QUERY, (name,))
            result = cursor.fetchone()
        except sqlite3.IntegrityError as e: raise e
        else: return result

    # Metrics

    def getMetrics(self):
        try:
            cursor = self.executeQuery(GET_ALL_METRICS_QUERY)
            result = cursor.fetchall()
        except sqlite3.IntegrityError as e: raise e
        else: 
            return [dict(row) for row in result]
        
    def getMetricsByName(self, name : str):
        try:
            cursor = self.executeQuery(GET_ALL_METRICS_BY_NAME_QUERY, (name,))
            result = cursor.fetchall()
        except sqlite3.IntegrityError as e: raise e
        else: 
            return [dict(row) for row in result]

    def addMetric(self, name : str, code : int | str | None, latency : float | None, status : str | None):
        try:
            cursor = self.cursor.execute(GET_LAST_METRIC, (name,))
            last_metric = cursor.fetchone()

            now = datetime.now(timezone.utc)
            timestamp = now.strftime(self.datefmt)

            last_uptime : str | None
            last_downtime : str | None

            current_uptime_percentage = 100 if isonline(code) else 0

            if not last_metric: 
                last_uptime, last_downtime = (timestamp, None) if isonline(code) else (None, timestamp)

                self.executeQuery(NEW_METRIC_QUERY, (
                    name, 
                    timestamp, 
                    last_uptime,         # last_uptime inizializzato a None o a timestamp
                    last_downtime,       # last_downtime inizializzato a None o a timestamp
                    code, 
                    status,
                    None,
                    None,               # avg/min/max_uptime/downtime inizializzati a None
                    None,               # avg/min/max_uptime/downtime inizializzati a None
                    None,               # avg/min/max_uptime/downtime inizializzati a None
                    None,
                    None,               # avg/min/max_uptime/downtime inizializzati a None
                    None,               # avg/min/max_uptime/downtime inizializzati a None
                    None,               # avg/min/max_uptime/downtime inizializzati a None
                    latency,
                    latency,            # Se la prima metrica allora latenza avg/min/max saranno uguali
                    latency,            # Se la prima metrica allora latenza avg/min/max saranno uguali
                    latency,            # Se la prima metrica allora latenza avg/min/max saranno uguali
                    current_uptime_percentage,
                    current_uptime_percentage,
                    current_uptime_percentage,
                    current_uptime_percentage
                ))
                
                self.connection.commit()
                return
            
            num_metrics = last_metric['rowid']

            if code == last_metric['code']:
                last_uptime, last_downtime = last_metric['last_uptime'], last_metric['last_downtime']
            else:
                last_uptime, last_downtime = (timestamp, last_metric['last_downtime'])  \
                                             if isonline(code) else                     \
                                             (last_metric['last_uptime'], timestamp)

            current_uptime_value = None
            current_downtime_value = None

            if isonline(last_metric['code']):
                last_uptime_timestamp = last_metric['timestamp'] if last_metric['last_uptime'] == None else last_metric['last_uptime']

                current_uptime_value = (now - datetime.strptime(last_uptime_timestamp, self.datefmt).astimezone(timezone.utc)).total_seconds()

                if last_metric['avg_uptime'] == None:
                    avg_uptime = current_uptime_value
                else:
                    avg_uptime = extendavg(last_metric['avg_uptime'], num_metrics, current_uptime_value)

                # Min/Max uptime
                if last_metric['min_uptime'] and current_uptime_value < last_metric['min_uptime']:
                    max_uptime = last_metric['max_uptime']
                    min_uptime = current_uptime_value
                elif last_metric['max_uptime'] and current_uptime_value > last_metric['max_uptime']:
                    min_uptime = last_metric['min_uptime']
                    max_uptime = current_uptime_value
                else:
                    min_uptime = max_uptime = avg_uptime

                min_downtime = last_metric['min_downtime']
                max_downtime = last_metric['max_downtime']
                avg_downtime = last_metric['avg_downtime']
            else:
                last_downtime_timestamp = last_metric['timestamp'] if last_metric['last_downtime'] == None else last_metric['last_downtime']
                
                current_downtime_value = (now - datetime.strptime(last_downtime_timestamp, self.datefmt).astimezone(timezone.utc)).total_seconds()

                if last_metric['avg_downtime'] == None:
                    avg_downtime = current_downtime_value
                else:
                    avg_downtime = extendavg(last_metric['avg_downtime'], num_metrics, current_downtime_value)

                # Min/Max downtime
                if last_metric['min_downtime'] and current_downtime_value < last_metric['min_downtime']:
                    max_downtime = last_metric['max_downtime']
                    min_downtime = current_downtime_value
                elif last_metric['max_downtime'] and current_downtime_value > last_metric['max_downtime']:
                    min_downtime = last_metric['min_downtime']
                    max_downtime = current_downtime_value
                else:
                    min_downtime = max_downtime = avg_downtime

                min_uptime = last_metric['min_uptime']
                max_uptime = last_metric['max_uptime']
                avg_uptime = last_metric['avg_uptime']

            if not last_metric['avg_latency'] or not last_metric['min_latency'] or not last_metric['max_latency']:
                avg_latency = min_latency = max_latency = latency
            elif latency is not None:
                avg_latency = extendavg(last_metric['avg_latency'], num_metrics, latency)

                if latency < last_metric['min_latency']:
                    max_latency = last_metric['max_latency']
                    min_latency = latency
                elif latency > last_metric['max_latency']:
                    min_latency = last_metric['min_latency']
                    max_latency = latency
                else:
                    min_latency = last_metric['min_latency']
                    max_latency = last_metric['max_latency']
            else:
                avg_latency = last_metric['avg_latency']
                min_latency = last_metric['min_latency']
                max_latency = last_metric['max_latency']

            uptime_percentage = extendavg(last_metric['uptime_percentage'], num_metrics, current_uptime_percentage)
            avg_uptime_percentage = extendavg(last_metric['avg_uptime_percentage'], num_metrics, uptime_percentage)

            if uptime_percentage < last_metric['min_uptime_percentage']:
                max_uptime_percentage = last_metric['max_uptime_percentage']
                min_uptime_percentage = uptime_percentage
            elif uptime_percentage > last_metric['max_uptime_percentage']:
                min_uptime_percentage = last_metric['min_uptime_percentage']
                max_uptime_percentage = uptime_percentage
            else:
                max_uptime_percentage = last_metric['max_uptime_percentage']
                min_uptime_percentage = last_metric['min_uptime_percentage']

            self.executeQuery(NEW_METRIC_QUERY, (
                name, 
                timestamp,
                last_uptime, 
                last_downtime,
                
                code, 
                status,
                
                current_uptime_value,
                avg_uptime,
                min_uptime,
                max_uptime,
                
                current_downtime_value,
                avg_downtime,
                min_downtime,
                max_downtime,

                round(latency, 6) if latency else latency, 
                round(avg_latency, 6) if avg_latency else avg_latency,
                round(min_latency, 6) if min_latency else min_latency,
                round(max_latency, 6) if max_latency else max_latency,

                round(uptime_percentage, 3),
                round(avg_uptime_percentage, 3),
                round(min_uptime_percentage, 3),
                round(max_uptime_percentage, 3)
            ))
        except sqlite3.IntegrityError as e: 
            self.connection.rollback()
            raise e
        else:
            self.connection.commit()

    # Reports
    def getReports(self):
        try:
            cursor = self.executeQuery(GET_ALL_REPORTS_QUERY)
            result = cursor.fetchall()
        except sqlite3.IntegrityError as e: raise e
        else: return result

    def addReport(self):
        pass

    def delReport(self):
        pass

    # Events
    def getEvents(self):
        try:
            cursor = self.executeQuery(GET_ALL_EVENTS_QUERY)
            result = cursor.fetchall()
        except sqlite3.IntegrityError as e: raise e
        else: return result
    
    def addEvent(self):
        pass

    def delEvent(self):
        pass