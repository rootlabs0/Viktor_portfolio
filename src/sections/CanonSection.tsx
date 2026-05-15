import InfiniteMenu from '../components/ui/InfiniteMenu'
import { img } from '../lib/img'

const ITEMS = [
  { image: img('/images/DSCF1130.jpg'),         link: '', title: 'Commercial',   description: 'Prague, CZ' },
  { image: img('/images/fontana.jpg'),           link: '', title: 'Urban',        description: 'Rome, IT'   },
  { image: img('/images/villa-tugendhat.jpg'),   link: '', title: 'Architecture', description: 'Brno, CZ'  },
  { image: img('/images/flowers-tugendhat.jpg'), link: '', title: 'Nature',       description: 'Brno, CZ'  },
  { image: img('/images/nophotosynthesis.jpg'),  link: '', title: 'Abstract',     description: 'Berlin, DE' },
  { image: img('/images/stairs.jpg'),            link: '', title: 'Geometric',    description: 'Prague, CZ' },
  { image: img('/images/symmetry.jpg'),          link: '', title: 'Architecture', description: 'Czech Rep.' },
  { image: img('/images/ligthts.jpg'),           link: '', title: 'Night',        description: 'Prague, CZ' },
  { image: img('/images/ruzicka.jpg'),           link: '', title: 'Portrait',     description: 'Prague, CZ' },
  { image: img('/images/cafe.jpg'),              link: '', title: 'Lifestyle',    description: 'Prague, CZ' },
  { image: img('/images/jeraby.jpg'),            link: '', title: 'Urban',        description: 'Czech Rep.' },
  { image: img('/images/tisnov-train.jpg'),      link: '', title: 'Transport',    description: 'Tišnov, CZ' },
]

export default function CanonSection() {
  return (
    <section style={{ width: '100%', height: '100vh', background: '#ffffff', position: 'relative' }}>
      <InfiniteMenu items={ITEMS} scale={1.0} />
    </section>
  )
}
