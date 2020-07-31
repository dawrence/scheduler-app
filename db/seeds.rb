# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Car.create(plate: 'SRD444', status: 'available', available_hours: 16)
Car.create(plate: 'DFR444', status: 'available', available_hours: 16)
Car.create(plate: 'DFS235', status: 'available', available_hours: 16)
Car.create(plate: 'GKR565', status: 'available', available_hours: 16)
Car.create(plate: 'SDF342', status: 'available', available_hours: 16)
Car.create(plate: 'ALL444', status: 'available', available_hours: 16)

Motorcycle.create(plate: 'FFF444', status: 'available', available_hours: 16)
Motorcycle.create(plate: 'FTR506', status: 'available', available_hours: 16)
Motorcycle.create(plate: 'LFO595', status: 'available', available_hours: 16)
Motorcycle.create(plate: 'LLS404', status: 'available', available_hours: 16)
Motorcycle.create(plate: 'FKF404', status: 'available', available_hours: 16)
Motorcycle.create(plate: 'DDL333', status: 'available', available_hours: 16)

Instructor.create(full_name: 'Pedro Perez', id_number: '43425235234', email: 'pedroperez@gmail.com', phone: '3433393', available_hours: 16)
Instructor.create(full_name: 'German Perez', id_number: '2464624624', email: 'effg@gmail.com', phone: '3433393', available_hours: 16)
Instructor.create(full_name: 'Rodrigo Perez', id_number: '2452452', email: 'fgfg@gmail.com', phone: '3433393', available_hours: 16)
Instructor.create(full_name: 'Juan Lopez', id_number: '2646246', email: 'fgfg@gmail.com', phone: '3433393', available_hours: 16)
Instructor.create(full_name: 'David Giraldo', id_number: '246246246', email: 'hrhrh@gmail.com', phone: '3433393', available_hours: 16)
Instructor.create(full_name: 'Jhon Jhonson', id_number: '242474747', email: 'grgr@gmail.com', phone: '3433393', available_hours: 16)
Instructor.create(full_name: 'Cristian Rodriguez', id_number: '75745654', email: 'hrrh@gmail.com', phone: '3433393', available_hours: 16)
Instructor.create(full_name: 'Otto Jimenez', id_number: '7653456765', email: 'grgr @gmail.com', phone: '3433393', available_hours: 16)


Student.create(full_name: 'Pedro Perez', id_number: '43425235234', email: 'pedroperez@gmail.com', phone: '3433393')
Student.create(full_name: 'German Perez', id_number: '2464624624', email: 'effg@gmail.com', phone: '3433393')
Student.create(full_name: 'Rodrigo Perez', id_number: '2452452', email: 'fgfg@gmail.com', phone: '3433393')
Student.create(full_name: 'Juan Lopez', id_number: '2646246', email: 'fgfg@gmail.com', phone: '3433393')
Student.create(full_name: 'David Giraldo', id_number: '246246246', email: 'hrhrh@gmail.com', phone: '3433393')
Student.create(full_name: 'Jhon Jhonson', id_number: '242474747', email: 'grgr@gmail.com', phone: '3433393')
Student.create(full_name: 'Cristian Rodriguez', id_number: '75745654', email: 'hrrh@gmail.com', phone: '3433393')
Student.create(full_name: 'Otto Jimenez', id_number: '7653456765', email: 'grgr @gmail.com', phone: '3433393')
