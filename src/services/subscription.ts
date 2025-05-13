import axios from 'axios';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  trialDays: number;
  stripePriceId: string;
  originalPrice?: string; // Aggiunta come opzionale
  discount?: string;    // Aggiunta come opzionale
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'trialing' | 'canceled' | 'expired';
  trialEndsAt?: Date;
  currentPeriodEnd: Date;
}

const API_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY;
const STRIPE_API_ENDPOINT = 'https://api.stripe.com/v1';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '€0/mese',
    features: [
      'Generazione contenuti base',
      'Crediti limitati',
      'Contenuti con watermark',
      'Supporto standard',
      '7 giorni di prova gratuita'
    ],
    trialDays: 7,
    stripePriceId: ''
  },
  {
    id: 'pro-basic',
    name: 'PRO Basic',
    price: '€9.99/mese',
    originalPrice: '€14.99/mese',
    discount: '33% di sconto',
    features: [
      'Generazione contenuti avanzata',
      'Più crediti',
      'Nessun watermark',
      'Supporto prioritario',
      '14 giorni di prova gratuita',
      'Risparmia €60 all\'anno'
    ],
    trialDays: 14,
    stripePriceId: 'price_basic'
  },
  {
    id: 'pro-plus',
    name: 'PRO Plus',
    price: '€19.99/mese',
    originalPrice: '€29.99/mese',
    discount: '33% di sconto',
    features: [
      'Generazione contenuti premium',
      'Crediti illimitati',
      'Branding personalizzato',
      'Supporto prioritario 24/7',
      '14 giorni di prova gratuita',
      'Risparmia €120 all\'anno',
      'Bonus: 3 template premium'
    ],
    trialDays: 14,
    stripePriceId: 'price_plus'
  },
  {
    id: 'pro-premium',
    name: 'PRO Premium',
    price: '€49.99/mese',
    originalPrice: '€79.99/mese',
    discount: '38% di sconto',
    features: [
      'Generazione contenuti enterprise',
      'Tutto illimitato',
      'Opzioni white-label',
      'Manager di supporto dedicato',
      '14 giorni di prova gratuita',
      'Risparmia €360 all\'anno',
      'Bonus: 10 template premium',
      'Consulenza strategica gratuita'
    ],
    trialDays: 14,
    stripePriceId: 'price_premium'
  }
];

export const createSubscription = async (customerId: string, priceId: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${STRIPE_API_ENDPOINT}/subscriptions`,
      {
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: subscriptionPlans.find(plan => plan.stripePriceId === priceId)?.trialDays || 0
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Errore durante la creazione dell\'abbonamento:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string): Promise<any> => {
  try {
    const response = await axios.delete(
      `${STRIPE_API_ENDPOINT}/subscriptions/${subscriptionId}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Errore durante la cancellazione dell\'abbonamento:', error);
    throw error;
  }
};

export const updateSubscription = async (subscriptionId: string, newPriceId: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${STRIPE_API_ENDPOINT}/subscriptions/${subscriptionId}`,
      {
        items: [{ price: newPriceId }]
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'abbonamento:', error);
    throw error;
  }
};
