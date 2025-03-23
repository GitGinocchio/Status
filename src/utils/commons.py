from utils.config import config
import re


def isonline(code : int | str): 
    print(config['success-codes'], str(code), re.match(config['success-codes'], str(code)))
    return re.match(config['success-codes'], str(code)) is not None