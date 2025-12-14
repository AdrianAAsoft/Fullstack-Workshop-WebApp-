from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Talleres(db.Model):
    __tablename__ = "Talleres"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    
    # Método to_dict para convertir a diccionario
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

# Optional Students model for Many-to-Many or simple registration log
class Estudiantes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    # relacion de llave foranea(foreign key): Los estudiantes se registran a un taller
    workshop_id = db.Column(db.Integer, db.ForeignKey('Talleres.id'), nullable=True)
    
    # Método to_dict para convertir a diccionario
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "workshop_id": self.workshop_id
        }