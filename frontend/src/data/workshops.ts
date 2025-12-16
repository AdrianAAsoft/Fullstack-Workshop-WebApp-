import { Workshop } from '../types';

export const initialWorkshops: Workshop[] = [
  {
    id: 'ws-1',
    title: 'Introducción a Desarrollo Web',
    category: 'Tecnología',
    location: 'Laboratorio A',
    date: '2025-02-10',
    time: '18:00',
    capacity: 24,
    enrolled: 18,
    status: 'activo',
    description: 'Fundamentos de HTML, CSS y JavaScript para construir landing pages modernas.'
  },
  {
    id: 'ws-2',
    title: 'Habilidades Blandas para Líderes',
    category: 'Habilidades Blandas',
    location: 'Sala 3',
    date: '2025-02-15',
    time: '10:00',
    capacity: 30,
    enrolled: 12,
    status: 'activo',
    description: 'Taller interactivo sobre comunicación asertiva, retroalimentación y liderazgo adaptable.'
  },
  {
    id: 'ws-3',
    title: 'Emprendimiento Digital',
    category: 'Emprendimiento',
    location: 'Aula Innovación',
    date: '2025-02-20',
    time: '19:00',
    capacity: 20,
    enrolled: 8,
    status: 'activo',
    description: 'Cómo validar ideas de negocio, diseñar un MVP y preparar un pitch ganador.'
  }
];
