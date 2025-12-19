export type SamplePhoto = {
  id: string;
  url: string;
  fileName: string;
  label: string;
  tag: string;
};

export const SAMPLE_PHOTO_LIBRARY: SamplePhoto[] = [
  {
    id: 'sample-photo-1',
    url: 'https://images.unsplash.com/photo-1505692794403-35b0fd4d731b?auto=format&fit=crop&w=1600&q=80',
    fileName: 'skyline-day.jpg',
    label: 'City skyline during the day',
    tag: 'Exterior'
  },
  {
    id: 'sample-photo-2',
    url: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
    fileName: 'skyline-night.jpg',
    label: 'City skyline at night',
    tag: 'Exterior'
  },
  {
    id: 'sample-photo-3',
    url: 'https://images.unsplash.com/photo-1512914890250-353c57ed1eb8?auto=format&fit=crop&w=1600&q=80',
    fileName: 'lobby.jpg',
    label: 'Lobby entrance with seating',
    tag: 'Interior'
  },
  {
    id: 'sample-photo-4',
    url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80',
    fileName: 'kitchen.jpg',
    label: 'Modern kitchen with island',
    tag: 'Interior'
  },
  {
    id: 'sample-photo-5',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
    fileName: 'pool.jpg',
    label: 'Infinity pool with skyline view',
    tag: 'Facilities'
  },
  {
    id: 'sample-photo-6',
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
    fileName: 'living-room.jpg',
    label: 'Living room with floor-to-ceiling windows',
    tag: 'Interior'
  },
  {
    id: 'sample-photo-7',
    url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80',
    fileName: 'bedroom.jpg',
    label: 'Master bedroom with natural light',
    tag: 'Interior'
  },
  {
    id: 'sample-photo-8',
    url: 'https://images.unsplash.com/photo-1522158637959-30385a09e0da?auto=format&fit=crop&w=1600&q=80',
    fileName: 'balcony.jpg',
    label: 'Balcony overlooking the city',
    tag: 'Exterior'
  },
  {
    id: 'sample-photo-9',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
    fileName: 'bathroom.jpg',
    label: 'Ensuite bathroom with marble finishes',
    tag: 'Interior'
  },
  {
    id: 'sample-photo-10',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
    fileName: 'fitness.jpg',
    label: 'Fitness centre with modern equipment',
    tag: 'Facilities'
  }
];

export const PROJECT_PHOTO_LIBRARY: SamplePhoto[] = [
  {
    id: 'project-photo-1',
    url: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80',
    fileName: 'project-tower-1.jpg',
    label: 'Developer-provided exterior shot',
    tag: 'Project'
  },
  {
    id: 'project-photo-2',
    url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
    fileName: 'project-tower-2.jpg',
    label: 'Facade with landscaping',
    tag: 'Project'
  },
  {
    id: 'project-photo-3',
    url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    fileName: 'project-tower-3.jpg',
    label: 'View from street level',
    tag: 'Project'
  }
];
