import re

def extract_hashtags(text):
    return [tag.lower() for tag in re.findall(r"#(\w+)", text)]

