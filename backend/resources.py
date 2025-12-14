from flask import request
from flask_restful import Resource, reqparse
from models import db, Talleres, Estudiantes

# Parsers
workshop_parser = reqparse.RequestParser()
workshop_parser.add_argument('name', type=str, required=True, help='Name is required')
workshop_parser.add_argument('description', type=str, required=True, help='Description is required')
workshop_parser.add_argument('date', type=str, required=True, help='Date is required')
workshop_parser.add_argument('time', type=str, required=True, help='Time is required')
workshop_parser.add_argument('location', type=str, required=True, help='Location is required')
workshop_parser.add_argument('category', type=str, required=True, help='Category is required')

student_parser = reqparse.RequestParser()
student_parser.add_argument('name', type=str, required=True, help='Name is required')
student_parser.add_argument('email', type=str, required=True, help='Email is required')

#Clase para listas de talleres
class WorkshopListResource(Resource):
    def get(self):
        workshops = Talleres.query.all()
        return [w.to_dict() for w in workshops]

    def post(self): #post crea talleres
        args = workshop_parser.parse_args()
        new_workshop = Talleres(
            name=args['name'],
            description=args['description'],
            date=args['date'],
            time=args['time'],
            location=args['location'],
            category=args['category']
        )
        db.session.add(new_workshop)
        db.session.commit()
        return new_workshop.to_dict(), 201 #201 mensaje de creado un taller
    
#Clase para talleres
class WorkshopResource(Resource):
    def get(self, workshop_id):
        workshop = Talleres.query.get_or_404(workshop_id)
        return workshop.to_dict() #Un get que retorna un taller en especifico si existe mediante llave o id en este caso id

    def put(self, workshop_id): #put actualiza taller
        workshop = Talleres.query.get_or_404(workshop_id)
        args = workshop_parser.parse_args()
        
        workshop.name = args['name']
        workshop.description = args['description']
        workshop.date = args['date']
        workshop.time = args['time']
        workshop.location = args['location']
        workshop.category = args['category']
        
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
        
        # Comprobar si el estudiante ya está registrado en este taller (OPCIONAL NO IMPLEMENTADO)
        # existing_student = Student.query.filter_by(email=args['email'], workshop_id=workshop_id).first()
        # if existing_student:
        #     return {'message': 'Student already registered'}, 400

        new_student = Estudiantes(
            name=args['name'],
            email=args['email'],
            workshop_id=workshop.id
        )
        db.session.add(new_student)
        db.session.commit()
        
        return {
            'message': 'Registration successful',
            'student': new_student.to_dict(),
            'workshop': workshop.to_dict()
        }, 201 #201 mensaje de creado un registro de un estudiante en un taller
