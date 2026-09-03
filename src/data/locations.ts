export interface CityLocation {
  city: string;
  state: string;
  neighborhoods: string[];
}

export const POPULAR_LOCATIONS: CityLocation[] = [
  {
    city: 'Natal',
    state: 'RN',
    neighborhoods: [
      'Ponta Negra',
      'Tirol',
      'Petrópolis',
      'Candelária',
      'Capim Macio',
      'Lagoa Nova',
      'Morro Branco',
      'Alecrim',
      'Ribeira',
      'Planalto',
      'Pajuçara',
      'Redinha',
    ],
  },
  {
    city: 'Parnamirim',
    state: 'RN',
    neighborhoods: [
      'Nova Parnamirim',
      'Emaús',
      'Parque das Nações',
      'Passagem de Areia',
      'Centro',
      'Boa Esperança',
      'Pirangi do Norte',
    ],
  },
  {
    city: 'São Gonçalo do Amarante',
    state: 'RN',
    neighborhoods: [
      'Centro',
      'Jardim Lola',
      'Amarante',
      'Santo Antônio',
      'Golandim',
    ],
  },
  {
    city: 'Macaíba',
    state: 'RN',
    neighborhoods: [
      'Centro',
      'Campo das Mangueiras',
      'Morada da Fé',
      'Vilar de Cima',
    ],
  },
  {
    city: 'Mossoró',
    state: 'RN',
    neighborhoods: [
      'Abolição',
      'Nova Betânia',
      'Centro',
      'Santo Antônio',
      'Doze Anos',
      'Aeroporto',
    ],
  },
  {
    city: 'João Pessoa',
    state: 'PB',
    neighborhoods: ['Manaíra', 'Tambaú', 'Cabo Branco', 'Bessa', 'Altiplano'],
  },
  {
    city: 'Recife',
    state: 'PE',
    neighborhoods: ['Boa Viagem', 'Graças', 'Espinheiro', 'Pina', 'Casa Forte'],
  },
  {
    city: 'Fortaleza',
    state: 'CE',
    neighborhoods: ['Meireles', 'Aldeota', 'Cocó', 'Papicu', 'Fátima'],
  },
];

export const ALL_STATES = [
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'CE', name: 'Ceará' },
  { code: 'BA', name: 'Bahia' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'PR', name: 'Paraná' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'RS', name: 'Rio Grande do Sul' },
];
