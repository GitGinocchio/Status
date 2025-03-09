from typing import Any
import json

with open("./config/config.json", "r") as f:
    config : dict[str, Any] = json.load(f)