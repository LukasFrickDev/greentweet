import re


def extract_hashtags(text):
    if not text:
        return []
    return [tag.lower() for tag in re.findall(r"#(\w+)", text)]

