import os
from dotenv import load_dotenv

load_dotenv()

URLBase = os.getenv("URL") #URL para verificar backend
URLDB = os.getenv("bdurl") #URL base de datos

class config:
    SQLALCHEMY_DATABASE_URI = URLDB
    SQLALCHEMY_TRACK_MODIFICATIONS = False