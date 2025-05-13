export interface PromoCode {
  code: string;
  planId: string;
  durationDays: number;
  isActive: boolean;
  createdAt: Date;
  usedBy?: string[];
  maxUses?: number;
}

export interface ActivatedPromotion {
  userId: string;
  promoCode: string;
  planId: string;
  activatedAt: Date;
  expiresAt: Date;
}

// Simula un database di codici promozionali
let promoCodes: PromoCode[] = [];
let activatedPromotions: ActivatedPromotion[] = [];

// Genera un codice promozionale casuale
const generateUniqueCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Crea un nuovo codice promozionale
export const createPromoCode = (planId: string, durationDays: number, maxUses?: number): PromoCode => {
  const newCode: PromoCode = {
    code: generateUniqueCode(),
    planId,
    durationDays,
    isActive: true,
    createdAt: new Date(),
    maxUses,
    usedBy: []
  };

  promoCodes.push(newCode);
  return newCode;
};

// Attiva un codice promozionale per un utente
export const activatePromoCode = (userId: string, code: string): ActivatedPromotion => {
  const promoCode = promoCodes.find(pc => pc.code === code && pc.isActive);
  
  if (!promoCode) {
    throw new Error('Codice promozionale non valido o scaduto');
  }

  if (promoCode.maxUses && promoCode.usedBy && promoCode.usedBy.length >= promoCode.maxUses) {
    throw new Error('Codice promozionale ha raggiunto il numero massimo di utilizzi');
  }

  if (promoCode.usedBy?.includes(userId)) {
    throw new Error('Hai già utilizzato questo codice promozionale');
  }

  const activatedAt = new Date();
  const expiresAt = new Date(activatedAt);
  expiresAt.setDate(expiresAt.getDate() + promoCode.durationDays);

  const activation: ActivatedPromotion = {
    userId,
    promoCode: code,
    planId: promoCode.planId,
    activatedAt,
    expiresAt
  };

  // Aggiorna il codice promozionale
  promoCode.usedBy = [...(promoCode.usedBy || []), userId];
  
  activatedPromotions.push(activation);
  return activation;
};

// Verifica se un utente ha una promozione attiva
export const getActivePromotion = (userId: string): ActivatedPromotion | null => {
  const now = new Date();
  return activatedPromotions.find(
    promo => promo.userId === userId && promo.expiresAt > now
  ) || null;
};

// Ottieni tutti i codici promozionali
export const getAllPromoCodes = (): PromoCode[] => {
  return promoCodes;
};

// Disattiva un codice promozionale
export const deactivatePromoCode = (code: string): void => {
  const promoCode = promoCodes.find(pc => pc.code === code);
  if (promoCode) {
    promoCode.isActive = false;
  }
};
