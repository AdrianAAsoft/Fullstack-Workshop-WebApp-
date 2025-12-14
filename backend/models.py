from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Workshop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "date": self.date,
            "time": self.time,
            "location": self.location,
            "category": self.category
        }

# Optional Student model for Many-to-Many or simple registration log
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    # Simple relationship: Student registers for a Workshop
    workshop_id = db.Column(db.Integer, db.ForeignKey('workshop.id'), nullable=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "workshop_id": self.workshop_id
        }
