from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api
from models import db
from resources import WorkshopListResource, WorkshopResource, WorkshopRegistration

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workshops.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
api = Api(app)

db.init_app(app)

# Initialize DB
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return jsonify({"message": "Backend is running!"})

api.add_resource(WorkshopListResource, '/workshops')
api.add_resource(WorkshopResource, '/workshops/<int:workshop_id>')
api.add_resource(WorkshopRegistration, '/workshops/<int:workshop_id>/register')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
