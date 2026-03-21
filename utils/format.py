import json
from pydantic import ValidationError

def validate_and_parse(raw_output, schema):
    data = json.loads(raw_output)
    return schema(**data)