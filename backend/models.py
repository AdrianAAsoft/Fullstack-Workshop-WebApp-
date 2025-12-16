from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Usuarios(db.Model):
    __tablename__ = "Usuarios"
    id = db.Column(db.Integer, primary_key=True)
    correo = db.Column(db.String(100),unique=True, nullable=False)
    nombre = db.Column(db.String(25), nullable=False)
    contra = db.Column(db.String(15), nullable=False)
    admin = db.Column(db.Boolean, default=False, nullable=False) #Falso para estudiantes 
    

    estudiante = db.relationship('Estudiantes', backref='usuario', uselist=False, cascade="all, delete-orphan")
    # Método to_dict para convertir a diccionario
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.nombre,
            "email": self.correo,
            # warning: password returned here for compatibility with frontend; consider removing
            "password": self.contra,
            "role": 'admin' if self.admin else 'usuario'
        }
    
class Talleres(db.Model):
    __tablename__ = "Talleres"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer, default=20, nullable=False)
    status = db.Column(db.String(20), default='activo', nullable=False)
    
    # relacion a registros (use the Registro mapper/class name here)
    registrations = db.relationship('Registro', backref='taller', lazy=True, cascade="all, delete-orphan")

    # Método to_dict para convertir a diccionario
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.name,
            "description": self.description,
            "date": self.date,
            "time": self.time,
            "location": self.location,
            "category": self.category,
            "capacity": getattr(self, 'capacity', 20),
            "status": getattr(self, 'status', 'activo'),
            "enrolled": len(self.registrations)
        }

class Estudiantes(db.Model):
    __tablename__ = "Estudiantes"
    id = db.Column(db.Integer, primary_key=True)
    usrid = db.Column(db.Integer,db.ForeignKey('Usuarios.id'),nullable=False,unique=True)

    # relacion de llave foranea(foreign key): Los estudiantes se registran a un taller
    registrations = db.relationship('Registro', backref='estudiante', lazy=True)

    # Método to_dict para convertir a diccionario
    def to_dict(self):
        # Return linked usuario info if available via backref
        user = getattr(self, 'usuario', None)
        return {
            "id": self.id,
            "name": user.nombre if user else None,
            "email": user.correo if user else None
        }

class Registro(db.Model):
    __tablename__ = "Registros"
    id = db.Column(db.Integer, primary_key=True)
    workshop_id = db.Column(db.Integer, db.ForeignKey('Talleres.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('Estudiantes.id'), nullable=False)
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "workshop_id": self.workshop_id,
            "student_id": self.student_id,
            "registered_at": self.registered_at.isoformat()
        }