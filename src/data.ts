import { Report, Article, LeaderboardEntry, QuizQuestion, RecyclingItem } from './types';

export const initialReports: Report[] = [
  {
    id: 'report-1',
    type: 'organic',
    title: 'Composteur collectif qui déborde',
    category: 'Déchets Organiques',
    location: 'Avenue de la République, près du Parc Central',
    latPercent: 33,
    lngPercent: 25,
    status: 'En cours',
    priority: 'Moyenne',
    reportedBy: 'Citoyen Éco #429',
    reportedTime: 'Il y a 2h',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB67dhfrAdlm5JqTDUKP5CO4RLswc9g1ETU-suHvalL0Aq9_VD3zOLH2qQYi_bo7HCuPmlhlmEkTa0FNsDchvxUnBcmxRgji0evmnWJJ22KTnavd9r7f1-ebllLJiLuVBtr5gUz3xen_SvPxjRADam8zHXY6KWWNBxgx55HyauM0F12zWf_nTkuiZxMYTcuQMNRWwJaPetQOJSaD907wmfN8tEkfQkCEG-BOSZvZczaJrr2LPH-mCI',
    details: 'Le bac à compost déborde complètement. Des épluchures et des cartons de pizza ont été déposés à côté. Une odeur forte commence à se faire sentir.'
  },
  {
    id: 'report-2',
    type: 'plastic',
    title: 'Dépôt sauvage de bouteilles en plastique',
    category: 'Plastiques / Recyclage',
    location: 'Boulevard Victor Hugo, Angle Gare',
    latPercent: 50,
    lngPercent: 66,
    status: 'En attente',
    priority: 'Élevée',
    reportedBy: 'Citoyen Éco #112',
    reportedTime: 'Il y a 4h',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsJde4en4BoNGD43btPgd52VqxEKHauMb9fSqAbp3-G4k1pyBqKfMkjyu-1nu82cYsoTIVY3czgXROM4HGgZJloPiYUen1dZvyExovuMsYQ9LuCRQgpjE24S614rvBHMn_PkgaEJ6I6xcLnZCjdQNFTZuJ1dwdN-esg5zxS0-JXxjNs9q5TG1ZkO0N-uGvsue-TGnlkistNzFXWIWFyriXI-AScnsoxTREuv4JSoOcsEoe7oDLvA0',
    details: 'Plusieurs sacs contenant des bouteilles plastiques, canettes dures et autres contenants recyclables ont été jetés sur le trottoir en dehors des poubelles appropriées.'
  },
  {
    id: 'report-3',
    type: 'waste',
    title: 'Poubelle publique dégradée',
    category: 'Déchets Résiduels',
    location: 'Place du Marché, devant le cinéma',
    latPercent: 67,
    lngPercent: 33,
    status: 'Résolu',
    priority: 'Faible',
    reportedBy: 'Citoyen Éco #884',
    reportedTime: 'Hier',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzowMbkVD4DSXdzTllVrXq0wuD761AFdy6V3fvV_p22lwGwXIefJoMGq2Ey1vlLhPQC3wQfnZcHCYfRPTfzbez9oX7K3iNk0_NfiDKsEQp5t9R-tJU5SnGsgWUHHtbEn5hVO0rJMyxwa2IhZ4KW8LPVNOyUMo4smmZqKzmCjPDGS8ivjRAeo4sow8pRNorAapZB762oQzBS7EjPhNRf_1w5rxfSt68X3wGwOh2yMHAuXQe10myXks',
    details: 'Le couvercle de la poubelle publique est arraché, ce qui laisse les déchets s\'envoler avec le vent. Signalé et réparé le lendemain matin par les agents municipaux.'
  }
];

export const articles: Article[] = [
  {
    id: 'art-1',
    title: 'Guide du Compostage Urbain 101',
    summary: 'Apprenez à transformer vos épluchures de cuisine en un véritable or noir pour vos plantes, même en appartement.',
    content: `Le compostage n'est pas réservé aux possesseurs de grands jardins. En milieu urbain, il est désormais possible et extrêmement facile de recycler ses biodéchets. 

### Pourquoi composter en ville ?
Près d'un tiers de nos poubelles ménagères est constitué de déchets organiques (épluchures de légumes, restes de repas, marc de café, carton brut). En les compostant, vous réduisez drastiquement le volume de vos déchets résiduels envoyés à l'incinération, tout en produisant un terreau fertile de première qualité.

### Les différentes solutions :
1. **Le lombricomposteur d'appartement** : Une solution compacte et inodore qui utilise des vers de terreau pour transformer rapidement vos restes de cuisine.
2. **Le compostage de quartier** : De nombreuses municipalités installent des bacs collectifs au coin des rues ou dans les parcs de quartier.
3. **Le bac à compost collectif d'immeuble** : Un excellent moyen de créer du lien social avec vos voisins de copropriété.

### Que peut-on y mettre ?
- **Matières vertes (azotées)** : Épluchures de fruits et légumes, marc de café, thé, fleurs fanées.
- **Matières marrons (carbonées)** : Coquilles d'œufs concassées, rouleaux de papier essuie-tout non imprimés, petits cartons non blanchis découpés en morceaux.`,
    readTime: '5 min',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZPuFRMAtqB6BmvODZ0UrvsEPw4weBZbu8J6y9_fDMg2m1HibPpWdR1k1Bl31Z7e4dBGJ4QIhkdNjCQoivxwXkyKLhM70-lzh2mxv3kUsexOD-15YSx3TcqtgUVXjSsRx163gs9OsFoUZLKXia2bH4pitzRdbIzQ5hMhTrAjra95IBNvVvqSiDUzMt5sZ3ioE36IweYvQy0wnvCSYRXCdxO4z2-1BncLnMgsP0K0stD99Vj7wl_DY',
    author: 'L\'équipe Éco Eco-Kin City',
    category: 'Compostage'
  },
  {
    id: 'art-2',
    title: 'Vers un quotidien sans plastique',
    summary: 'Quelques gestes simples lors de vos courses qui réduisent drastiquement la pollution plastique des océans.',
    content: `Chaque année, plus de 8 millions de tonnes de plastique finissent dans nos océans, causant des ravages irréversibles sur la biodiversité marine. Pourtant, entamer une transition vers le zéro déchet plastique est à la portée de tous.

### Les 5 gestes réflexes du quotidien :
1. **Adoptez les cabas réutilisables et sachets en tissu** : Refusez systématiquement les sacs jetables aux caisses et achetez vos fruits et légumes en vrac.
2. **Optez pour une gourde en acier inoxydable** : Évitez l'achat de bouteilles en plastique à usage unique. Une gourde vous accompagnera pendant des années et gardera vos boissons fraîches !
3. **Passez aux cosmétiques solides** : Les shampoings, savons et déodorants solides se débarrassent des flacons en plastique encombrants et durent généralement deux à trois fois plus longtemps.
4. **Utilisez des bocaux en verre** : Achetez des aliments secs (pâtes, riz, lentilles, noix) en vrac et conservez-les dans des bocaux esthétiques dans votre cuisine.
5. **Préférez les emballages durables (BeeWraps)** : Remplacez le film étirable transparent par des emballages en tissu enduits de cire d'abeille lavables et réutilisables.`,
    readTime: '8 min',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsJde4en4BoNGD43btPgd52VqxEKHauMb9fSqAbp3-G4k1pyBqKfMkjyu-1nu82cYsoTIVY3czgXROM4HGgZJloPiYUen1dZvyExovuMsYQ9LuCRQgpjE24S614rvBHMn_PkgaEJ6I6xcLnZCjdQNFTZuJ1dwdN-esg5zxS0-JXxjNs9q5TG1ZkO0N-uGvsue-TGnlkistNzFXWIWFyriXI-AScnsoxTREuv4JSoOcsEoe7oDLvA0',
    author: 'Sarah Green',
    category: 'Zéro Déchet'
  },
  {
    id: 'art-3',
    title: 'L\'Intelligence Artificielle au service du tri',
    summary: 'Comment Eco-Kin City implémente le Machine Learning pour prédire l\'encombrement des poubelles intelligentes de la ville.',
    content: `La gestion des déchets urbains entre dans une nouvelle ère technologique. Eco-Kin City déploie actuellement un réseau de capteurs connectés et d'algorithmes d'Intelligence Artificielle pour optimiser la logistique de ramassage municipal.

### Le problème des ramassages classiques :
Traditionnellement, les camions poubelles suivent des itinéraires fixes, passant vider des conteneurs parfois à moitié vides, tout en ignorant d'autres conteneurs qui débordent déjà. Ce système génère des coûts élevés, une pollution de l'air inutile et des nuisances sonores répétées.

### La solution Eco-Kin City IA :
1. **Capteurs ultrasoniques de remplissage** : Installés sous les couvercles des poubelles publiques, ils mesurent en temps réel le niveau de remplissage des bacs.
2. **Algorithme d'optimisation d'itinéraire** : À partir des données de remplissage collectées, une IA calcule chaque matin la feuille de route idéale pour les conducteurs de camions de collecte, évitant de rouler pour des poubelles vides.
3. **Maintenance prédictive** : L'IA identifie les conteneurs montrant des signes de dégradation ou des défaillances de fermeture pour déclencher une intervention rapide des techniciens avant l'apparition de nuisances.`,
    readTime: '12 min',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzowMbkVD4DSXdzTllVrXq0wuD761AFdy6V3fvV_p22lwGwXIefJoMGq2Ey1vlLhPQC3wQfnZcHCYfRPTfzbez9oX7K3iNk0_NfiDKsEQp5t9R-tJU5SnGsgWUHHtbEn5hVO0rJMyxwa2IhZ4KW8LPVNOyUMo4smmZqKzmCjPDGS8ivjRAeo4sow8pRNorAapZB762oQzBS7EjPhNRf_1w5rxfSt68X3wGwOh2yMHAuXQe10myXks',
    author: 'L\'équipe Innovation',
    category: 'Technologie'
  }
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Elena Rodriguez', points: 2450, avatarColor: 'bg-emerald-500 text-white' },
  { rank: 2, name: 'Marcus Chen', points: 2120, avatarColor: 'bg-blue-500 text-white' },
  { rank: 3, name: 'Sarah Jenkins', points: 1980, avatarColor: 'bg-amber-500 text-white' },
  { rank: 4, name: 'Yuki Tanaka', points: 1850, avatarColor: 'bg-indigo-500 text-white' },
  { rank: 5, name: 'Alexandre Dubois', points: 1710, avatarColor: 'bg-purple-500 text-white' }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Combien de temps faut-il en moyenne pour qu\'une bouteille plastique se décompose dans la nature ?',
    options: [
      'Environ 50 ans',
      'Environ 150 ans',
      'Environ 450 ans',
      'Elle ne se décompose jamais vraiment'
    ],
    correctIndex: 2,
    explanation: 'Une bouteille en plastique met en moyenne 450 ans à se dégrader. Durant ce processus, elle se fragmente en microplastiques toxiques qui contaminent la faune et la chaîne alimentaire.'
  },
  {
    id: 2,
    question: 'Quel déchet ne doit ABSOLUMENT pas être mis dans le bac de compostage ?',
    options: [
      'Le marc de café et ses filtres en papier',
      'Les restes de viande et produits laitiers',
      'Les coquilles d\'œufs écrasées',
      'Les mouchoirs en papier non imprimés'
    ],
    correctIndex: 1,
    explanation: 'Les restes de viande, poisson, graisses et produits laitiers sont déconseillés dans les composteurs classiques. Ils mettent du temps à se dégrader, génèrent de fortes odeurs et attirent les rongeurs nuisibles.'
  },
  {
    id: 3,
    question: 'Que signifie l\'abréviation "PET" inscrite sur de nombreux emballages recyclables ?',
    options: [
      'Polyéthylène Téréphtalate',
      'Plastique Écologique Trié',
      'Polyester Éthylène Thermosensible',
      'Polymère Élastomère Traité'
    ],
    correctIndex: 0,
    explanation: 'Le PET (Polyéthylène Téréphtalate) est un plastique de type 1 largement utilisé pour les bouteilles d\'eau et de sodas. Il est entièrement et facilement recyclable pour fabriquer de nouvelles bouteilles ou fibres textiles.'
  },
  {
    id: 4,
    question: 'Quel est l\'impact environnemental le plus direct du recyclage d\'une tonne de carton ?',
    options: [
      'La sauvegarde de 17 arbres et l\'économie de 26 000 litres d\'eau',
      'L\'élimination complète des émissions de gaz d\'immeubles',
      'La réduction à 100% de la pollution atmosphérique',
      'La création automatique de 15 emplois durables'
    ],
    correctIndex: 0,
    explanation: 'Recycler 1 tonne de carton permet d\'économiser environ 17 arbres, 26 000 litres d\'eau et d\'éviter le rejet de 2,5 tonnes de CO2 dans l\'atmosphère par rapport à la fabrication de carton neuf.'
  }
];

export const recyclingGuideItems: RecyclingItem[] = [
  { name: 'Boîte de pizza', category: 'Paper', instructions: 'Mettre dans le bac jaune (papiers/cartons). Les petites taches de gras sont acceptées si la boîte est vide.' },
  { name: 'Bouteille d\'eau en plastique', category: 'Plastic', instructions: 'Vider, laisser le bouchon dessus (il se recycle aussi !) et jeter dans le bac jaune.' },
  { name: 'Épluchures de carottes', category: 'Organic', instructions: 'À jeter dans le bac à compost ménager ou collectif de quartier.' },
  { name: 'Piles alcalines', category: 'Hazardous', instructions: 'Ne pas jeter à la poubelle ! À ramener dans un point de collecte spécifique (supermarché, déchetterie).' },
  { name: 'Smartphone en panne', category: 'Electronic', instructions: 'À rapporter dans un magasin d\'électroménager ou en déchetterie pour démantèlement sécurisé.' },
  { name: 'Bocal de confiture en verre', category: 'Plastic', instructions: 'Vider (pas besoin de le laver), retirer le couvercle métallique et le jeter dans le conteneur à verre.' },
  { name: 'Restes de poisson', category: 'Organic', instructions: 'De préférence dans la poubelle d\'ordures ménagères ordinaires pour éviter les nuisances olfactives du compost.' },
  { name: 'Ampoule LED', category: 'Electronic', instructions: 'À déposer dans les bacs de collecte spécifiques des magasins ou en déchetterie.' },
  { name: 'Carton d\'emballage de colis', category: 'Paper', instructions: 'Retirer le ruban adhésif en plastique, plier à plat et jeter dans le bac jaune.' }
];
