from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Usuarios(db.Model):
    __tablename__ = "Usuarios"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(25), nullable=False)
    correo = db.Column(db.String(100), nullable=False)
    contra = db.Column(db.String(15), nullable=False)
    admin = db.Column(db.Boolean, default=False, nullable=False) #Falso para estudiantes 
    
    estudiante = db.relationship('Estudiantes',backref='Usuarios',uselist=False,cascade="all, delete-orphan")
    # Método to_dict para convertir a diccionario
    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "correo": self.correo,
            "contra": self.contra,
            "admin": self.admin,
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
    
    # relacion a registros
    registrations = db.relationship('Registros', backref='Talleres', lazy=True, cascade="all, delete-orphan")

    # Método to_dict para convertir a diccionario
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "date": self.date,
            "time": self.time,
            "location": self.location,
            "category": self.category,
            "capacity": self.capacity,
            "status": self.status,
            "enrolled": len(self.registrations)
        }

class Estudiantes(db.Model):
    __tablename__ = "Estudiantes"
    id = db.Column(db.Integer, primary_key=True)
    usrid = db.Column(db.Integer,db.ForeignKey('Usuarios.id'),nullable=False,unique=True)

    # relacion de llave foranea(foreign key): Los estudiantes se registran a un taller
    registrations = db.relationship('Registros', backref='Estudiantes', lazy=True)

    # Método to_dict para convertir a diccionario
    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.usuarios.nombre,
            "correo": self.usuarios.correo
        }

class Registro(db.Model):
    __tablename__ = "Registros"
    id = db.Column(db.Integer, primary_key=True)
    workshop_id = db.Column(db.Integer, db.ForeignKey('Talleres.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('Estudiantes.id'), nullable=False)
    #registered_at = db.Column(db.DateTime, default=dat.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "workshop_id": self.workshop_id
        }