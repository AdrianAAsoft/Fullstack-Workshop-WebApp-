from flask import request
from flask_restful import Resource, reqparse
from models import db, Workshop, Student, Registration, User

# Parsers
workshop_parser = reqparse.RequestParser()
workshop_parser.add_argument('title', type=str, required=True, help='Title is required')
workshop_parser.add_argument('description', type=str, required=True, help='Description is required')
workshop_parser.add_argument('date', type=str, required=True, help='Date is required')
workshop_parser.add_argument('time', type=str, required=True, help='Time is required')
workshop_parser.add_argument('location', type=str, required=True, help='Location is required')
workshop_parser.add_argument('category', type=str, required=True, help='Category is required')
workshop_parser.add_argument('capacity', type=int, required=False, default=20)
workshop_parser.add_argument('status', type=str, required=False, default='activo')

student_parser = reqparse.RequestParser()
student_parser.add_argument('studentName', type=str, required=True, help='Name is required')
student_parser.add_argument('studentEmail', type=str, required=True, help='Email is required')

login_parser = reqparse.RequestParser()
login_parser.add_argument('username', type=str, required=True, help='Username is required')
login_parser.add_argument('password', type=str, required=True, help='Password is required')

class LoginResource(Resource):
    def post(self):
        args = login_parser.parse_args()
        user = User.query.filter_by(username=args['username']).first()
        
        if user and user.password == args['password']:
            return {
                "message": "Login successful",
                "user": user.to_dict()
            }, 200
        return {"message": "Invalid credentials"}, 401

class WorkshopListResource(Resource):
    def get(self):
        workshops = Workshop.query.all()
        return [w.to_dict() for w in workshops]

    def post(self):
        args = workshop_parser.parse_args()
        new_workshop = Workshop(
            title=args['title'],
            description=args['description'],
            date=args['date'],
            time=args['time'],
            location=args['location'],
            category=args['category'],
            capacity=args['capacity'],
            status=args['status']
        )
        db.session.add(new_workshop)
        db.session.commit()
        return new_workshop.to_dict(), 201

class WorkshopResource(Resource):
    def get(self, workshop_id):
        workshop = Workshop.query.get_or_404(workshop_id)
        return workshop.to_dict()

    def put(self, workshop_id):
        workshop = Workshop.query.get_or_404(workshop_id)
        args = workshop_parser.parse_args()
        
        workshop.title = args['title']
        workshop.description = args['description']
        workshop.date = args['date']
        workshop.time = args['time']
        workshop.location = args['location']
        workshop.category = args['category']
        if args['capacity']:
            workshop.capacity = args['capacity']
        if args['status']:
            workshop.status = args['status']
        
        db.session.commit()
        return workshop.to_dict()

    def delete(self, workshop_id):
        workshop = Workshop.query.get_or_404(workshop_id)
        # Instead of hard delete, we could set status to 'cancelado'
        # But user might want to delete. Let's keep delete but maybe just mark as canceled if it has registrations?
        # For now, strict delete.
        db.session.delete(workshop)
        db.session.commit()
        return {'message': 'Workshop deleted'}, 200

class WorkshopRegistration(Resource):
    def post(self, workshop_id):
        workshop = Workshop.query.get_or_404(workshop_id)
        args = student_parser.parse_args()
        
        # Check capacity
        if len(workshop.registrations) >= workshop.capacity:
            return {'message': 'Workshop is full'}, 400

        # Find or create student
        email = args['studentEmail']
        name = args['studentName']
        
        student = Student.query.filter_by(email=email).first()
        if not student:
            student = Student(name=name, email=email)
            db.session.add(student)
            db.session.commit() # Commit to get ID
        
        # Check existing registration
        existing = Registration.query.filter_by(workshop_id=workshop_id, student_id=student.id).first()
        if existing:
            return {'message': 'Student already registered for this workshop'}, 400

        new_registration = Registration(
            workshop_id=workshop.id,
            student_id=student.id
        )
        db.session.add(new_registration)
        db.session.commit()
        
        return {
            'message': 'Registration successful',
            'student': student.to_dict(),
            'workshop': workshop.to_dict()
        }, 201
