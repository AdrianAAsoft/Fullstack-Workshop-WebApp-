import os
from dotenv import load_dotenv

load_dotenv()

URLBase = os.getenv("URL")
URLDB = os.getenv("bdurl")

class appcnf:
    SQLALCHEMY_DATABASE_URI= URLBase
    SLQALCHEMY_TRACK_MODIFICATIONS = False