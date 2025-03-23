from utils.config import config
import re


def isonline(code : int | str): 
    return re.match(config['success-codes'], str(code)) is not None