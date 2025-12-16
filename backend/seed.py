from app import app, db
from models import User, Workshop, Student, Registration
from datetime import datetime

def seed_data():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Create Users
        admin = User(username='admin', password='admin123', role='admin')
        student = User(username='student', password='student123', role='student')
        
        db.session.add(admin)
        db.session.add(student)

        # Create Workshops
        workshop1 = Workshop(
            title="Taller de Python Avanzado",
            description="Aprende características avanzadas de Python como decoradores, generadores y metaclases.",
            date="2025-01-15",
            time="10:00",
            location="Sala 1",
            category="Programación",
            capacity=20,
            status="activo"
        )

        workshop2 = Workshop(
            title="Diseño UX/UI para Principiantes",
            description="Fundamentos de diseño de experiencia de usuario e interfaces.",
            date="2025-01-20",
            time="14:00",
            location="Sala 3",
            category="Diseño",
            capacity=15,
            status="activo"
        )
        
        db.session.add(workshop1)
        db.session.add(workshop2)
        
        # Commit all
        db.session.commit()
        
        print("Database seeded successfully!")
        print("Users created:")
        print(" - Admin: admin / admin123")
        print(" - Student: student / student123")
        print("Workshops created: 2")

if __name__ == '__main__':
    seed_data()
