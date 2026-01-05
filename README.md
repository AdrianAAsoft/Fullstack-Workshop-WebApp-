# Fullstack-Workshop-WebApp-
Aplicación web para gestionar talleres de formación profesional
Rama funcional - Func- funciona para Mac evitando el puerto habilitado de la mac

# 📝 Contexto
Permitir a estudiantes y administradores gestionar talleres como cursos técnicos, capacitaciones prácticas y programas de actualización profesional. Además, se implemento una API RESTful para interactuar con los datos de los talleres.

## 💻🗄️📊 Diseño de Base de datos
Base de datos diseñada para el manejo simple de usuarios y estudiantes.  <img width="204" height="101" alt="image" src="https://github.com/user-attachments/assets/53414b41-e702-4454-8c45-40b62a71d024" /> 

Database: Principal

Tables: 
- estudiantes
   -- Columns: id (int, primary key), usrid (int, foreign key)
- registros
   -- Columns: id (int, primary key), workshop_id (int, foreign key), student_id(int,foreign key),registered_at (datetime)
- talleres
  -- Columns: id (int, primary key), usrid (int, foreign key)
- usuarios
  -- Columns: id (int, primary key), nombre (String(25)), , correo (String(100)), contra (String(15)), admin (Boolean)

## 📁 Archivos

```bash
├── Front end               # Front - visual usuario
│   └───src                 # Carpeta fuente del Front
│   │   └───App.tsx         # Archivo contenedor del codigo base del front end typescript
│   │   └───auth.tsx        # Archivo contenedor del codigo de autenticacion typescript
│   │   └───main.tsx        # Archivo contenedor del codigo de autenticacion typescript
│   └──Dockerfile           # archivo docker para upload del Front End
│   └──readme.md            # archivo readme para informacion acerca del Front end
├── Back end                # Back   
│   └──config.py            # Config de variables globales
│   └──.env                 # Enviromental Keys -Funciones ocultas a 3rceros
│   └──models.py            # tables functions and declarations
│   └──resources.py         # api functions
│   └──requirements.txt     # Dependencias python
│   └──Dockerfile           # archivo docker para upload del Back End
│   └──readme.md            # archivo readme para informacion acerca del Back end
├── Dockerfile              # archivo docker para upload de todo
```

## 💻 Lenguajes y 🛠️ Herramientas utilizados
React | TypeScript | Python | MySQL | Vite

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="react" width="40" height="40"/> | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> | 
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="40" height="40"/> | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vite/vite-original.svg" alt="vite" width="40" height="40"/>


## ⚙️ Instalacion de dependencias:
en carpeta backend
```bash
cd Backend
pip install -r requirements.txt
```

## ⚡ Ejecución Global
Ejecuta el programa desde la carpeta de instalacion con:
```bash
npm run dev
```

## ▶️ Ejecución Front End (React-TypeScript js)
- Esto abrira el Front en el local host con el puerto '5173'
- Ejecuta el programa desde la carpeta front end con el siguiente comando:
```bash
npm install
npm run dev
```

## 🐍 Ejecución Back End (Python)
- Esto abrira el Back end en el local host con el puerto ''
- Ejecuta el programa desde la carpeta back end con el siguiente comando Windows CLI:
```bash
python app.py
```
- Ejecuta el programa desde la carpeta back end con el siguiente comando MAC/Linux CLI:
```bash
python3 app.py
```

## 🧪 Ejemplo de Uso
<img width="1031" height="603" alt="image" src="https://github.com/user-attachments/assets/4c5bdd5b-9df2-40d5-9705-347231720a25" />
