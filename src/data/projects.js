import mathiaIcon from '../images/youarehere32.ico?url';
import mathiaImg from '../images/youarehere32.png';
import iliasIcon from '../images/ilias.svg?url';
import iliasImg from '../images/ilias2.png';
import polepickIcon from '../images/pole.png?url';
import polepickImg from '../images/polepick.png';
import woodcuttersIcon from '../images/woodcutters.ico?url';
import woodcuttersImg from '../images/woodcutters.png';
import esportsIcon from '../images/esports.ico?url';
import esportsImg from '../images/esports.png';
import amronasIcon from '../images/amronas.svg?url';
import amronasImg from '../images/amronas.png';
import partieIcon from '../images/partie.svg?url';
import partieImg from '../images/partie.png';

export const projects = [
    {
        title: 'Personal Homepage',
        image: mathiaImg,
        icon: mathiaIcon,
        tags: ['Astro', 'Custom CSS', 'Canvas'],
        transKey: 'homepage',
        github: 'https://github.com/LeTammo/homepage',
    },
    {
        title: 'ILIAS - Open Source LMS',
        image: iliasImg,
        icon: iliasIcon,
        tags: ['PHP', 'MySQL', 'JavaScript', 'Maven'],
        transKey: 'ilias',
        demo: 'https://www.ilias.de/',
        github: 'https://github.com/ILIAS-eLearning/ILIAS/issues?q=author%3ALeTammo',
        video: 'https://www.youtube.com/watch?v=ZHiWC_dz-k0',
    },
    {
        title: 'Partie',
        image: partieImg,
        icon: partieIcon,
        tags: ['PHP', 'Symfony', 'Mercure', 'Tailwind CSS'],
        transKey: 'partie',
        demo: 'https://partie.mathia.xyz/',
        github: 'https://github.com/LeTammo/partie',
    },
    {
        title: 'PolePick',
        image: polepickImg,
        icon: polepickIcon,
        tags: ['Node', 'Express', 'Handlebars', 'Tailwind CSS'],
        transKey: 'polepick',
        demo: 'https://pole.mathia.xyz/',
        github: 'https://github.com/LeTammo/polepick',
    },
    {
        title: 'Woodcutters',
        image: woodcuttersImg,
        icon: woodcuttersIcon,
        tags: ['React', 'Node', 'Sockets', 'SQLite', 'Bootstrap'],
        transKey: 'woodcutters',
        demo: 'https://woodcutters.mathia.xyz/',
        github: 'https://github.com/LeTammo/woodcutters',
    },
    {
        title: 'Tournament Tracker',
        image: esportsImg,
        icon: esportsIcon,
        tags: ['Node', 'Express', 'EJS', 'SQLite', 'Cheerio'],
        transKey: 'tournament',
        demo: 'https://esports.mathia.xyz/',
        github: 'https://github.com/LeTammo/Esports-Tournament-Tracker',
    },
    {
        title: 'Amronas',
        image: amronasImg,
        icon: amronasIcon,
        tags: ['PHP', 'Symfony', 'MySQL', 'Twig', 'Docker'],
        transKey: 'amronas',
        demo: 'https://movie.amronas.one/',
        github: 'https://github.com/LeTammo/amronas',
    },
];
