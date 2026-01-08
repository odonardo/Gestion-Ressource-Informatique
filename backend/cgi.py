# cgi.py - Fichier de contournement pour Python 3.13
# Ceci est une solution temporaire

import sys
import io

class FieldStorage:
    def __init__(self, fp=None, headers=None, outerboundary=b'',
                 environ=..., keep_blank_values=0, strict_parsing=0,
                 limit=None, encoding='utf-8', errors='replace'):
        self.fp = fp or io.BytesIO()
        self.headers = headers or {}
        self.list = []

def parse_header(string):
    return string.split(';', 1)[0].strip(), {}

def parse_multipart(fp, pdict):
    return {}