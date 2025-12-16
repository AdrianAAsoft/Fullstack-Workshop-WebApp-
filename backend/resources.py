from flask import request
from flask_restful import Resource, reqparse
from models import db, Talleres, Estudiantes, Registro, Usuarios

# Parsers
# Separate parsers for create (required fields) and update (optional)
workshop_create_parser = reqparse.RequestParser()
workshop_create_parser.add_argument('title', type=str, required=True, help='Title is required')
workshop_create_parser.add_argument('description', type=str, required=True, help='Description is required')
workshop_create_parser.add_argument('date', type=str, required=True, help='Date is required')
workshop_create_parser.add_argument('time', type=str, required=True, help='Time is required')
workshop_create_parser.add_argument('location', type=str, required=True, help='Location is required')
workshop_create_parser.add_argument('category', type=str, required=True, help='Category is required')
workshop_create_parser.add_argument('capacity', type=int, required=False)

workshop_update_parser = reqparse.RequestParser()
workshop_update_parser.add_argument('title', type=str, required=False)
workshop_update_parser.add_argument('description', type=str, required=False)
workshop_update_parser.add_argument('date', type=str, required=False)
workshop_update_parser.add_argument('time', type=str, required=False)
workshop_update_parser.add_argument('location', type=str, required=False)
workshop_update_parser.add_argument('category', type=str, required=False)
workshop_update_parser.add_argument('capacity', type=int, required=False)
workshop_update_parser.add_argument('status', type=str, required=False)

student_parser = reqparse.RequestParser()
student_parser.add_argument('studentEmail', type=str, required=True, help='studentEmail is required')
student_parser.add_argument('studentName', type=str, required=True, help='studentName is required')

#Clase para listas de talleres
class WorkshopListResource(Resource):
    def get(self):
        workshops = Talleres.query.all()
        return [w.to_dict() for w in workshops]

    def post(self): #post crea talleres
        args = workshop_create_parser.parse_args()
        new_workshop = Talleres(
            name=args['title'],
            description=args['description'],
            date=args['date'],
            time=args['time'],
            location=args['location'],
            category=args['category'],
            capacity=args.get('capacity') or 20
        )
        db.session.add(new_workshop)
        db.session.commit()
        return new_workshop.to_dict(), 201 #201 mensaje de creado un taller

class WorkshopResource(Resource):
    def get(self, workshop_id):
        workshop = Talleres.query.get_or_404(workshop_id)
        return workshop.to_dict()

    def put(self, workshop_id):#put actualiza taller
        workshop = Talleres.query.get_or_404(workshop_id)
        args = workshop_update_parser.parse_args()

        # Update only provided fields
        if args.get('title') is not None:
            workshop.name = args['title']
        if args.get('description') is not None:
            workshop.description = args['description']
        if args.get('date') is not None:
            workshop.date = args['date']
        if args.get('time') is not None:
            workshop.time = args['time']
        if args.get('location') is not None:
            workshop.location = args['location']
        if args.get('category') is not None:
            workshop.category = args['category']
        if args.get('capacity') is not None:
            workshop.capacity = args['capacity']
        if args.get('status') is not None:
            workshop.status = args['status']

        db.session.commit()
        return workshop.to_dict()

    def delete(self, workshop_id):
        workshop = Talleres.query.get_or_404(workshop_id)
        
        db.session.delete(workshop)
        db.session.commit()
        return {'message': 'Workshop deleted'}, 200 #200 mensaje de ok se elimino

#Clase para registro de un estudiante en taller 
class WorkshopRegistration(Resource):
    def post(self, workshop_id):
        workshop = Talleres.query.get_or_404(workshop_id)
        args = student_parser.parse_args()
        
        if len(workshop.registrations) >= workshop.capacity:
            return {'message': 'Workshop is full'}, 400

        # Find or create usuario (Users table) and estudiante (Estudiantes table)
        email = args['studentEmail']
        name = args['studentName']

        usuario = Usuarios.query.filter_by(correo=email).first()
        if not usuario:
            # create a lightweight Usuario record (no password)
            usuario = Usuarios(nombre=name, correo=email, contra='', admin=False)
            db.session.add(usuario)
            db.session.commit()

        # Find or create estudiante linked to usuario
        student = Estudiantes.query.filter_by(usrid=usuario.id).first()
        if not student:
            student = Estudiantes(usrid=usuario.id)
            db.session.add(student)
            db.session.commit() # Commit to get ID
        
        # Check existing registration
        existing = Registro.query.filter_by(workshop_id=workshop_id, student_id=student.id).first()
        if existing:
            return {'message': 'Student already registered for this workshop'}, 400

        new_registration = Registro(
            workshop_id=workshop.id,
            student_id=student.id
        )
        db.session.add(new_registration)
        db.session.commit()
        
        return {
            'message': 'Registration successful',
            'student': student.to_dict(),
            'workshop': workshop.to_dict()
        }, 201 #201 mensaje de creado un registro de un estudiante en un taller


#Clase para el registro de un usuario en el sistema
class UserRegis(Resource):
    def get(self):
        # Opcional: devolver lista de usuarios (sin passwords)
        users = Usuarios.query.all()
        return [u.to_dict() for u in users]

    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        role = data.get('role', 'usuario')

        # Validaciones básicas
        if not email or not password or not name:
            return {'message': 'Faltan campos obligatorios'}, 400

        # Verificar usuario existente
        existing = Usuarios.query.filter_by(correo=email).first()
        if existing:
            return {'message': 'El correo ya está registrado'}, 400

        # Creacion de usuario en base de datos (usar los campos del modelo Usuarios)
        new_user = Usuarios(nombre=name, correo=email, contra=password, admin=(role == 'admin'))
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'Usuario registrado con éxito'}, 201 #estado creado

class LoginUser(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        # Buscar en tabla de usuarios (usar campos del modelo Usuarios)
        user = Usuarios.query.filter_by(correo=email, contra=password).first()
        if not user:
            return {'message': 'Correo o contraseña incorrectos'}, 401
        
        return {'message': 'Inicio de sesión exitoso', 'user': user.to_dict()}, 200